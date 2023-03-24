const express = require("express");
const { catchValidationError } = require("../../../utils/express-validator-helper/catchError");
const {
  inviteTeamMember,
  acceptInvite,
  fetchInviteDetails,
  logoutUser,
  logoutUserAll,
} = require("../../controllers/onBoarding/inviteController");

const { userInviteSchema } = require("../../middlewares/requestValidation/createTenantValidation");
const { validateTenantMiddleware } = require("../../middlewares/tenantValidation/validateTenant");
const { authUserMiddleware } = require("../../middlewares/userAuthentication/autneticateUser");
const Router = express.Router();

Router.post("/invite", userInviteSchema, catchValidationError, inviteTeamMember);

Router.post("/parse", fetchInviteDetails);

Router.post("/login", validateTenantMiddleware, acceptInvite);

Router.post("/logout", validateTenantMiddleware, authUserMiddleware, logoutUser);

Router.post("/logoutAll", validateTenantMiddleware, authUserMiddleware, logoutUserAll);

module.exports = Router;
