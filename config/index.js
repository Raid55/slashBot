require('dotenv').config()

module.exports = {
  discordToken: process.env.BOT_LOGIN,
  apiaiToken: process.env.API_AI_KEY,
  googleKey: process.env.GOOGLE_API,
  redisOptions:{
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
};
