const Mods = require("./mods")

class modManager{

  constructor(client, redis){
    this.mods = []
    Mods.forEach(el => {
      this.mods.push(new el(client, redis))
    })

  }

  async onMessage(msg, action){
    this.mods.forEach((el) => {
      el.onMessage(msg, action)
    })
  }

}

module.exports = modManager
