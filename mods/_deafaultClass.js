//this is a template for a mod class that works with the current way of dispatching actions and msgs


class whatever{
  //all classes will be called with the action so its important to return if the action doesent match
  async onMessage(msg, action){
    //return anything that isent
    if(action.result.action !== "input.welcome") return;
    //and then send to aproptriate method once idetified
    this.apropriateMethod(msg)
  }

  async apropriateMethod(msg){
    //blah blahblah blah blah blahblah blah blah blahblah
  }
}

module.exports = whatever
