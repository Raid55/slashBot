const fs = require('fs');
const ytdl = require('ytdl-core');

const { googleKey } = require('../config');

const axios = require('axios');

const streamOptions = { seek: 0, volume: 1 };

function ytConfig(q){
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

class Music{

  constructor(client){
    this.q = [];
    this.client = client;
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
      default:
        return
    }
  }

  async play(msg){
    const { q, client, play } = this
    if(q.length === 0){
      msg.channel.sendMessage("no mousic to play")
      return;
    }
    let stream = ytdl(`https://youtu.be/${q[0].id.videoId}`, {filter : 'audioonly'});
    let voiceChannel = client.channels.get(msg.member.voiceChannelID);
    msg.channel.sendMessage(`now playing: ${q[0].snippet.title}`)
    // there is a bug that once you press pause the q is shited cuz the stop speaking event is stoped... find a way to fix
    voiceChannel.connection.playStream(stream, streamOptions)
      .on("speaking",spk => {
        if(spk === false){
          q.shift()
          play(msg)
        }
      })
  }

  async pause(msg){

  }

  async join(msg){
    const { client } = this
    let voiceChannel = client.channels.get(msg.member.voiceChannelID);

    voiceChannel.join()
    .then(connection => {
      console.log('Connected')
      msg.channel.sendMessage("im in...now what")
    })
  }

  async addToQueue(msg, action){
    axios.request(ytConfig(action.result.parameters.any))
    .then(result => {
      this.q.push(result.data.items[0])
      msg.channel.sendMessage(`Added: ${result.data.items[0].snippet.title}`)
      console.log('gotem',result.data.items[0]);
    })
    .catch(err => {
      console.log('ERROR ERROR', err);
    });
  }

  async searchAndDownload(msg){

  }



}

module.exports = Music
