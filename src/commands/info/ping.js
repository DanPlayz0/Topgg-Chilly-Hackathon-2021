module.exports = {
  name: "ping",
  description: "View the bot's ping!",
  category: "info",
  run: async (ctx) => {
    ctx.interaction.followUp(`Pong! Bot ping: \`${ctx.client.ws.ping}\` ms!`);
  },
};
