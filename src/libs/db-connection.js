const mongoose = require('mongoose')

let db = mongoose.connect('mongodb://127.0.0.1:27017/musica', {
  // useCreateIndex: true,
  // useNewUrlParser: true,
  // useFindAndModify: false,
  // useUnifiedTopology: true
})
// let db = mongoose.connect('mongodb+srv://collins:compact7@cluster0.z1d6afq.mongodb.net/musica?retryWrites=true&w=majority')
  .then(db => console.log('db conectada'))
  .catch(err => console.log(err));

  module.exports = db;