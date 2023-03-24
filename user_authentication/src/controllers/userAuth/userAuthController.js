const bcrypt = require("bcryptjs");
const setCookie = require("../../helpers/functions/manageCookie");
const { selectUserAppModel } = require("../../helpers/tenantDbHelper");

const signupUser = async (req, res) => {
  try {
    //* GET TENANT ID
    const tenantId = req.body.tenantId.toString();
    const { name, email, password } = req.body;

    //* FIND USER WITH EMAIL
    let User = await selectUserAppModel(tenantId, "users", "userSchema");
    const existingUser = await User.findOne({ email: req.body.email });

    //* CHECK IF USER EXIST OR NOT
    if (existingUser) {
      throw {
        email: {
          message: "User with this email already exists",
        },
      };
    }

    //* CREATE NEW USER
    const user = new User({
      name,
      email,
      password,
      tenantId: tenantId,
    });
    await user.save();
    console.log("new user");

    //* GENERATE TOKENS
    const { accessToken, refreshToken } = await user.generateAuthToken();
    setCookie(res, accessToken, refreshToken);
    req.user = user;
    res.status(200).send({
      user: { name: user.name, email: user.email, role: user.role, _id: user._id },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

const loginUser = async (req, res) => {
  try {
    //* GET TENANT ID
    const tenantId = res.locals.tenantId.toString();

    //* FIND USER WITH EMAIL
    let User = await selectUserAppModel(tenantId, "users", "userSchema");
    const user = await User.findOne({ email: req.body.email });

    //* CHECK IF USER EXIST OR NOT
    if (!user) {
      throw {
        email: {
          message: "User with this email does not exist",
        },
      };
    }

    //* MATCH PASSWORD
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      throw {
        password: {
          message: "password do not match",
        },
      };
    }

    //* REPLACE OLD TOKEN
    if (req.cookies.refreshToken !== undefined) {
      user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== req.cookies.refreshToken);
    }

    //* GENERATE TOKENS
    const { accessToken, refreshToken } = await user.generateAuthToken();
    setCookie(res, accessToken, refreshToken);
    console.log({ accessToken, refreshToken });
    req.user = user;
    res.status(200).send({
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

const refreshToken = async (req, res) => {
  res.status(200).send(res.locals.user);
};

module.exports = { signupUser, loginUser, refreshToken };
