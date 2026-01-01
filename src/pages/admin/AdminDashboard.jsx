import "../../styles/dashboard.css";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  RotateCcw,
  PackageMinus,
  PackageX
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/api/admin/dashboard/summary")
      .then(res => setSummary(res.data));

    api.get("/api/admin/products")
      .then(res => setProducts(res.data));
  }, []);

  if (!summary) return null;

  const outOfStockCount = products.filter(
    p => p.stockQuantity === 0
  ).length;

  return (
    <div className="dashboard-page full-bleed">

    <div className="dashboard-page">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Quick overview of repairs, returns, and inventory health</p>
      </div>

      {/* CARDS */}
      <div className="dashboard-grid">

        <div
          className="dashboard-card pending"
          onClick={() => navigate("/admin/repairs?status=ACCEPTED")}
        >
          <div className="card-icon">
            <Clock />
          </div>
          <div className="card-info">
            <span>Pending Repairs</span>
            <strong>{summary.pendingRepairs}</strong>
          </div>
        </div>

        <div
          className="dashboard-card returned"
          onClick={() => navigate("/admin/repairs?status=REPAIRED")}
        >
          <div className="card-icon">
            <RotateCcw />
          </div>
          <div className="card-info">
            <span>Pending Returns</span>
            <strong>{summary.repairedRepairs}</strong>
          </div>
        </div>

        <div
          className="dashboard-card low"
          onClick={() => navigate("/admin/products?filter=low-stock")}
        >
          <div className="card-icon">
            <PackageMinus />
          </div>
          <div className="card-info">
            <span>Low Stock</span>
            <strong>{summary.lowStockProducts}</strong>
          </div>
        </div>

        <div
          className="dashboard-card danger"
          onClick={() => navigate("/admin/products?filter=out-stock")}
        >
          <div className="card-icon danger">
            <PackageX />
          </div>
          <div className="card-info">
            <span>Out of Stock</span>
            <strong>{outOfStockCount}</strong>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
