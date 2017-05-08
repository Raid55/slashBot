const Mods = require("./mods")

class msgRouter{

  constructor(client, redis){
    this.mods = Mods.reduce((accu,el,indx) => {
      if(typeof el === "string"){
        accu[el] = null
        return accu
      }else{
        accu[Mods[indx - 1]] = new el(client, redis)
        return accu
      }
    }, {})
  }

  //the main route basicly takes the first element in the action aray and tests for that... from there it goes on to the subroutes
  async mainRoute(msg, nlp){
    const {
      mods,
      music_subRoute
     } = this;

    switch(nlp.action[0]){

      case "music":
        mods["music"].onAction(msg, nlp)
        break;

      case "smalltalk":
        msg.channel.sendMessage(nlp.speech)
        break;

      default:
        msg.reply(nlp.speech)
        console.log(`
          ${nlp}
          Cannot be identified at the msgRouter
        `)
    }
    return;
  }

}

module.exports = msgRouter
