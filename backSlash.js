const winston = require('winston');
const prefix = "\\";
winston.level = 'debug';

const mm = require("./modManager.js")

class BackSlash{

  constructor(tok, client, apiAi){
    this.client = client;
    this.client.login(tok);
    this.apiAi = apiAi;
    this.modManager = new mm();
  }

  async run(){
    const { client , apiAi, modManager} = this;

    client
    .on('error', winston.error)
    .on('warn', winston.warn)
    .on('ready', () => {
      winston.log("info", `
      Bot is now online and ready...
      Logged in as ${client.user.username}
      Waiting for input...
      `);
    })
    .on('reconnect', () => winston.warn('Reconnecting...please wait..'))
    .on('disconnect', () => winston.warn('Disconnected...U got dun rickidy rekt SON'))
    .on('message', (msg) => {
      //checking for false messages that we dont want to track
      if (msg.author.bot) return;
      if (msg.content[0] !== prefix) return;
      //slicing out the prefix whch is always the first character
      msg.content = msg.content.slice(1, msg.content.length);
      //sending message to API.AI to scan for entities and get action
      //user who sent the message is used as user id for API.AI
      const apiReq = apiAi.textRequest(msg.content, {
          sessionId: msg.author.id
        });
      //waiting for API.AI to comeback with an actionable action
      apiReq
        .on('response', (response) =>{
          //log message and action to winston
          winston.info(`
            User Message: ${msg.content}
            API.AI Action: ${response.result.action}
          `)
          modManager.onMessage(msg, response)
          //maybe its done???
          //@TODO DISPATCH actions to apropriate plugins
        })
        .on("error", winston.error)
      //end API.AI request. This has to be here as per the APIAI docs
      apiReq.end();
    })
  }

}

module.exports = BackSlash;
