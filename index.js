//this is the config tokens
const { discordToken, apiaiToken } = require('./config');

//discord client
const Discord = require("discord.js");
const client = new Discord.Client();

//backslash the bot
const BackSlash = require("./backSlash.js")

//API.AI connection
const apiai = require('apiai');
const apiAi = apiai(apiaiToken);

//WINSTOOOOOONNNNNN
const winston = require('winston');
winston.level = 'debug';

//bot instance
const bot = new BackSlash(
  discordToken,
  new Discord.Client(),
  apiai(apiaiToken)
)
//async run of bot instance
bot.run()
