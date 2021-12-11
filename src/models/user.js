const { Schema, model } = require("mongoose");

module.exports = model(
  "users",
  new Schema({
    user: String,
    snowman: {
      created: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
    },
    blacklisted: {
      enabled: { type: Boolean, default: false },
      reason: { type: String, default: "" },
      date: { type: Date, default: null },
    },
    createdAt: { type: Date, default: Date.now },
  })
);
