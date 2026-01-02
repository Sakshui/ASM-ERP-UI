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

const ITEMS_PER_PAGE = 5; // 🔹 change if needed

const AdminProducts = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilter = searchParams.get("filter");

  const [stockFilter, setStockFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 pagination state
  const [currentPage, setCurrentPage] = useState(1);

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

  // RESET PAGE WHEN FILTER CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [stockFilter, categoryFilter]);

  // FILTER LOGIC
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (categoryFilter) {
      list = list.filter(p => p.category === categoryFilter);
    }

    if (stockFilter === "IN") {
      list = list.filter(
        p => p.stockQuantity > 0 && !p.needsRestock
      );
    }

    if (stockFilter === "LOW") {
      list = list.filter(
        p => p.stockQuantity > 0 && p.needsRestock
      );
    }

    if (stockFilter === "OUT") {
      list = list.filter(p => p.stockQuantity === 0);
    }

    return list;
  }, [products, stockFilter, categoryFilter]);

  // PAGINATION CALCULATION
  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

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

      {!loading && filteredProducts.length === 0 && (
        <div className="empty-state">
          <p>No products found.</p>
        </div>
      )}

      {!loading && paginatedProducts.length > 0 && (
        <>
          <div className="products-table">
            <div className="table-header">
              <span>Product</span>
              <span>Category</span>
              <span>Price / Contact</span>
              <span>Stock</span>
              <span>Status</span>
            </div>

            {paginatedProducts.map(product => (
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

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProducts;
