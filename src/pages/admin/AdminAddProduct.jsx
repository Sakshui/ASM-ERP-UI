import AppLayout from "../../layout/AppLayout";
import "../../styles/add-product.css";
import api from "../../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORY_WITH_PRICE = ["SPARE_PARTS", "ACCESSORIES", "OIL"];
const CATEGORY_WITH_CONTACT = [
  "MOTORS",
  "SEWING_MACHINE_TOP",
  "STAND",
  "TABLE",
];

const AdminAddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    unitPrice: "",
    stockQuantity: "",
    restockThreshold: "",
    whatsappLink: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = {
    name: form.name,
    description: form.description || null,
    category: form.category,
    stockQuantity: Number(form.stockQuantity),
    restockThreshold: Number(form.restockThreshold),
    unitPrice: CATEGORY_WITH_PRICE.includes(form.category)
      ? Number(form.unitPrice)
      : null,
    whatsappLink: CATEGORY_WITH_CONTACT.includes(form.category)
      ? form.whatsappLink
      : null,
  };

  const formData = new FormData();

  // VERY IMPORTANT
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (image) {
    formData.append("image", image);
  }

  await api.post("/api/admin/products", formData);

  navigate("/admin/products");
};


  return (
    <AppLayout>
      <div className="add-product-page">
        <div className="page-header">
          <h1>Add Product</h1>
          <p>Manage products with stock & restock control</p>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          {/* PRODUCT INFO */}
          <div className="form-section">
            <h3>Product Information</h3>

            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="SPARE_PARTS">Spare Parts</option>
              <option value="ACCESSORIES">Accessories</option>
              <option value="OIL">Oil</option>
              <option value="MOTORS">Motors</option>
              <option value="SEWING_MACHINE_TOP">Sewing Machine Top</option>
              <option value="STAND">Stand</option>
              <option value="TABLE">Table</option>
            </select>
          </div>

          {/* IMAGE */}
          <div className="form-section">
            <h3>Product Image</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* STOCK */}
          <div className="form-section">
            <h3>Stock Management</h3>

            <input
              type="number"
              name="stockQuantity"
              placeholder="Current Stock Quantity"
              value={form.stockQuantity}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="restockThreshold"
              placeholder="Restock Threshold"
              value={form.restockThreshold}
              onChange={handleChange}
              required
            />
          </div>

          {/* PRICING */}
          {CATEGORY_WITH_PRICE.includes(form.category) && (
            <div className="form-section">
              <h3>Pricing</h3>

              <input
                type="number"
                name="unitPrice"
                placeholder="Price (₹)"
                value={form.unitPrice}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* CONTACT */}
          {CATEGORY_WITH_CONTACT.includes(form.category) && (
            <div className="form-section">
              <h3>Contact Business</h3>

              <input
                name="whatsappLink"
                placeholder="WhatsApp Business Link"
                value={form.whatsappLink}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* ACTIONS */}
          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>

            <button type="submit" className="admin-primary-btn">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default AdminAddProduct;
