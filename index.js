/*
  slashBot
  Created by
  Raid55

slashBot is a discord bot powered by discord.js lib. It uses API.AI to process the natural language
and returns actions and entities so that the logic can run.

*/

//Importing all configs from config file/ node env
const { discordToken, apiaiToken, redisOptions, mongoUrl, winstonLevel } = require('./config');

//Prefix that the user need in order to type before message to bot
const prefix = "\\"

//Importing the discord client
const Discord = require("discord.js");
const client = new Discord.Client();

//Importing the bot class
const slashBot = require("./slashBot.js")

//BluebirdJs
var bluebird = require("bluebird");

//API.AI connection
const apiai = require('apiai');
const apiAi = apiai(apiaiToken);

//WINSTOOOOOONNNNNN
const winston = require('winston');
winston.level = winstonLevel;

//mongoose connection
const mongoose = require("mongoose")
const serverSchema = require("./models/server.js")
const connection = mongoose.createConnection(mongoUrl)
const Servers = connection.model('Servers', serverSchema)

//Redis connection and event listeners
const redis = require("redis")
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient(redisOptions);

// this is mainly for debuging and making the console look cool, like making me seem so much more smart
// by outputing lots of cool info on start up and on disconnect
redisClient
  .on("ready", () => {
    winston.info("Redis is ready... ready for commands...")
  })
  .on("connect", () => {
    winston.info("Redis is connected to db...")
  })
  .on("reconnecting", () => {
    winston.info("Redis is reconnecting...please hold...")
  })
  .on("end", () => {
    winston.info("Redis connection has now ended...")
  })
  .on("error", (err) => {
    winston.error("Redis encountered an error: ", err)
  })


//Creating a new bot instance with all the stuff it needs to float on its own
// we are making all connections on this page and passing them as arguments to the bot class to be constructed
const bot = new slashBot(
  prefix,
  discordToken,
  new Discord.Client(),
  apiai(apiaiToken),
  redisClient,
  connection.model('Servers', serverSchema)
)
//Run the bot and let it do its thing
//Since this is an Async command it will keep waiting for message events and never stop
// i love node and sync programming its soo cool.
bot.run()
