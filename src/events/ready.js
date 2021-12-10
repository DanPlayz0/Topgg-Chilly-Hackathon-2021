module.exports = {
  name: "ready",
  run: (client) => {
    console.log(
      `${client.user.tag} Is now online in ${client.guilds.cache.size} guilds!`
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
