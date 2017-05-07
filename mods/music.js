const fs = require('fs');
const ytdl = require('ytdl-core');

const { googleKey } = require('../config');

const axios = require('axios');

const winston = require('winston');
winston.level = 'debug';

const streamOptions = { seek: 0, volume: 1 };

class Music{

//@TODO i still need to promisify the whole redis thing cause its looking clutered with all the error handling and stuff,
//plus i like promises and i dont want to force myself to use old tech that doesent make much sense. you cant return
//from within a callback function and promises are over more efficient... i think..take that with a grain of salt

//@TODO i just thought of this... instead of sending thru the message i should just use action as my message and extract
//the guild id out of the message in the dispatcher and pass that along to all methods. I could then send message to servers
//using the client and the server id and channel id, on second thought maybe even make a custom object with all the ids i need
//instead of a bulky and messy msg object with all the shit in it

  constructor(client, redis){
    this.redis = redis
    this.client = client;
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

  async onMessage(msg, action){
    if(action.result.action.slice(0, 5) !== "music") return;
    switch(action.result.action){
      case "music.q+":
        this.addToQueue(msg, action)
        break;
      case "music.play" :
        this.play(msg)
        break;
      case "music.join":
        this.join(msg)
        break;
      case "music.stop":
        this.stop(msg)
        break;
      case "music.pause":
        this.pause(msg)
        break;
      case "music.resume":
        this.resume(msg)
        break;
      case "music.next":
        this.next(msg)
        break;
      default:
        return
    }
  }

  async play(msg){
    const { redis, client, _playNext, play } = this;
    let dispatcher;

    let voiceConn = client.channels.get(msg.member.voiceChannelID).connection

    if(voiceConn === null){
      msg.channel.sendMessage("Not in your channel, how am I supposed to play music")
      console.log("not in channel...music not played");
      return;
    }

    await redis.rpopAsync(msg.guild.id+":queue")
    .then(reply => {
      if(reply === null){
        msg.channel.sendMessage("no mousic to play")
      }else{
        let stream = ytdl(`https://youtu.be/${reply}`, {filter : 'audioonly'});
        dispatcher = voiceConn.playStream(stream, streamOptions)
      }
    })
    .catch(winston.error)

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
    let dispatcher = client.channels.get(msg.member.voiceChannelID).connection.player.dispatcher
    dispatcher.end()
    this._next(msg)

  }


  async stop(msg){
    const { client } = this;
    let dispatcher = client.channels.get(msg.member.voiceChannelID).connection.player.dispatcher
    dispatcher.end()
  }

  async pause(msg){
    const { client } = this;
    let dispatcher = client.channels.get(msg.member.voiceChannelID).connection.player.dispatcher
    dispatcher.pause()
  }

  async resume(msg){
    const { client } = this;
    let dispatcher = client.channels.get(msg.member.voiceChannelID).connection.player.dispatcher
    dispatcher.resume()
  }

  async join(msg){
    const { client } = this
    return client.channels.get(msg.member.voiceChannelID)
      .join()
      .then(connection => {
        console.log('Connected')
        msg.channel.sendMessage("im in...now what")
        return;
      })
      .catch(err => {
        console.log("join err: ", err);
      })
  }

  async addToQueue(msg, action){
    const { redis, _ytConfig } = this;
    axios.request(_ytConfig(action.result.parameters.any))
    .then(result => {
      console.log(msg.guild.id+":queue");
      redis.lpushAsync(msg.guild.id+":queue", result.data.items[0].id.videoId)
      .then(reply =>{
        console.log(reply);
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
