// const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1/20Api");

// const db = mongoose.connection;

// db.once("open", (err) => {
//   err ? console.log(err) : console.log("DataBase Connected");
// });

// module.exports = db;
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(
    "mongodb+srv://gangvanimanav:UxyrMymLAe24qAvi@mern-stack-1.i0cknkd.mongodb.net/yourDBName?retryWrites=true&w=majority&appName=Mern-Stack-1"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// module.exports = db;
