import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter, Route, Routes } from "react-router";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import AllManagers from "../pages/viewManagers";
import ManagerDashboard from "../pages/ManagerDashboard";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import EmployeesList from "../pages/EmployeeList";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup></Signup>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>

          <Route
            path="/manager-dashboard"
            element={<ManagerDashboard></ManagerDashboard>}
          ></Route>

          <Route
            path="/employee-dashboard"
            element={<EmployeeDashboard></EmployeeDashboard>}
          ></Route>

          <Route
            path="/admin-dashboard"
            element={<AdminDashboard></AdminDashboard>}
          ></Route>

          <Route
            path="/all-managers"
            element={<AllManagers></AllManagers>}
          ></Route>

          <Route
            path="/employees"
            element={<EmployeesList></EmployeesList>}
          ></Route>

          <Route
            path="/forgot-password"
            element={<ForgotPassword></ForgotPassword>}
          ></Route>
          <Route path="/verify-otp" element={<VerifyOtp></VerifyOtp>}></Route>
          <Route
            path="/reset-password"
            element={<ResetPassword></ResetPassword>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
