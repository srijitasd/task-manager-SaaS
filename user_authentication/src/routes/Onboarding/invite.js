const express = require("express");
const { catchValidationError } = require("../../../utils/express-validator-helper/catchError");
const {
  inviteTeamMember,
  acceptInvite,
  fetchInviteDetails,
} = require("../../controllers/onBoarding/inviteController");

const { userInviteSchema } = require("../../middlewares/requestValidation/createTenantValidation");
const { validateTenantMiddleware } = require("../../middlewares/tenantValidation/validateTenant");
const { authUserMiddleware } = require("../../middlewares/userAuthentication/autneticateUser");
const Router = express.Router();

Router.post(
  "/invite",
  validateTenantMiddleware,
  authUserMiddleware,
  userInviteSchema,
  catchValidationError,
  inviteTeamMember
);

Router.post("/invite/parse", validateTenantMiddleware, fetchInviteDetails);

Router.post("/invite/login", validateTenantMiddleware, acceptInvite);

module.exports = Router;
