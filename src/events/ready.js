const { Client } = require("discord.js");

module.exports = {
  name: "ready",
  /**
   *
   * @param {Client} client
   */
  run: async (client) => {
    console.log(`${client.user.tag} Is now online in ${client.guilds.cache.size} guilds!`);
    
    // Only certain guilds will have the faster updating commands
    ['856626398558027776'].every((x) => 
      client.guilds.cache.get(x).commands.set(client.commands.toJSON().map((m) => ({ name: m.name, description: m.description, options: m.options, }))))

    // Uncomment the following line for when the bot is public.
    // client.application.commands.set(client.commands.toJSON().map((m) => ({ name: m.name, description: m.description, options: m.options, })))

    client.user.setPresence({ activities: [ { type: "WATCHING", name: "you celebrate" }, ]});
  },
};
