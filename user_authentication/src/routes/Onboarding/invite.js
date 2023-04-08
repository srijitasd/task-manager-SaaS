const express = require("express");
const { catchValidationError } = require("../../../utils/express-validator-helper/catchError");
const {
  inviteTeamMember,
  fetchInviteDetails,
} = require("../../controllers/onBoarding/inviteController");

const { userInviteSchema } = require("../../middlewares/requestValidation/createTenantValidation");
const Router = express.Router();

Router.post("/invite", userInviteSchema, catchValidationError, inviteTeamMember);
Router.post("/parse", fetchInviteDetails);

module.exports = Router;
