import React, { useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./VerifyOtp.css";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, role } = location.state || {};

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/g, "");
    const newOtp = [...otp];

    if (value.length === 1) {
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5) inputRefs.current[index + 1].focus();
    } else if (value.length > 1) {
      const values = value.split("").slice(0, 6);
      for (let i = 0; i < values.length; i++) {
        newOtp[i] = values[i];
      }
      setOtp(newOtp);
      values.length < 6
        ? inputRefs.current[values.length].focus()
        : inputRefs.current[5].blur();
    } else {
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleFocus = () => {
    if (otp.join("").length === 6) {
      setOtp(new Array(6).fill(""));
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    try {
      const res = await axios.post(
        "https://mernstack-project-1.onrender.com/verify-otp",
        {
          email,
          role,
          otp: finalOtp,
        }
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "OTP Verified!",
          text: "Proceed to reset your password.",
          confirmButtonColor: "#28a745",
        }).then(() => {
          navigate("/reset-password", { state: { email, role } });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: res.data.message || "Incorrect or expired OTP.",
          confirmButtonColor: "#dc3545",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  return (
    <div className="verify-container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Verify OTP</h2>
        <form onSubmit={handleVerifyOtp}>
          <div className="otp-container mb-4 d-flex justify-content-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="otp-input"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={handleFocus}
                ref={(el) => (inputRefs.current[index] = el)}
                required
              />
            ))}
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-success">
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
