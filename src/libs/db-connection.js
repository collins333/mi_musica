const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

let URL_CONNECT = process.env.URL_CONNECT;

let db = mongoose.connect(URL_CONNECT, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(db => console.log('db conectada'))
  .catch(err => console.log(err));

  module.exports = db;