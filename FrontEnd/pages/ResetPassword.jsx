import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email, role } = state || {};

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setMessage("");
      return;
    }

    try {
      const res = await axios.post(
        "https://mernstack-project-1.onrender.com/reset-password",
        {
          email,
          role,
          password,
        }
      );

      if (res.data.success) {
        setMessage("Password reset successfully");
        setError("");

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Password reset successfully. Please login.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/login");
        });
      } else {
        setError(res.data.message || "Reset failed");
        setMessage("");
      }
    } catch {
      setError("Reset failed. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Reset Password</h2>
        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>

          <div className="d-grid mb-2">
            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
