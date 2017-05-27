const { winston } = require('./config');
const winston = require('winston');
winston.level = winston;

class storage{
  constructor(redis, mongoServers){
    this.redis = redis
    this.MongoServers = mongoServers
  }

  async onReady(server){
    const { redis, MongoServers } = this;
    MongoServers.find({}, (err, servers) =>{
      if(!err){
        servers.forEach((el) => {
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
  }

}
