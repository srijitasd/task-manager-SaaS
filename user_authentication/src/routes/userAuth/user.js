const express = require("express");
const { catchValidationError } = require("../../../utils/express-validator-helper/catchError");
const { signupUser } = require("../../controllers/userAuth/userAuthController");

const { userInviteSchema } = require("../../middlewares/requestValidation/createTenantValidation");
const { validateTenantMiddleware } = require("../../middlewares/tenantValidation/validateTenant");
const { authUserMiddleware } = require("../../middlewares/userAuthentication/autneticateUser");
const Router = express.Router();

Router.post(
  "/signup",
  validateTenantMiddleware,
  userInviteSchema,
  catchValidationError,
  signupUser
);

module.exports = Router;
