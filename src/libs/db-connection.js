const mongoose = require('mongoose')

let db = mongoose.connect('mongodb+srv://collins:collins@cluster0.jncqe.mongodb.net/musica?retryWrites=true&w=majority', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
// let db = mongoose.connect('mongodb://localhost:27017/musica', {
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true
// })
  .then(db => console.log('db conectada'))
  .catch(err => console.log(err));

  module.exports = db;