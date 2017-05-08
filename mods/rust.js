const winston = require("winston")
winston.level = "debug"

class rust{

  async onAction(msg, nlp){
    switch(nlp.action[1]){

      case "":
//code b here
        break;

      case "" :
//code b here
        break;

      default:
        return;
    }
  }

}

module.exports = rust
