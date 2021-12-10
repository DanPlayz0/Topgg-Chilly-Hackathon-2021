const { CommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await interaction.deferReply({ fetchReply: true });

    const args = [];
    for (const option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (!option.options) args.push({ subcommand_name: option.name });

        option?.options?.map((x) =>
          args.push({ ...x, subcommand_name: option.name })
        );
      } else args.push({ ...option, subcommand_name: option?.name });
    }

    await command.run({ client, interaction, args });
  },
};
