const { winstonLevel } = require('../config');
const winston = require('winston');
winston.level = winstonLevel;

class playtime{

  async onAction(msg, nlp){
    switch(nlp.action[1]){

      case "":
        this.howManyFor(msg, nlp)
        break;

      case "" :
//code b here
        break;

      default:
        return;
    }
  }

  async presenceUpdate(presence){
    //this mode will be a bit differnt in the sense that it will not only be called with actions but also on
    // presence update, im also thinking of adding a lodash to represent entry points in mods like this: _onAction ..etc
  }

  async howManyFor(msg, nlp){

  }

}

module.exports = playtime

// in order to plan for this one i really need to think this thru, tomorrow im going out and buying markers to write on
// glass since i dont have a white board cuz paper just aint cutting it, I was thinkinh i could use redis until the user ranks up
// and then port to mongo but il have to find a way, Its just that right now i cant think of anything and i cant draw anything
// so i think im gonna call it for today but, try to sleep over how in the world am i gonna do this, but most importantly,
// do this good. I need to find a simple yet powerfull solution that will make sure that I wont accidently lose importantly
// data because of redis cache nature, or something that will hinder the servers performance, on top of that i have to
// work in the users requested setings and its a mess. I think a good nights sleep will help... hell the first women programmer
// Betty Holberton's co-workers said: "she solves more problems in her sleep than other people did awake." so yea...history is on my side
