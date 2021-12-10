const prefix = "x!";

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if (
      message.author.bot ||
      !message.guild ||
      !message.content.startsWith(prefix)
    )
      return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    const command =
      client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (!command) return;

    await command.run({ client, message, args });
  },
};
