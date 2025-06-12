const express = require("express");
const route = express.Router();
const ctl = require("../controller/ctl");

route.post("/signup", ctl.signup);
route.post("/login", ctl.login);
route.get("/dashboard", ctl.dashboard);

route.post("/add-manager", ctl.addManager);
// routes file (jahan tumne routes define kiye hain)
route.get("/manager-dashboard", ctl.managerDashboard);

route.get("/all-managers", ctl.getAllManagers);
route.delete("/delete-manager/:id", ctl.deleteManager);

route.post("/add-employee", ctl.addEmployee);
route.get("/all-employees", ctl.getAllEmployees);
route.get("/employee-profile", ctl.employeeProfile);
route.delete("/delete-employee/:id", ctl.deleteEmployee);
// router.delete("/delete-employee/:id", controller.deleteEmployee);


// FORGOT PASSWORD - send OTP
route.post("/forgot-password", ctl.forgotPassword);

// VERIFY OTP
route.post("/verify-otp", ctl.verifyOtp);

// RESET PASSWORD
route.post("/reset-password", ctl.resetPassword);


module.exports = route;

