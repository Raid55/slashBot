const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const serverSchema = new Schema({
  id: String,
  icon: String,
  name: String,
  ownerid: String,
  isOn: Boolean,
  mods:[],
  logs: []
})

module.exports = serverSchema
