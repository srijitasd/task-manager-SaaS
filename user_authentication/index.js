const bodyParser = require("body-parser");
const { default: helmet } = require("helmet");
const cors = require("cors");
const { createTenantUser } = require("./rabbit/receivers");
const InviteTeamRouter = require("./src/routes/Onboarding/invite");
const userAuthRouter = require("./src/routes/userAuth/user");
const cookieParser = require("cookie-parser");

const App = require("express")();

App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());
App.use(helmet());
App.use(cors());
App.use(cookieParser());

createTenantUser();

App.use("/invite", InviteTeamRouter);
App.use("/auth", userAuthRouter);

const PORT = process.env.PORT | 5000;
App.listen(PORT, () => {
  console.log(`User authentication service is running on PORT: ${PORT}`);
});
