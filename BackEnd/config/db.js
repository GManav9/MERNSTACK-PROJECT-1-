const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/20Api");

const db = mongoose.connection;

db.once("open", (err) => {
  err ? console.log(err) : console.log("DataBase Connected");
});

module.exports = db;
