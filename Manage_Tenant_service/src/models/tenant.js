const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    company: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      industry: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Tenant = mongoose.model("tenants", tenantSchema);

module.exports = Tenant;
