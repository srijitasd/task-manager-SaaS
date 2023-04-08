const express = require("express");
const { catchValidationError } = require("../../../utils/express-validator-helper/catchError");
const { signupUser, refreshToken } = require("../../controllers/userAuth/userAuthController");

const { userInviteSchema } = require("../../middlewares/requestValidation/createTenantValidation");
const { validateTenantMiddleware } = require("../../middlewares/tenantValidation/validateTenant");
const { authUserMiddleware } = require("../../middlewares/userAuthentication/autneticateUser");
const {
  acceptInvite,
  logoutUser,
  logoutUserAll,
} = require("../../controllers/onBoarding/inviteController");
const Router = express.Router();

Router.post(
  "/signup",
  validateTenantMiddleware,
  userInviteSchema,
  catchValidationError,
  signupUser
);

Router.post("/login", validateTenantMiddleware, acceptInvite);

Router.post("/logout", logoutUser);

Router.post("/logoutAll", logoutUserAll);

Router.get("/refresh", refreshToken);

module.exports = Router;
