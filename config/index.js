require('dotenv').config()

module.exports = {
  discordToken: process.env.BOT_LOGIN,
  apiaiToken: process.env.API_AI_KEY,
  googleKey: process.env.GOOGLE_API,
  redisOptions:{
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
};
