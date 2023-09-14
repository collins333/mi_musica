const mongoose = require('mongoose')
const envJSON = require('../../env.json')

let node_env = process.env.NODE_ENV || "desarrollo";
let host = envJSON[node_env].ENVhost;
let cluster = envJSON[node_env].ENVcluster;
let user = envJSON[node_env].ENVuser;
let password = envJSON[node_env].ENVpassword;
let database = envJSON[node_env].ENVdatabase;

let db = mongoose.connect(`mongodb://${host}${cluster}${password}/${database}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(db => console.log('db conectada'))
  .catch(err => console.log(err));

  module.exports = db;