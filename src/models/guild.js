const { Schema, model } = require("mongoose");

module.exports = model(
  "xmasguilds",
  new Schema({
    guild: String,
    newYears: {
      channel: { type: String, default: null },
      message: { type: String, default: null },
      users: { type: Array, default: [] },
    },
    xmasDayCountDown: { type: Boolean, default: false },
    tree: { type: String, default: null },
  })
);
