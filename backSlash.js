const winston = require('winston');
winston.level = 'debug';

const mm = require("./modManager.js")

class BackSlash{

  constructor(prefix, tok, client, apiAi, redis){
    // this.redis = redis;
    this.apiAi = apiAi;
    this.client = client;
    this.prefix = prefix;
    this.client.login(tok);
    this.modManager = new mm(client, redis);
    this.authList = ['191612587966857226', '272238351564668928', '180229243903410176'];
  }

  async run(){
    const { client , apiAi, modManager, prefix, authList } = this;

    client
    .on('error', winston.error)
    .on('warn', winston.warn)
    .on('ready', () => {
      winston.log("info", `
      Bot is now online and ready...
      Logged in as ${client.user.username}
      Waiting for input...
      `);
    // console.log(client.guilds.find('name', 'Mao Zedong Communication'));
    })
    .on('reconnect', () => winston.warn('Reconnecting...please wait..'))
    .on('disconnect', () => winston.error('Disconnected...U got dun rickidy rekt SON'))
    .on('message', (msg) => {
      //checking for false messages that we dont want to track
      if (msg.author.bot) return;
      if (msg.content[0] !== prefix) return;
      if (authList.indexOf(msg.author.id) === -1) return;
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
            Username: ${msg.author.username}
            User Message: ${msg.content}
            API.AI Action: ${response.result.action}
          `)
          if(response.result.action.slice(0,9) === "smalltalk"){
            msg.channel.sendMessage(response.result.fulfillment.speech)
          }else if(response.result.action === "input.unknown"){
            msg.reply(response.result.fulfillment.speech)
          }else if(response.result.action === "input.welcome"){
            msg.reply(response.result.fulfillment.speech)
          }else{
            modManager.onMessage(msg, response)
          }
        })
        .on("error", winston.error)
      //end API.AI request. This has to be here as per the APIAI docs
      apiReq.end();
    })
  }

}

module.exports = BackSlash;
