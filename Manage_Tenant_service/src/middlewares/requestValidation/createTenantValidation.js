const { checkSchema } = require("express-validator");

const tenantRequestSchema = checkSchema({
  name: {
    rtrim: {
      options: ["-", "_", "#", "!", "@", ""],
    },
    ltrim: {
      options: [" -"],
    },
    matches: {
      negated: true,
      options: [/[!@#$%^&*(),.?":{}|<>]/],
      errorMessage: "Name cannot contain special charecters",
    },
  },
  email: {
    isEmail: {
      bail: true,
    },
  },

  password: {
    isStrongPassword: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
      errorMessage: "Password should be at least 7 chars long",
    },
  },

  "company.name": {
    matches: {
      negated: true,
      options: [/[!@#$%^&*(),.?":{}|<>]/],
      errorMessage: "Company name cannot contain special charecters",
    },
  },
});

module.exports = {
  tenantRequestSchema,
};
