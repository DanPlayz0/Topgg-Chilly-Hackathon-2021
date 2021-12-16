const { Client } = require("discord.js");

module.exports = {
  name: "ready",
  run: async (client) => {
    console.log(
      `${client.user.tag} Is now online in ${client.guilds.cache.size} guilds!`
    );

    client.application.commands.set(
      client.commands.toJSON().map((m) => ({
        name: m.name,
        description: m.description,
        options: m.options,
      }))
    );

    client.user.setPresence({
      activities: [{ type: "WATCHING", name: "you celebrate" }],
    });
  },
};
