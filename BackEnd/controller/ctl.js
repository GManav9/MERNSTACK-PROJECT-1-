const schema = require("../model/schema"); // Admin schema
const Manager = require("../model/managerschema");
const Employee = require("../model/employeeschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../middleware/mailer");

let otpStore = {}; // In-memory store for OTP

const getModelByRole = (role) => {
  if (role === "admin") return schema;
  if (role === "manager") return Manager;
  if (role === "employee") return Employee;
  throw new Error("Invalid role");
};

// ------------------ ADMIN SIGNUP ------------------
module.exports.signup = async (req, res) => {
  try {
    const existingUser = await schema.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, msg: "Email already registered!" });
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);
    req.body.role = "admin";
    req.body.isAdmin = true;

    const newUser = await schema.create(req.body);
    return res.status(201).json({
      success: true,
      msg: "Admin registered successfully!",
      user: newUser,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, msg: "Server error during signup" });
  }
};

// ------------------ LOGIN ------------------
module.exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, msg: "All fields required" });
    }

    let user = null;

    if (role === "admin") {
      user = await schema.findOne({ $or: [{ email }, { name: email }] });
    } else if (role === "manager") {
      user = await Manager.findOne({ $or: [{ email }, { username: email }] });
    } else if (role === "employee") {
      user = await Employee.findOne({ $or: [{ email }, { username: email }] });
    } else {
      return res.status(400).json({ success: false, msg: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, msg: "Wrong password" });
    }

    return res.status(200).json({
      success: true,
      msg: "Login successful",
      role,
      email: user.email,
      name: user.name || user.username,
      _id: user._id,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

// ------------------ DASHBOARD ------------------
module.exports.dashboard = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, msg: "Email is required" });
  }

  const user =
    (await schema.findOne({ email })) || (await Manager.findOne({ email }));
  if (!user) {
    return res.status(404).json({ success: false, msg: "User not found" });
  }

  res.status(200).json({
    success: true,
    msg: `Welcome ${user.role || "manager"}`,
    role: user.role || "manager",
    name: user.name || user.username,
    _id: user._id,
  });
};

// ------------------ ADD MANAGER ------------------
module.exports.addManager = async (req, res) => {
  const { username, email, phone, password, adminId } = req.body;

  if (!username || !email || !phone || !password || !adminId) {
    return res
      .status(400)
      .json({ success: false, msg: "All fields are required" });
  }

  const existing = await Manager.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, msg: "Email already registered!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newManager = new Manager({
    username,
    email,
    phone,
    password: hashedPassword,
    adminId,
  });
  await newManager.save();

  return res
    .status(201)
    .json({ success: true, msg: "Manager added successfully!" });
};

// ------------------ GET ALL MANAGERS ------------------
module.exports.getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find().populate("adminId", "name email");
    res.status(200).json({ success: true, managers });
  } catch {
    res.status(500).json({ success: false, msg: "Error fetching managers" });
  }
};

// ------------------ DELETE MANAGER ------------------
module.exports.deleteManager = async (req, res) => {
  try {
    const deleted = await Manager.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, msg: "Manager not found" });
    }
    res
      .status(200)
      .json({ success: true, msg: "Manager deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ------------------ MANAGER DASHBOARD ------------------
module.exports.managerDashboard = async (req, res) => {
  const { email } = req.query;

  try {
    const manager = await Manager.findOne({ email }).populate(
      "adminId",
      "name email"
    );
    if (!manager) {
      return res.status(404).json({ success: false, msg: "Manager not found" });
    }

    return res.status(200).json({ success: true, manager });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ------------------ ADD EMPLOYEE ------------------
module.exports.addEmployee = async (req, res) => {
  const { username, email, phone, password, image, managerId } = req.body;

  if (!username || !email || !phone || !password || !managerId) {
    return res.status(400).json({ success: false, msg: "All fields required" });
  }

  const existing = await Employee.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, msg: "Email already registered!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newEmployee = new Employee({
    username,
    email,
    phone,
    password: hashedPassword,
    image,
    managerId,
  });
  await newEmployee.save();

  return res
    .status(201)
    .json({ success: true, msg: "Employee added successfully" });
};

// ------------------ GET ALL EMPLOYEES ------------------
module.exports.getAllEmployees = (req, res) => {
  Employee.find()
    .then((employees) => {
      res.status(200).json({ success: true, employees });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, msg: "Error fetching employees" });
    });
};

// ------------------ EMPLOYEE PROFILE ------------------
module.exports.employeeProfile = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, msg: "Email required" });
  }
  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, msg: "Employee not found" });
    }
    res.status(200).json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ------------------ DELETE EMPLOYEE ------------------
module.exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, msg: "Employee not found" });
    }
    res
      .status(200)
      .json({ success: true, msg: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ------------------ FORGOT PASSWORD ------------------
exports.forgotPassword = async (req, res) => {
  const { email, role } = req.body;
  try {
    const Model = getModelByRole(role);
    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[`${email}_${role}`] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    await sendMail(
      email,
      "OTP Verification",
      `<h3>Your OTP is <b>${otp}</b></h3>`
    );

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------ VERIFY OTP ------------------
exports.verifyOtp = (req, res) => {
  const { email, otp, role } = req.body;
  const record = otpStore[`${email}_${role}`];

  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  }

  res.json({ success: true, message: "OTP verified" });
};

// ------------------ RESET PASSWORD ------------------
exports.resetPassword = async (req, res) => {
  const { email, role, password } = req.body;
  try {
    const Model = getModelByRole(role);
    const hashed = await bcrypt.hash(password, 10);
    await Model.findOneAndUpdate({ email }, { password: hashed });

    delete otpStore[`${email}_${role}`];

    res.json({ success: true, message: "Password reset successfully" });
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Error resetting password" });
  }
};
