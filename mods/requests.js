const fs = require('fs');

const axios = require('axios');

const { winston } = require('./config');
const winston = require('winston');
winston.level = winston;

//this is a template for a mod class that works with the current way of dispatching actions and msgs


class requests{

  constructor(client, redis){
    this.client = client;
    this.redis = redis;
  }

  //send the nlp[1] thrw this switch statment and route them to appropriate methodes
  async onAction(msg, nlp){
    switch(nlp.action[1]){

      case "joke":
        this.joke(msg)
        break;

      case "chuck":
        this.chuck(msg)
        break;

      default:
        return
    }
  }

  async joke(msg){

    axios.request({
      method: 'GET',
      url: "https://tambal.azurewebsites.net/joke/random"
    })
    .then(result => {
      console.log(msg.author.username+" : "+ result.data.joke);
      msg.channel.send(result.data.joke)
      return;
    })
    .catch(err => {
      console.log('looks like that joke wasent funny', err);
      msg.reply("I don't feel funny today :(")
      return;
    });

  }

  async chuck(msg){

    axios.request({
      method: 'GET',
      url: "http://api.icndb.com/jokes/random",
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      params:{
        firstName: msg.author.username,
        lastName: ""
      }
    })
    .then(result => {
      console.log(msg.guild.id+":queue");
      msg.channel.send(result.data.value.joke)
      return;
    })
    .catch(err => {
      console.log('Chuck norris type of error:', err);
      msg.reply('I dont think there is a way one earth thats happening')
      return;
    });

  }

}

module.exports = requests
