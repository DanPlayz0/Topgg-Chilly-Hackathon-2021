module.exports = {
  name: "stop",
  description: "Stop the Xmas music.",
  category: "music",
  run: async (ctx) => {
    ctx.client.player.destroy();
    ctx.interaction.followUp("Stopped the Xmas music...");

    ctx.client.player = null;
  },
};
