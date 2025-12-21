import AppLayout from "../../layout/AppLayout";
import "../../styles/repair-list.css";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

console.log("REPAIR LIST COMPONENT LOADED");

const RepairList = () => {
  const [repairs, setRepairs] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/repairs")
      .then(res => setRepairs(res.data))
      .catch(() => setRepairs([]));
  }, []);

  const filtered = repairs.filter(r =>
    (!status || r.status === status) &&
    (
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.machineName.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <AppLayout>
      <div className="repair-list-page">

        {/* ✅ PAGE HEADER WITH ADD BUTTON */}
        <div
          className="page-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h1 style={{ margin: 0 }}>Repairs</h1>

          <button
            onClick={() => navigate("/admin/repairs/new")}
            style={{
              background: "#354f52",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add Repair
          </button>
        </div>


        {/* Filters */}
        <div className="filters">
          <input
            placeholder="Search by customer or machine"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REPAIRED">Repaired</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Machine</th>
                <th>Status</th>
                <th>Estimated ₹</th>
                <th>Final ₹</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(r => (
                <tr
                  key={r.id}
                  onClick={() => navigate(`/admin/repairs/${r.id}`)}
                >
                  <td>#{r.id}</td>
                  <td>{r.customerName}</td>
                  <td>{r.machineName}</td>
                  <td>
                    <span className={`status ${r.status}`}>
                      {r.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>₹ {r.estimatedPrice}</td>
                  <td>{r.finalPrice ? `₹ ${r.finalPrice}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AppLayout>
  );
};

export default RepairList;
