import React, { useState } from "react";
import "./Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://mernstack-project-1.onrender.com/login",
        {
          email: emailOrUsername,
          password,
          role,
        }
      );

      if (res.data.success) {
        setError("");
        const userEmail = res.data.user?.email || emailOrUsername;

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);

          switch (res.data.role) {
            case "admin":
              navigate("/admin-dashboard", { state: { email: userEmail } });
              break;
            case "manager":
              navigate("/manager-dashboard", { state: { email: userEmail } });
              break;
            case "employee":
              navigate("/employee-dashboard", { state: { email: userEmail } });
              break;
            default:
              alert("Unknown role. Please contact support.");
          }
        }, 3000);
      } else {
        setError(res.data.msg || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError("Login failed. Please check credentials and try again.");
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email or Username</label>
            <input
              type="text"
              className="form-control"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Enter email or username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Login As</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div className="d-grid mb-2">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="text-center">
            <p className="mb-1">
              Don't have an account?{" "}
              <Link to="/" className="text-decoration-none">
                Register
              </Link>
            </p>
            <p>
              <Link to="/forgot-password" className="text-decoration-none">
                Forgot Password?
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* ✅ Custom Toast (Top Center) */}
      {showToast && (
        <div
          className="custom-toast animate__animated animate__fadeInDown"
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "500",
          }}
        >
          <i
            className="bi bi-check-circle-fill"
            style={{ fontSize: "1.2rem" }}
          ></i>
          Login Successful
          <button
            type="button"
            className="btn-close btn-close-white ms-3"
            onClick={() => setShowToast(false)}
          ></button>
        </div>
      )}
    </div>
  );
}

export default Login;
