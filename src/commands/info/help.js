const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "View the bot's commands!",
  category: "info",
  run: async (ctx) => {
    const cats = [
      ...new Set(ctx.client.commands.map(({ category }) => category)),
    ];
    const embed = new MessageEmbed()
      .setTitle(`${ctx.client.user.username}'s Commands`)
      .setThumbnail(ctx.client.user.avatarURL())
      .setColor(ctx.client.color);

    cats.map((x) =>
      embed.addField(
        x,
        ctx.client.commands
          .filter((y) => y.category === x)
          .map((x) => `\`${x.name}\``)
          .join(", ")
      )
    );

    ctx.interaction.followUp({ embeds: [embed] });
  },
};
