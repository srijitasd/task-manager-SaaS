const bodyParser = require("body-parser");
const { default: helmet } = require("helmet");
const cors = require("cors");
const { validateUser } = require("./rabbit/receivers");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { rabbitBirth, validateDomainRabbit } = require("./rabbit/utils");
const { selectUserAppModel } = require("./src/helpers/tenantDbHelper");
const setCookie = require("./src/helpers/functions/manageCookie");

const App = require("express")();

App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());
App.use(helmet());
App.use(cors());
App.use(cookieParser());

App.get("/validate", async (req, res) => {
  console.log(req.cookies);
  try {
    const channel = await rabbitBirth();
    const { content, consumerTag } = await validateDomainRabbit(channel, {
      origin: req.headers.origin,
    });
    await channel.cancel(consumerTag);

    const { model: User } = await selectUserAppModel(content.tenantId, "users", "user");

    const oldRefreshToken = req.cookies.refreshToken;
    if (oldRefreshToken === undefined) {
      res.clearCookie("accessToken");
      throw { error: "access token is not available" };
    }

    const accessToken = req.cookies.accessToken;
    if (accessToken === undefined) {
      const user = await User.findOne({ "tokens.token": oldRefreshToken }).select("-password");

      if (!user) {
        throw { error: "user not found" };
      }

      user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== oldRefreshToken);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await user.generateAuthToken();

      res.setHeader("user-id", user._id);
      res.setHeader("tenant-id", content.tenantId);
      res.setHeader("cookie", [`refreshToken=${newRefreshToken}`, `accessToken=${newAccessToken}`]);
      return res.sendStatus(200);
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS);
    const user = await User.findOne({
      _id: decoded._id,
    });

    if (!user) {
      throw new Error();
    }
    res.setHeader("user-id", decoded._id);
    res.setHeader("tenant-id", content.tenantId);
    // res.setHeader("cookie", [`refreshToken=${newRefreshToken}`, `accessToken=${newAccessToken}`]);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
});

const PORT = process.env.PORT | 9000;
App.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}`);
});
