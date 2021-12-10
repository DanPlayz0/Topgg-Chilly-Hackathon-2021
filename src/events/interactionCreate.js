const { CommandInteraction } = require("discord.js");
const db = require("../models/guild");
const newYears = require("../features/newYears");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    let data = await db.findOne({ guild: interaction.guild.id });
    if (!data) data = await db.create({ guild: interaction.guild.id });

    if (interaction.isButton())
      return await newYears(client, data, interaction);

    if (interaction.isCommand()) {
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

      return await command.run({ client, interaction, args, data });
    }
  },
};
