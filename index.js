//this is the config tokens
const { discordToken, apiaiToken, redisOptions, mongoUrl } = require('./config');

//message prefix
const prefix = "\\"

//discord client
const Discord = require("discord.js");
const client = new Discord.Client();

//slashBot the bot
const slashBot = require("./slashBot.js")

//BluebirdJs
var bluebird = require("bluebird");

//API.AI connection
const apiai = require('apiai');
const apiAi = apiai(apiaiToken);

//WINSTOOOOOONNNNNN
const winston = require('winston');
winston.level = 'debug';

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
  .on("error", (err) => {
    winston.error("Redis encountered an error: ", err)
  })
  .on("end", () => {
    winston.info("Redis connection has now ended...")
  })


//bot instance
const bot = new slashBot(
  prefix,
  discordToken,
  new Discord.Client(),
  apiai(apiaiToken),
  redisClient,
  connection.model('Servers', serverSchema)
)
//async run of bot instance
bot.run()
