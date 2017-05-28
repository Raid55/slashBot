// Im giving up for now, the idea behind this was to keep all calls to the database on one file to keep the code clean
//BUT since its hard to come up with a way to really make it better and more intuitive im putting this on the shelf
//for now, too much problems and there is more work to be done on other things before i can start thinking about to do this

const { winston } = require('./config');
const winston = require('winston');
winston.level = winston;

class storage{
  constructor(redis, mongoServers){
    this.redis = redis
    this.MongoServers = mongoServers
  }
  // redis.lpushAsync(msg.guild.id+":musicQ", `${result.data.items[0].id.videoId}|${msg.author.username}|${msg.author.id}`)
  // .then(reply =>{
  //   console.log(result.data.items[0]);
  //   msg.channel.sendMessage(`Added: ${result.data.items[0].snippet.title}`)
  // })
  // .catch(winston.error)

  async _set(query){
    const { redis, MongoServers } = this;
    return new Promise((resolve, reject) => {

      switch(query){

        case "onReady":
          MongoServers.find({}, (err, servers) =>{
            if(!err){
              servers.forEach((el) => {
                  redis.hmsetAsync(`${el.id}:server`,{
                    id: el.id,
                    isOn: el.isOn,
                    name: el.name,
                    icon: el.icon
                  })
                  .then(response => {
                    resolve(response)
                  })
                  .catch(err => {
                    reject(err)
                  })
                  //@TODO here i was hoppinh i could also include a SADD for the mods online and a HMSET for the mod settings
                  //but since i dont really have a plan for it yet its not the most important so its whatevz
                  // await redis.hmset(`${el.id}:mods`,{})
                  // .catch(err => throw err)
                  // await redis.saddAsync(`${el.id}:mods:${el.}`)
              })
            }else{
              // winston.error(err, " WHAT HAPPENED< BIG ERROR OMG THE WORLD IS .... acualy its fine just had a problem starting up the serv");
              // servError = false;
              reject(err)
            }
          });
          break;

        case "whatever":

          break;

        case "next":

          break;

        default:
          return

      }

    });

  }

  async _get(query){
    const { redis, MongoServers } = this;

    switch(query){

      case "popMusicQ":
        redis.rpopAsync(msg.guild.id+":musicQ")
        .then(response){

        }
        .catch(err){

        }
        break;

      default:
        return

    }

  }
  async onReady(){
    const { redis, MongoServers } = this;

  }

}
