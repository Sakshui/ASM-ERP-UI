import "../../styles/dashboard.css";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

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

  // 🔥 FRONTEND DERIVED COUNTS
  const outOfStockCount = products.filter(
    p => p.stockQuantity === 0
  ).length;

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

        {/* 🔥 OUT OF STOCK (FRONTEND LOGIC) */}
        <div
          className="card clickable danger"
          onClick={() => navigate("/admin/products?filter=out-stock")}
          style={{ position: "relative" }}
        >
          <div className="card-title">Out of Stock</div>

          <TriangleAlert
            size={22}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#dc2626"
            }}
          />

          <div className="card-value">
            {outOfStockCount}
          </div>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;
