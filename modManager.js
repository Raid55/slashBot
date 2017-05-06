const Mods = require("./mods")

class modManager{

  constructor(client){
    this.mods = []
    Mods.forEach(el => {
      this.mods.push(new el(client))
    })
  }

  async onMessage(msg, action){
    this.mods.forEach((el) => {
      el.onMessage(msg, action)
    })
  }

}

module.exports = modManager
