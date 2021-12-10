const { Client } = require("discord.js");

module.exports = {
  name: "ready",
  /**
   *
   * @param {Client} client
   */
  run: async (client) => {
    console.log(
      `${client.user.tag} Is now online in ${client.guilds.cache.size} guilds!`
    );

    for (const [_, guild] of client.guilds.cache)
      await guild?.commands
        ?.set(
          client.commands
            .toJSON()
            .map((m) => ({
              name: m.name,
              description: m.description,
              options: m.options,
            }))
        )
        .then(() =>
          console.log(
            `Registered slash commands for ${guild.name} (${guild.id})`
          )
        )
        .catch((err) =>
          console.log(
            `Unable to register commands for ${guild.name} (${guild.id}) ${err.message}`
          )
        );

    client.user.setPresence({
      activities: [
        {
          type: "WATCHING",
          name: "you watching me | x!help",
        },
      ],
    });
  },
};
