// const mongoose = require("mongoose");

// const schema = mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     enum: ["admin", "manager", "employee"],
//     default: "admin", // ✅ default is now 'admin'
//   },
// });

// const Firstschema = mongoose.model("MERN", schema);

// module.exports = Firstschema;

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email unique hona chahiye
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    default: "admin",
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MERN", // ref should match the model name here, which is "MERN"
    required: function () {
      return this.role === "manager";
    },
  },
});

const Firstschema = mongoose.model("MERN", schema);

module.exports = Firstschema;
