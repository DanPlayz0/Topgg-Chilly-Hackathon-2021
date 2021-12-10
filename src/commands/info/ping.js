module.exports = {
  name: "ping",
  description: "View the bot's ping!",
  aliases: ["pong"],
  category: "info",
  run: async (ctx) => {
    ctx.message.reply(`Pong! Bot ping: \`${ctx.client.ws.ping}\` ms!`);
  },
};
