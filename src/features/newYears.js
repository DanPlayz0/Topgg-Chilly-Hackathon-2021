const { MessageEmbed, ButtonInteraction } = require("discord.js");
const cooldown = new Set();

/**
 * @param {ButtonInteraction} interaction
 */
module.exports = async function (client, data, interaction) {
  if (interaction.message.id !== data.newYears.message) return;

  if (data.newYears.users.find((x) => x.user === interaction.user.id)) {
    if (cooldown.has(interaction.user.id)) return;

    cooldown.add(interaction.user.id);

    interaction.reply({
      content:
        "You already have a resolution. To edit your resolution do `/new-years-edit`",
      ephemeral: true,
    });

    return setTimeout(() => cooldown.delete(interaction.user.id), 10000);
  }

  const msg = await interaction.user
    .send({
      content: "Please send your resolution (less than 1,500 chars)",
    })
    .catch(() =>
      interaction.reply({
        content: "Please enable your DMS!",
      })
    );

  interaction.reply({
    content: "Check your DMS!",
    ephemeral: true,
  });

  const collector = msg.channel.createMessageCollector();
  collector.on("collect", async (message) => {
    if (message.content > 1500)
      return message.reply(
        "Please provide a shorter resolution (less than 1,500 chars)."
      );

    const msg = await interaction.guild.channels.cache
      .get(data.newYears.channel)
      .send({
        embeds: [
          new MessageEmbed()
            .setTitle("New Resolution!")
            .setColor(client.color)
            .setDescription(message.content),
        ],
      });

    data.newYears.users.push({ user: interaction.user.id, message: msg.id });
    data.save();

    message.reply(
      `Your resolution has been sent to <#${data.newYears.channel}>!`
    );

    return collector.stop();
  });
};
