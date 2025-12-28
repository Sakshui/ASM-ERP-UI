import api from "../../api/axios";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/add-sale.css";

const AdminAddSale = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/admin/products")
      .then(res => {
        // 🔥 only products with stock > 0
        setProducts(res.data.filter(p => p.stockQuantity > 0));
      });
  }, []);

  // 🔹 Selected product
  const selectedProduct = useMemo(
    () => products.find(p => p.id === Number(productId)),
    [products, productId]
  );

  // 🔹 Validate quantity
  useEffect(() => {
    if (!selectedProduct || !quantity) {
      setError("");
      return;
    }

    if (Number(quantity) > selectedProduct.stockQuantity) {
      setError(
        `Only ${selectedProduct.stockQuantity} item(s) available in stock`
      );
    } else {
      setError("");
    }
  }, [quantity, selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error) return; // 🚫 safety check

    await api.post("/api/admin/sales", {
      productId: Number(productId),
      quantitySold: Number(quantity),
    });

    navigate("/admin/products");
  };

  return (
    <div className="add-sale-page">
      <h1>Add Sale</h1>

      <form className="sale-form" onSubmit={handleSubmit}>

        <label>Product</label>
        <select
          value={productId}
          onChange={(e) => {
            setProductId(e.target.value);
            setQuantity("");
          }}
          required
        >
          <option value="">Select product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} (Stock: {p.stockQuantity})
            </option>
          ))}
        </select>

        <label>Quantity Sold</label>
        <input
          type="number"
          min="1"
          max={selectedProduct?.stockQuantity}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        {/* 🚨 ERROR MESSAGE */}
        {error && (
          <p style={{ color: "#dc2626", fontSize: "14px", marginTop: "4px" }}>
            {error}
          </p>
        )}

        <button
          className="admin-primary-btn"
          disabled={!!error}
          style={{
            opacity: error ? 0.6 : 1,
            cursor: error ? "not-allowed" : "pointer",
          }}
        >
          Save Sale
        </button>

      </form>
    </div>
  );
};

export default AdminAddSale;
