import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function ManagerDashboard() {
  const [manager, setManager] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    image: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      setError("Email not provided in route state");
      return;
    }

    axios
      .get(
        `https://mernstack-project-1.onrender.com/manager-dashboard?email=${email}`
      )
      .then((res) => {
        if (res.data.success) {
          setManager(res.data.manager);
          setError("");
        } else {
          setError(res.data.msg || "Failed to fetch manager data");
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Error fetching manager data");
      });
  }, [email]);

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...employeeData,
        managerId: manager._id,
      };

      const res = await axios.post(
        "https://mernstack-project-1.onrender.com/add-employee",
        payload
      );
      setMessage(res.data.msg || "Employee added successfully");
      setEmployeeData({
        username: "",
        email: "",
        phone: "",
        password: "",
        image: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setMessage("Error adding employee");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  if (error) {
    return (
      <div className="container mt-5">
        <h3 className="text-danger">{error}</h3>
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="container mt-5">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Welcome Manager: {manager.username || manager.name}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card p-3 my-4 shadow-sm">
        <h4>Manager Details</h4>
        <p>
          <strong>Name:</strong> {manager.username || manager.name}
        </p>
        <p>
          <strong>Email:</strong> {manager.email}
        </p>
        <p>
          <strong>Phone:</strong> {manager.phone}
        </p>
      </div>

      {manager.adminId && manager.adminId.name ? (
        <div className="card p-3 shadow-sm">
          <h4>Admin Details</h4>
          <p>
            <strong>Name:</strong> {manager.adminId.name}
          </p>
          <p>
            <strong>Email:</strong> {manager.adminId.email}
          </p>
        </div>
      ) : (
        <p className="text-warning">No Admin Assigned</p>
      )}

      <button
        className="btn btn-primary mt-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Employee"}
      </button>

      <button
        className="btn btn-info mt-4 ms-2"
        onClick={() => navigate("/employees")}
      >
        View All Employees
      </button>

      {showForm && (
        <form className="card p-4 mt-3 shadow" onSubmit={handleEmployeeSubmit}>
          <h4>Add New Employee</h4>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={employeeData.username}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={employeeData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={employeeData.phone}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={employeeData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              type="text"
              name="image"
              value={employeeData.image}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </form>
      )}

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default ManagerDashboard;
