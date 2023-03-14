const express = require("express");
const { createTenant } = require("../controllers/tenantController");

const Router = express.Router();

Router.post("/create", createTenant);

module.exports = Router;
