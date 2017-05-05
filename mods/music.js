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

  async onMessage(msg, action){

  }

  async play(){

  }

  async pause(){

  }

  async addToQueue(){

  }

  async searchAndDownload(){

  }



}

module.exports = Music
