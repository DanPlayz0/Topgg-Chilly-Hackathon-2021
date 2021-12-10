const { Permissions, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "new-years",
  description: "Configure the new years resolution data.",
  category: "config",
  options: [
    {
      name: "channel",
      description:
        "The channel you wish your users to be able to send there new years resolution to.",
      type: "CHANNEL",
      required: true,
    },
  ],
  run: async (ctx) => {
    // if (!ctx.interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
    //   return ctx.interaction.followUp(
    //     "You require manage server perms to run this command."
    //   );
    ctx.interaction.followUp(
      `Set the new years channel to ${ctx.args[0].channel.toString()}`
    );

    const msg = await ctx.args[0].channel.send({
      content: `Welcome to the New Year's resolution channel! Down below you will see a button click the button and then the bot will DM you prompting you to send your New Year's resolution!`,
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("ny_new")
            .setLabel("Click here!")
            .setStyle("SECONDARY")
        ),
      ],
    });

    ctx.data.newYears.channel = ctx.args[0].value;
    ctx.data.newYears.message = msg.id;
    ctx.data.save();
  },
};
