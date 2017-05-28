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
      //this is an array that keeps all active mods as they are loaded in so that i can make the router bellow
      _activeMods:[]
    })
    //here we are generating the make shift switch statment, by looping thru the mods array i then make an object with a
    //string as a key atached to a function that sends the msg to the mod, Since actions are strings... badabim badaboom
    this.mainRoute = this.mods._activeMods.reduce((accu, el, indx) => {
      accu[el] = (msg, nlp) => {
        this.mods[el].onAction(msg, nlp)
      }
      return accu;
    },{
      //In this object I am adding special actions that arent mods, these are actions that dont need to be processed
      //as it is directly sent from API.AI, further more since msg is passed here i can directly handle it here.
      "smalltalk": (msg, nlp) => {
        msg.channel.send(nlp.speech)
      }
    })

  }

}

module.exports = msgRouter
