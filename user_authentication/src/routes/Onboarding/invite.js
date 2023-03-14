const express = require("express");
const {
  inviteTeamMember,
  acceptInvite,
  fetchInviteDetails,
} = require("../../controllers/onBoarding/inviteController");
// const userAuth = require("../../middlewares/auth/userAuthMiddleware");
const Router = express.Router();

Router.post("/invite", inviteTeamMember);

// Router.post("/invite/parse", fetchInviteDetails);

// Router.post("/invite/login", acceptInvite);

module.exports = Router;
