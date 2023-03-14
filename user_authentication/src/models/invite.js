const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    inviterId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    inviterName: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    invitees: [{ type: String, required: true }],
    expiresIn: {
      type: Number,
      default: undefined,
    },
  },
  { timestamps: true }
);

// mongoose.model("invites", inviteSchema);

module.exports = inviteSchema;
