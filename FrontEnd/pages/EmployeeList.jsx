import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:8888/all-employees")
      .then((res) => {
        if (res.data.success) {
          setEmployees(res.data.employees);
          setError("");
        } else {
          setError(res.data.msg || "Failed to fetch employees");
        }
      })
      .catch(() => setError("Error fetching employees"));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `http://localhost:8888/delete-employee/${id}`
      );
      if (res.data.success) {
        setEmployees(employees.filter((emp) => emp._id !== id));
      } else {
        alert(res.data.msg || "Failed to delete employee");
      }
    } catch (err) {
      alert("Error deleting employee");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="bg-white p-4 shadow rounded">
        <h2 className="mb-4 text-center text-primary">All Employees</h2>

        {error && (
          <div className="alert alert-danger text-center fw-semibold">
            {error}
          </div>
        )}

        {employees.length === 0 ? (
          <div className="text-center text-muted">No employees found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Manager ID</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.username}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.managerId}</td>
                    <td>
                      {emp.image ? (
                        <img
                          src={emp.image}
                          alt={emp.username}
                          width="50"
                          height="50"
                          className="rounded-circle object-fit-cover"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(emp._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeesList;
