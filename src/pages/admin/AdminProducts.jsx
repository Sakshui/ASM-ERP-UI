import AppLayout from "../../layout/AppLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/admin-products.css";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin/products")
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="products-page">

        {/* HEADER */}
        <div className="page-header">
          <h1>Products</h1>

          <button
            className="admin-add-btn"
            onClick={() => navigate("/admin/products/new")}
          >
            + Add Product
          </button>
        </div>

        {/* LOADING */}
        {loading && <p>Loading products...</p>}

        {/* EMPTY STATE */}
        {!loading && products.length === 0 && (
          <div className="empty-state">
            <p>No products added yet.</p>
            <p>Click <strong>“Add Product”</strong> to get started.</p>
          </div>
        )}

        {/* PRODUCTS LIST */}
        {!loading && products.length > 0 && (
          <div className="products-table">

            <div className="table-header">
              <span>Product</span>
              <span>Category</span>
              <span>Price / Contact</span>
              <span>Stock</span>
              <span>Status</span>
            </div>

            {products.map(product => (
              <div
                key={product.id}
                className={`table-row ${
                  product.needsRestock ? "low-stock" : ""
                }`}
              >
                {/* PRODUCT */}
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


                {/* CATEGORY */}
                <span>{product.category.replaceAll("_", " ")}</span>

                {/* PRICE OR WHATSAPP */}
                {product.unitPrice ? (
                  <span>₹ {product.unitPrice}</span>
                ) : (
                  <a
                    href={product.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-link"
                  >
                    Contact
                  </a>
                )}

                {/* STOCK */}
                <span>{product.stockQuantity}</span>

                {/* STATUS */}
                {product.needsRestock ? (
                  <span className="badge danger">Restock</span>
                ) : (
                  <span className="badge success">In Stock</span>
                )}
              </div>
            ))}

          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default AdminProducts;
