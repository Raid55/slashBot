const fs = require('fs');
const ytdl = require('ytdl-core');

const { googleKey } = require('../config');

const axios = require('axios');

const winston = require('winston');
winston.level = 'debug';

class Music{

//@TODO i still need to promisify the whole redis thing cause its looking clutered with all the error handling and stuff,
//plus i like promises and i dont want to force myself to use old tech that doesent make much sense. you cant return
//from within a callback function and promises are over more efficient... i think..take that with a grain of salt

//@TODO i just thought of this... instead of sending thru the message i should just use action as my message and extract
//the guild id out of the message in the dispatcher and pass that along to all methods. I could then send message to servers
//using the client and the server id and channel id, on second thought maybe even make a custom object with all the ids i need
//instead of a bulky and messy msg object with all the shit in it
//this makes sense, it would be nice to send thru the server id and pack the msg and the nlp in one, and use the client.channel.get
//to get the channel and send a message.

  constructor(client, redis){
    this.client = client;
    this.redis = redis;
    this.streamOptions = { seek: 0, volume: 1 };
  }

  _ytConfig(q){
    return {
      method: 'GET',
      url: "https://www.googleapis.com/youtube/v3/search",
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      params:{
        key: googleKey,
        type: "video",
        part: "snippet",
        q: q,
      }
    }
  }

  async onAction(msg, nlp){
    switch(nlp.action[1]){
      case "q+":
        this.addToQueue(msg, nlp)
        break;
      case "play" :
        this.play(msg)
        break;
      case "join":
        this.join(msg)
        break;
      case "stop":
        this.stop(msg)
        break;
      case "pause":
        this.pause(msg)
        break;
      case "resume":
        this.resume(msg)
        break;
      case "next":
        this.next(msg)
        break;
      case "leave":
        this.leave(msg)
        break;
      default:
        return;
    }
  }

  async play(msg){
    const { redis, client, _playNext, play, streamOptions, leave } = this;
    //make sure this works, basicly im checking to see if there is a dispatcher. if there is then i can resume it, in case people mistake
    // the resume action with the play action.
    let voiceConn = client.channels.get(msg.member.voiceChannelID).connection
    let dispatcher= null;

    if(voiceConn === null){
      msg.channel.sendMessage("Not in your channel, how am I supposed to play music")
      console.log("not in channel...music not played");
      return;
    }

    if(voiceConn.player.dispatcher){
      voiceConn.player.dispatcher.resume()
      return;
    }

    await redis.rpopAsync(msg.guild.id+":musicQ")
    .then(reply => {
      if(reply === null){
        msg.channel.send("no mousic to play")
      }else{
        //@TODO experiment to see if i can dissconnect the bot from a channel after inactive use to save mem
        // obviusly this a bit tedius since clearTimeout returns a ciculair object thing and then its a mess
        // maybe im gonna have to look into eventEmitters and/or redis expires even maybe something else
        // if(disconTimeout){
        //   let disconTimeout = setTimeout(leave.bind(this, msg, client), 15000)
        //   clearTimeout(disconTimeout);
        // }

      redis.lpushAsync(msg.guild.id+":historyMusicQ", reply)
        .catch(err =>{
          throw err
        })
        console.log(reply);
        reply = reply.split("|")[0];
        console.log(`https://youtu.be/${reply}`);
        dispatcher = voiceConn.playStream(
          ytdl(`https://youtu.be/${reply}`, {filter : 'audioonly'}), streamOptions)
      }
    })
    .catch(winston.error)
    //returns if there is no song to play to avoid a bug that trigers dispatcher.on when dispatcher is null
    if(dispatcher === null) return;
    
    dispatcher
      .on("start", () => {
        console.log("Started Audio");
      })
      .on("end", end => {
        console.log("Audio ending: ", end)
        if(end === "user"){
          console.log("User stop tha music");
          dispatcher = null
        }else{
          // msg.channel.sendMessage("That was the last song and/or there was a small error, if thats the case just play again")
          console.log("Stream ran out, switching songs...");
          dispatcher = null
          this._next(msg)
        }
      })
      .on("error", err =>{
        console.log("Dispatcher Event err: ", err);
      })
    return;
  }

  _next(msg){
    this.play(msg)
  }

  next(msg){
    const { client } = this;
    try{
      let dispatcher = client.channels.get(msg.member.voiceChannelID).connection.player.dispatcher
      if(!dispatcher) return;
      dispatcher.end()
      this._next(msg)
    }catch(err){
      winston.info("No song connection: ",err)
    }
    return;
  }

  stop(msg){
    const { client } = this;
    let dispatcher = client.channels.get(msg.member.voiceChannelID).connection.player.dispatcher
    if(!dispatcher) return;
    dispatcher.end()
  }

  pause(msg){
    const { client } = this;
    let dispatcher = client.channels.get(msg.member.voiceChannelID).connection.player.dispatcher
    if(!dispatcher) return;
    dispatcher.pause()
  }

  resume(msg){
    const { client } = this;
    let dispatcher = client.channels.get(msg.member.voiceChannelID).connection.player.dispatcher
    if(!dispatcher) return;
    dispatcher.resume()
  }

  async join(msg){
    const { client } = this
    return client.channels.get(msg.member.voiceChannelID)
      .join()
      .then(connection => {
        console.log('Connected')
        msg.channel.send("im in...now what?")
        return;
      })
      .catch(err => {
        console.log("join err: ", err);
      })
  }

  leave(msg){
    const { client } = this;

    let connection = client.channels.get(msg.member.voiceChannelID).connection
    if(!connection) return;
    connection.disconnect()
  }

  async addToQueue(msg, nlp){
    const { redis, _ytConfig } = this;
    axios.request(_ytConfig(nlp.params.any))
    .then(result => {
      console.log(msg.guild.id+":musicQ");
      console.log(result);
      redis.lpushAsync(msg.guild.id+":musicQ", `${result.data.items[0].id.videoId}|${msg.author.username}|${msg.author.id}`)
      .then(reply =>{
        console.log(result.data.items[0]);
        msg.channel.sendMessage(`Added: ${result.data.items[0].snippet.title}`)
      })
      .catch(winston.error)
    })
    .catch(err => {
      console.log('ERROR ERROR', err);
      msg.channel.sendMessage('We could not find the song you asked for... we looked for it everywhere.')
    });

  }

  async searchAndDownload(msg, action){

  }


}

module.exports = Music
