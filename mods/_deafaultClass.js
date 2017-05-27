//this is a template for a mod class that works with the current way of dispatching actions and msgs
const { winston } = require('./config');
const winston = require('winston');
winston.level = winston;

class whatever{
  //send the nlp[1] thrw this switch statment and route them to appropriate methodes
  async onAction(msg, nlp){
    switch(nlp.action[1]){

      case "some secondary action":
        this.whateves()
        break;

      default:
        return
    }
  }

  async apropriateMethod(msg){
    //blah blahblah blah blah blahblah blah blah blahblah
  }
}

module.exports = whatever
