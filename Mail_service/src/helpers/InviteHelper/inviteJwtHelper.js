const jwt = require("jsonwebtoken");

const generateJwtToken = (data, expiresIn) => {
  var token = jwt.sign(data, process.env.INVITE_JWT_SECRET, {
    expiresIn,
  });

  return token;
};

module.exports = {
  generateJwtToken,
};
