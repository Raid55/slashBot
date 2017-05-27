const Mods = require("../mods")

class msgRouter{

  constructor(client, redis){
    this.mods = Mods.reduce((accu,el,indx) => {
      if(typeof el === "string"){
        accu[el] = null
        accu._activeMods.push(el)
        return accu
      }else{
        accu[Mods[indx - 1]] = new el(client, redis)
        return accu
      }
    }, {
      _activeMods:[]
    })

    this.mainRoute = this.mods._activeMods.reduce((accu, el, indx) => {
      accu[el] = (msg, nlp) => {
        this.mods[el].onAction(msg, nlp)
      }
      return accu;
    },{
      "smalltalk": (msg, nlp) => {
        msg.channel.send(nlp.speech)
      }
    })
  }

}


module.exports = msgRouter
