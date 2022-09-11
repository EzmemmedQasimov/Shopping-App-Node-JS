const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(email, name) {
    this.email = email;
    this.name = name;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne(mongoDb.ObjectId(userId));
  }
}

module.exports = User;
