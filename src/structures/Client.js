const { Client, Intents, Collection } = require("discord.js");
const { connect } = require("mongoose");
const { readdirSync } = require("fs");

module.exports = class Xmas101Client extends Client {
  constructor() {
    super({
      intents: Object.keys(Intents.FLAGS),
      partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
      restTimeOffset: 60,
      allowedMentions: { parse: ["users"] },
    });

    this.commands = new Collection();
    this.slashCommands = [];

    this.color = "#68B88C";

    this.loadCommands();
    this.loadEvents();
  }

  start() {
    this.login(process.env.token);
    connect(process.env.mongo).then(() =>
      console.log("Connected to mongoose.")
    );
  }

  loadCommands() {
    const directories = readdirSync("./src/commands");
    for (let dir of directories) {
      const directory = readdirSync(`./src/commands/${dir}`);
      for (let file of directory) {
        file = require(`../commands/${dir}/${file}`);
        console.log(`Loaded command: ${file.name}`);
        this.commands.set(file.name, file);
        this.slashCommands.push(file);
      }
    }
  }

  loadEvents() {
    const files = readdirSync("./src/events");
    for (let file of files) {
      file = require(`../events/${file}`);
      console.log(`Loaded event: ${file.name}`);
      this.on(file.name, file.run.bind(null, this));
    }
  }
};
