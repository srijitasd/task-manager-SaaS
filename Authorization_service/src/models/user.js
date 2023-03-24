const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw { field: "email", message: "Email is invalid" };
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      min: 7,
    },
    tenantId: {
      type: mongoose.Types.ObjectId,
    },
    role: {
      type: String,
      enum: {
        values: ["Tenant", "Admin", "Watcher", "Manager", "Employee"],
        message: "Invalid role",
      },
      default: "Employee",
    },
    tokens: [
      {
        token: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastInvite: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const accessToken = jwt.sign({ _id: this._id.toString() }, process.env.JWT_ACCESS, {
    expiresIn: 1000 * 60 * 10,
  });

  let refreshToken;

  if (this.role === "Tenant") {
    refreshToken = jwt.sign(
      { _id: this._id.toString(), t_id: this._id.toString() },
      `${process.env.JWT_ACCESS}`,
      {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      }
    );
  } else {
    refreshToken = jwt.sign(
      { _id: this._id.toString(), t_id: this.tenantId.toString() },
      `${process.env.JWT_ACCESS}`,
      {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      }
    );
  }

  this.tokens = this.tokens.concat({ token: refreshToken });
  await this.save();
  return { accessToken, refreshToken };
};

mongoose.model("users", userSchema);

module.exports = userSchema;
