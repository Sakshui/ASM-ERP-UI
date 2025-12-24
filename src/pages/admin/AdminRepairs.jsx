import "../../styles/table.css";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import "../../styles/admin-repair.css";

const AdminRepairs = () => {
  const navigate = useNavigate();
  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    api.get("/api/repairs") // admin endpoint
      .then(res => setRepairs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: "700",
            color: "#2f3e46",
          }}
        >
          Repairs
        </h1>

        <button
          onClick={() => navigate("/admin/repairs/new")}
          style={{
            backgroundColor: "#354f52",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "none",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          + Add Repair
        </button>
      </div>

      

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Machine</th>
              <th>Customer</th>
              <th>Status</th>
              <th>ETA</th>
              <th>Estimated ₹</th>
              <th>Final ₹</th>
            </tr>
          </thead>
          <tbody>
            {repairs.map(job => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{job.machineName}</td>
                <td>{job.customerName}</td>
                <td>
                  <span className={`badge ${job.status}`}>
                    {job.status.replace("_", " ")}
                  </span>
                </td>
                <td>{job.estimatedReturnDate?.slice(0, 10)}</td>
                <td>₹ {job.estimatedPrice ?? "-"}</td>
                <td>₹ {job.finalPrice ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminRepairs;
