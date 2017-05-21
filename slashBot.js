const winston = require('winston');
winston.level = 'debug';

const mr = require("./msgRouter.js")

class slashBot{

  constructor(prefix, tok, client, apiAi, redis, mongoConn){
    // this.redis = redis;
    this.apiAi = apiAi;
    this.client = client;
    this.prefix = prefix;
    this.redis = redis
    this.client.login(tok);
    this.msgRouter = new mr(client, redis);
    this.Mongo = mongoConn
    //this is temporary...just for now
    this.authList = ['191612587966857226', '272238351564668928', '180229243903410176'];
  }

  async run(){
    const { client , apiAi, msgRouter, prefix, authList, Mongo, redis } = this;
    let servError = false;
    client
    .on('error', winston.error)
    .on('warn', winston.warn)
    .on('ready', () => {
      winston.log("info", `
      Bot is now online and ready...
      Logged in as ${client.user.username}
      Waiting for input...
      `);
      Mongo.find({}, (err, servers) =>{
        if(!err){
          servers.forEach((el) =>{
            try{
              redis.hmsetAsync(`${el.id}:server`,{
                id: el.id,
                isOn: el.isOn,
                name: el.name,
                icon: el.icon
              })
              .then(response => response)
              .catch(err => {throw err})
              //@TODO here i was hoppinh i could also include a SADD for the mods online and a HMSET for the mod settings
              //but since i dont really have a plan for it yet its not the most important so its whatevz
              // await redis.hmset(`${el.id}:mods`,{})
              // .catch(err => throw err)
              // await redis.saddAsync(`${el.id}:mods:${el.}`)
            }catch(err){
              winston.error(err, " WHAT HAPPENED< BIG ERROR OMG THE WORLD IS .... acualy its fine just had a problem starting up the serv");
              servError = false;
              return;
            }
          })
        }else{
          winston.error(err, " WHAT HAPPENED< BIG ERROR OMG THE WORLD IS .... acualy its fine just had a problem starting up the serv");
          servError = false;
          return;
        }
      });
    // console.log(client.guilds.find('name', 'Mao Zedong Communication'));
    })
    .on('reconnect', () => winston.warn('Reconnecting...please wait..'))
    .on('disconnect', () => winston.error('Disconnected...U got dun rickidy rekt SON'))
    .on('message', (msg) => {
      //checking for false messages that we dont want to track
      if(servError) return;
      if (msg.author.bot) return;
      if (msg.content[0] !== prefix) return;
      if (authList.indexOf(msg.author.id) === -1) return;
      //slicing out the prefix whch is always the first character
      msg.content = msg.content.slice(1, msg.content.length);
      if(msg.content === 'test'){
        redis.lrangeAsync(`${msg.guild.id}:historyMusicQ`, -100, 100)
        .then(console.log)
        .catch(console.log)
      }
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
            Server: ${msg.guild.name} | ${msg.guild.id}
            Username: ${msg.author.username} | ${msg.author.id}
            User Message: ${msg.content}
            API.AI Action: ${response.result.action}
          `)
          //error handling
          if(response.status.code !== 200){
            winston.error(
              response.status.code,
              response.status.errorType
            );
            return;
          }else{
            //send msg to the msgRouter
            //slicing the action into array for cleaner and better(hopefuly) code
            msgRouter.mainRoute(msg, {
              action: response.result.action.split("."),
              params: response.result.parameters,
              speech: response.result.fulfillment.speech
            })
          }
        })
        .on("error", (err) =>{
          winston.error(`
            Server: ${msg.guild.name} | ${msg.guild.id}
            Username: ${msg.author.username} | ${msg.author.id}
            User Message: ${msg.content}
            Error Stack:
            ${err}
            `)
        })
      //end API.AI request. This has to be here as per the APIAI docs
      apiReq.end();
    })
    .on("guildCreate", guild =>{
      console.log("cool stuff a guild was just joind in tha client", guild)
    })
  }

}

module.exports = slashBot;
