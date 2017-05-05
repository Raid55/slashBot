const Mods = require("./mods")

class modManager{

  constructor(){
    this.mods = []
    Mods.forEach(el => {
      this.mods.push(new el())
    })
  }

  async onMessage(msg, action){
    this.mods.forEach((el) => {
      el.onMessage(msg, action)
    })
  }

}

module.exports = modManager
