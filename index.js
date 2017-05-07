//this is the config tokens
const { discordToken, apiaiToken, redisOptions } = require('./config');

//message prefix
const prefix = "\\"

//discord client
const Discord = require("discord.js");
const client = new Discord.Client();

//backslash the bot
const BackSlash = require("./backSlash.js")

//BluebirdJs
var bluebird = require("bluebird");

//API.AI connection
const apiai = require('apiai');
const apiAi = apiai(apiaiToken);

//WINSTOOOOOONNNNNN
const winston = require('winston');
winston.level = 'debug';

//Redis connection and event listeners
const redis = require("redis")
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient(redisOptions);


redisClient
  .on("ready", () => {
    winston.info("Redis is ready... waiting for connection...")
  })
  .on("connect", () => {
    winston.info("Redis is connected...ready for commands")
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
const bot = new BackSlash(
  prefix,
  discordToken,
  new Discord.Client(),
  apiai(apiaiToken),
  redisClient
)
//async run of bot instance
bot.run()
