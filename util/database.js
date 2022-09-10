const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;


const mongoConnect = callback => {

  MongoClient.connect(
    'mongodb://azmammad:ylqqNP7wRWq29Tuq@ac-h2lvyoh-shard-00-00.6rwjomi.mongodb.net:27017,ac-h2lvyoh-shard-00-01.6rwjomi.mongodb.net:27017,ac-h2lvyoh-shard-00-02.6rwjomi.mongodb.net:27017/?ssl=true&replicaSet=atlas-zwwx4l-shard-0&authSource=admin&retryWrites=true&w=majority'
  )
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err+"adasd";
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
