const winston = require("winston")
winston.level = "debug"

class rust{

  async onAction(msg, nlp){
    switch(nlp.action[1]){

      case "howManyFor":
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

module.exports = rust
