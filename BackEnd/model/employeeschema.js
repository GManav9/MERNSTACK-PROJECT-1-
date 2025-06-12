const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure no duplicate emails
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //   image: {
  //     type: String, // You can later make this a file path if uploading images
  //   },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager", // This should match your manager model name
    required: true,
  },
  role: {
    type: String,
    enum: ["employee"],
    default: "employee",
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
