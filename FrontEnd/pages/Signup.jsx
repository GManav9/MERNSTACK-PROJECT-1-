import React, { useState } from "react";
import "./Signup.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://mernstack-project-1.onrender.com/signup",
        {
          name: name.trim(),
          email: email.trim(),
          password,
          role: "admin", // Default signup as admin
        }
      );

      if (res && res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: res.data.msg || "You have successfully registered!",
          confirmButtonColor: "#007bff",
          confirmButtonText: "Go to Login",
        }).then(() => {
          navigate("/login");
        });
      }
    } catch (error) {
      if (error.response?.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "Email Already Exists",
          text: error.response.data.msg || "This email is already registered.",
          confirmButtonColor: "#ffc107",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong. Registration failed.",
          confirmButtonColor: "#dc3545",
        });
      }
    }
  };

  return (
    <div className="signup-container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid mb-2">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>

          <div className="text-center">
            <p className="mb-0">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
