const { default: mongoose } = require("mongoose");
const { rabbitBirth, validateTenant, validateUser, sendMail } = require("../../../rabbit/utils");
const { selectUserAppModel } = require("../../helpers/tenantDbHelper");
const jwt = require("jsonwebtoken");

const { removeDuplicate } = require("../../helpers/removeDupArrElem");
// const setCookie = require("../../helpers/functions/manageCookie");

const inviteTeamMember = async (req, res) => {
  const channel = await rabbitBirth();
  var session;
  try {
    const { model: Invite } = await selectUserAppModel(res.locals.tenantId, "invites", "invite");

    const dateObj = new Date();
    dateObj.setSeconds(dateObj.getDate() - process.env.INVITE_DATE_OFFSET);
    const checkInviteLimit = await Invite.aggregate([
      {
        $match: {
          createdAt: {
            $gte: dateObj,
          },
          inviterId: new mongoose.Types.ObjectId(req.body.inviterId),
        },
      },
      {
        $group: {
          _id: "$createdAt",
        },
      },
    ])
      .sort({ _id: -1 })
      .limit(Number(process.env.INVITE_LIMIT));

    if (checkInviteLimit.length >= process.env.INVITE_LIMIT) {
      res.status(400).send({
        error: "too many invites.... Plese wait for a minute",
      });
      return;
    }

    req.body.invitees = removeDuplicate(req.body.invitees);
    const invite = new Invite({
      inviterId: req.body.inviterId,
      inviterName: req.body.inviterName,
      ...req.body,
    });
    await invite.save();

    const data = {
      tenantId: res.locals.tenantId,
      inviterId: invite.inviterId,
      inviteId: invite._id,
      inviterName: invite.inviterName,
      projectId: invite.projectId,
      invitees: invite.invitees,
      slug: res.locals.slug,
    };
    const { content: mailContent, consumerTag: mailConsumerTag } = await sendMail(channel, data);

    console.log(mailContent);
    channel.cancel(mailConsumerTag);

    res.status(200).send("Invite successfully sent");
  } catch (e) {
    console.log(e);
    res.status(500).send("error");
  }
};

const fetchInviteDetails = async (req, res) => {
  try {
    const { signature } = req.body;

    const decodedSignature = jwt.verify(signature, process.env.INVITE_JWT_SECRET);

    res.status(200).send({
      ...decodedSignature,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Looks like the link you are looking for has expired!" });
  }
};

const acceptInvite = async (req, res) => {
  const channel = await rabbitBirth();
  try {
    const { fullName, password, signature } = req.body;

    const decodedSignature = jwt.verify(signature, process.env.INVITE_JWT_SECRET);

    if (!decodedSignature) {
      throw {
        error: {
          msg: "jwt error",
        },
      };
    }

    const { model: User } = await selectUserAppModel(res.locals.tenantId, "users", "user");

    //* CHECK IF USER ALREADY EXISTS OR NOT
    const existingUser = await User.findOne({ email: decodedSignature.invitee });

    //* IF THE USER EXISTS, LOGIN WITH THE TOKEN
    if (existingUser) {
      console.log("user exist");
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        throw {
          password: {
            message: "password do not match",
          },
        };
      }

      //* CHECK FOR REFRESH TOKEN
      if (req.cookies.refreshToken !== undefined) {
        existingUser.tokens = existingUser.tokens.filter(
          (tokenObj) => tokenObj.token !== req.cookies.refreshToken
        );
      }

      //* GENERATE NEW REFRESH TOKEN
      // const { accessToken, refreshToken } = await existingUser.generateAuthToken();
      // setCookie(res, accessToken, refreshToken);

      req.user = {
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        _id: existingUser._id,
      };

      // req.tenantId = tenantId;
      res.status(200).send(existingUser);
      return;
    }

    //* ELSE CREATE A NEW USER
    const user = new User({
      name: fullName,
      email: decodedSignature.invitee,
      password: req.body.password,
      tenantId: decodedSignature.tenantId,
    });
    await user.save();
    console.log("new user");

    // //* GENERATE ACCESS AND REFRESH TOKENS
    //     const { accessToken, refreshToken } = await user.generateAuthToken();
    //     setCookie(res, accessToken, refreshToken);

    //     req.user = {
    //       name: user.name,
    //       email: user.email,
    //       role: user.role,
    //       _id: user._id,
    //     };
    //     console.log(req.user);
    //     req.tenantId = tenantId;

    res.status(201).send({
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  inviteTeamMember,
  acceptInvite,
  fetchInviteDetails,
};
