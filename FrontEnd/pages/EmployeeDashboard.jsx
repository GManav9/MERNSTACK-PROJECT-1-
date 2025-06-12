import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const email = location.state?.email;

    if (!email) {
      setError("Employee email missing");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8888/employee-profile?email=${email}`)
      .then((res) => {
        if (res.data.success) {
          setEmployee(res.data.employee);
        } else {
          setError(res.data.msg);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, [location.state]);

  const handleLogout = () => {
    navigate("/login");
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Welcome, {employee.username || employee.email}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card p-3">
        <p>
          <strong>Email:</strong> {employee.email}
        </p>
        <p>
          <strong>Username:</strong> {employee.username}
        </p>
        <p>
          <strong>Phone:</strong> {employee.phone}
        </p>
        {employee.image && (
          <img
            src={employee.image}
            alt="Profile"
            style={{ width: "150px", borderRadius: "50%" }}
          />
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
