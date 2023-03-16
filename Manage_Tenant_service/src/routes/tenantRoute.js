const express = require("express");
const { createTenant } = require("../controllers/tenantController");
const { catchValidationError } = require("../middlewares/express-validator-helper/catchError");
const { tenantRequestSchema } = require("../middlewares/requestValidation/createTenantValidation");

const Router = express.Router();

Router.post("/create", tenantRequestSchema, catchValidationError, createTenant);

module.exports = Router;
