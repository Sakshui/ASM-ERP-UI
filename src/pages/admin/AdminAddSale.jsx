import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/add-sale.css";

const AdminAddSale = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    api.get("/api/admin/products")
      .then(res => setProducts(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/api/admin/sales", {
      productId: Number(productId),
      quantitySold: Number(quantity)
    });

    navigate("/admin/products");
  };

  return (
    <>
      <div className="add-sale-page">

        <h1>Add Sale</h1>

        <form className="sale-form" onSubmit={handleSubmit}>

          <label>Product</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
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
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <button className="admin-primary-btn">
            Save Sale
          </button>

        </form>
      </div>
    </>
  );
};

export default AdminAddSale;
