const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "new-years-edit",
  description: "Edit your new years resolution.",
  category: "config",
  options: [
    {
      name: "new_resolution",
      description: "Your new resolution.",
      type: "STRING",
      required: true,
    },
  ],
  run: async (ctx) => {
    const text = ctx.args[0].value;
    const data = ctx.data.newYears.users.find(
      (x) => x.user === ctx.interaction.user.id
    );

    if (!data) return ctx.interaction.followUp("You don't have a resolution.");

    const message = await ctx.interaction.guild.channels.cache
      .get(ctx.data.newYears.channel)
      .messages.fetch(data.message);

    message.edit({
      embeds: [
        new MessageEmbed()
          .setTitle("New Resolution")
          .setColor(ctx.client.color)
          .setDescription(text),
      ],
    });

    ctx.interaction.followUp(
      `Updated your resolution to [this](${message.url})`
    );
  },
};
