const { checkSchema } = require("express-validator");

const userInviteSchema = checkSchema({
  "invitees.*": {
    isEmail: true,
  },
});

module.exports = {
  userInviteSchema,
};
