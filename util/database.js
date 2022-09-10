const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const MongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://azmammad:ylqqNP7wRWq29Tuq@cluster0.6rwjomi.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((result) => {
      console.log("Connected!");
      callback(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = MongoConnect;
