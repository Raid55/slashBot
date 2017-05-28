const Music = require("./music.js")
const Rust = require("./rust.js")
const Requests = require("./requests.js")

//this exports all the mods to the msgRouter, the reason why there is the mod writen as a string and then the mod class
//is because the action that API.AI sends to us is a string, SO what I did is I attach the action to the mod here, so
//that i dont need to define it anywhere else, its always in groups of 2 so its 0,1 is 1 mod, 2,3 another and so on..
module.exports = [
  "music", Music,
  "rust", Rust,
  "requests", Requests
];
//IMPORTANT!!! if you add an action that doesent exist on API.AI the mod will not work and the message will not be processed
