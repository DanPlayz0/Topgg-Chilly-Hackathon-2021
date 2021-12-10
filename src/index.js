const Client = require("./structures/Client");
require("dotenv").config();

const client = new Client();

client.start();
