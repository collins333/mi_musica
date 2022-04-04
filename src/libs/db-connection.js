const mongoose = require('mongoose')

let db = mongoose.connect('mongodb://collins:collins@cluster0.jncqe.mongodb.net/test', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(db => console.log('db conectada'))
  .catch(err => console.log(err));

  module.exports = db;