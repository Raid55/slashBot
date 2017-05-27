const { winston } = require('./config');
const winston = require('winston');
winston.level = winston;

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

  async howManyFor(msg, nlp){

  }

}

module.exports = playtime
