import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css"; // using separate design file

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "https://mernstack-project-1.onrender.com/forgot-password",
        {
          email,
          role,
        }
      );

      if (res.data.success) {
        setMessage("OTP sent to your email");
        navigate("/verify-otp", { state: { email, role } });
      } else {
        setMessage(res.data.message);
      }
    } catch (error) {
      setMessage("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSendOtp}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>

          {message && (
            <div className="alert alert-info text-center mt-2">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
