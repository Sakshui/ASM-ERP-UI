import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import "../../styles/admin-products.css";

const CATEGORIES = [
  "SPARE_PARTS",
  "ACCESSORIES",
  "OIL",
  "MOTORS",
  "SEWING_MACHINE_TOP",
  "STAND",
  "TABLE",
];

const AdminProducts = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL filter from dashboard
  const urlFilter = searchParams.get("filter"); // low-stock | out-stock

  // Local filters
  const [stockFilter, setStockFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH PRODUCTS
  useEffect(() => {
    api
      .get("/api/admin/products")
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  // SYNC dashboard → dropdown
  useEffect(() => {
    if (urlFilter === "low-stock") {
      setStockFilter("LOW");
    } else if (urlFilter === "out-stock") {
      setStockFilter("OUT");
    } else {
      setStockFilter("");
    }
  }, [urlFilter]);

  // FILTER LOGIC (FIXED LOW STOCK)
  const displayedProducts = useMemo(() => {
    let list = [...products];

    if (categoryFilter) {
      list = list.filter(p => p.category === categoryFilter);
    }

    if (stockFilter === "IN") {
      list = list.filter(
        p => p.stockQuantity > 0 && !p.needsRestock
      );
    }

    // ✅ LOW STOCK = needsRestock BUT quantity > 0
    if (stockFilter === "LOW") {
      list = list.filter(
        p => p.stockQuantity > 0 && p.needsRestock
      );
    }

    // ✅ OUT OF STOCK ONLY
    if (stockFilter === "OUT") {
      list = list.filter(p => p.stockQuantity === 0);
    }

    return list;
  }, [products, stockFilter, categoryFilter]);

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products</h1>

        <div style={{ display: "flex", gap: "12px" }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-filter"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => {
              const value = e.target.value;
              setStockFilter(value);

              if (urlFilter) {
                searchParams.delete("filter");
                setSearchParams(searchParams);
              }
            }}
            className="admin-filter"
          >
            <option value="">All Stock</option>
            <option value="IN">In Stock</option>
            <option value="LOW">Low Stock</option>
            <option value="OUT">Out of Stock</option>
          </select>

          <button
            className="admin-add-btn"
            onClick={() => navigate("/admin/products/new")}
          >
            + Add Product
          </button>
        </div>
      </div>

      {loading && <p>Loading products...</p>}

      {!loading && displayedProducts.length === 0 && (
        <div className="empty-state">
          <p>No products found.</p>
        </div>
      )}

      {!loading && displayedProducts.length > 0 && (
        <div className="products-table">
          <div className="table-header">
            <span>Product</span>
            <span>Category</span>
            <span>Price / Contact</span>
            <span>Stock</span>
            <span>Status</span>
          </div>

          {displayedProducts.map(product => (
            <div
              key={product.id}
              className={`table-row clickable-row ${
                product.stockQuantity === 0
                  ? "out-stock"
                  : product.needsRestock
                  ? "low-stock"
                  : ""
              }`}
              onClick={() =>
                navigate(`/admin/products/${product.id}`)
              }
            >
              <div className="product-cell">
                <img
                  src={
                    product.imageUrl
                      ? `http://localhost:8080${product.imageUrl}`
                      : "/placeholder.png"
                  }
                  alt={product.name}
                />
                <span>{product.name}</span>
              </div>

              <span>{product.category.replaceAll("_", " ")}</span>

              {product.unitPrice && product.unitPrice > 0 ? (
                <span>₹ {product.unitPrice}</span>
              ) : (
                <a
                  href={product.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Contact
                </a>
              )}

              <span>{product.stockQuantity}</span>

              {product.stockQuantity === 0 ? (
                <span className="badge danger">Out of Stock</span>
              ) : product.needsRestock ? (
                <span className="badge warning">Low Stock</span>
              ) : (
                <span className="badge success">In Stock</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
