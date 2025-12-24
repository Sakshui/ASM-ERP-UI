import "../../styles/dashboard.css";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/admin/dashboard/summary")
      .then(res => setSummary(res.data));
  }, []);

  if (!summary) return null;

  return (
    <>
      <h1>Dashboard</h1>

      <div className="dashboard-grid">

        {/* ACCEPTED */}
        <div
          className="card clickable"
          onClick={() => navigate("/admin/repairs?status=ACCEPTED")}
        >
          <div className="card-title">Pending Repairs</div>
          <div className="card-value">{summary.pendingRepairs}</div>
        </div>

        {/* REPAIRED */}
        <div
          className="card clickable"
          onClick={() => navigate("/admin/repairs?status=REPAIRED")}
        >
          <div className="card-title">Pending Returns</div>
          <div className="card-value">{summary.repairedRepairs}</div>
        </div>

        {/* LOW STOCK */}
        <div
          className="card clickable"
          onClick={() => navigate("/admin/products?filter=low-stock")}
        >
          <div className="card-title">Low Stock</div>
          <div className="card-value">{summary.lowStockProducts}</div>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;
