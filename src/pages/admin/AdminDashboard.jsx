import AppLayout from "../../layout/AppLayout";
import "../../styles/dashboard.css";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/admin/dashboard/summary")
      .then(res => setSummary(res.data));
  }, []);

  if (!summary) return null;

  return (
    <AppLayout>
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <div
          className="card clickable"
          onClick={() => navigate("/admin/repairs")}
        >
          <div className="card-title">Total Repairs</div>
          <div className="card-value">{summary.totalRepairs}</div>
        </div>

        <div
          className="card clickable"
          onClick={() => navigate("/admin/repairs")}
        >
          <div className="card-title">Repairs in Progress</div>
          <div className="card-value">{summary.inProgressRepairs}</div>
        </div>

        <div className="card">
          <div className="card-title">Low Stock</div>
          <div className="card-value">{summary.lowStockProducts}</div>
        </div>

        <div className="card">
          <div className="card-title">Today Revenue</div>
          <div className="card-value">₹ {summary.todayRevenue}</div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
