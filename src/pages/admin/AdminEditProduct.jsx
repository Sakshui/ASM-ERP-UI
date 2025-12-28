import "../../styles/add-product.css";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CATEGORY_WITH_PRICE = ["SPARE_PARTS", "ACCESSORIES", "OIL"];
const CATEGORY_WITH_CONTACT = [
  "MOTORS",
  "SEWING_MACHINE_TOP",
  "STAND",
  "TABLE",
];

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    unitPrice: "",
    stockQuantity: "",
    restockThreshold: "",
    whatsappLink: "",
    imageUrl: "",
  });

  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false); // 🔥 key

  useEffect(() => {
    api.get(`/api/admin/products/${id}`).then(res => {
      setForm({
        name: res.data.name,
        description: res.data.description || "",
        category: res.data.category,
        unitPrice: res.data.unitPrice ?? "",
        stockQuantity: res.data.stockQuantity,
        restockThreshold: res.data.restockThreshold,
        whatsappLink: res.data.whatsappLink || "",
        imageUrl: res.data.imageUrl || "",
      });
    });
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const data = {
      name: form.name,
      description: form.description || null,
      category: form.category,
      unitPrice: CATEGORY_WITH_PRICE.includes(form.category)
        ? Number(form.unitPrice)
        : null,
      stockQuantity: Number(form.stockQuantity),
      restockThreshold: Number(form.restockThreshold),
      whatsappLink: CATEGORY_WITH_CONTACT.includes(form.category)
        ? form.whatsappLink
        : null,
    };

    const fd = new FormData();
    fd.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    if (image) {
      fd.append("image", image);
    }

    await api.patch(`/api/admin/products/${id}`, fd);

    navigate("/admin/products");
  };

  return (
    <div className="add-product-page">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Product Details</h1>

        {!editMode ? (
          <button
            className="admin-primary-btn" style={{ height: "43px" }}
            onClick={() => setEditMode(true)}
          >
            Edit Product
          </button>
        ) : (
          <button
            className="admin-primary-btn" style={{ height: "43px" }}
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        )}
      </div>

      <form className="product-form" onSubmit={handleSubmit}>

        <label>Product Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          disabled={!editMode}
        >
          <option value="SPARE_PARTS">Spare Parts</option>
          <option value="ACCESSORIES">Accessories</option>
          <option value="OIL">Oil</option>
          <option value="MOTORS">Motors</option>
          <option value="SEWING_MACHINE_TOP">Machine Top</option>
          <option value="STAND">Stand</option>
          <option value="TABLE">Table</option>
        </select>

        <label>Stock Quantity</label>
        <input
          type="number"
          name="stockQuantity"
          value={form.stockQuantity}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Restock Threshold</label>
        <input
          type="number"
          name="restockThreshold"
          value={form.restockThreshold}
          onChange={handleChange}
          disabled={!editMode}
        />

        {CATEGORY_WITH_PRICE.includes(form.category) && (
          <>
            <label>Unit Price (₹)</label>
            <input
              type="number"
              name="unitPrice"
              value={form.unitPrice}
              onChange={handleChange}
              disabled={!editMode}
            />
          </>
        )}

        {CATEGORY_WITH_CONTACT.includes(form.category) && (
          <>
            <label>WhatsApp Business Link</label>
            <input
              name="whatsappLink"
              value={form.whatsappLink}
              onChange={handleChange}
              disabled={!editMode}
            />
          </>
        )}

        {/* IMAGE PREVIEW */}
        {form.imageUrl && (
          <div style={{ marginBottom: "14px" }}>
            <p style={{ fontSize: "13px", color: "#6b7280" }}>
              Current Image
            </p>
            <img
              src={`http://localhost:8080${form.imageUrl}`}
              alt="Product"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
        )}

        {editMode && (
          <>
            <label>Change Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files[0])}
            />
          </>
        )}

        {editMode && (
          <button className="admin-primary-btn">
            Update Product
          </button>
        )}
      </form>
    </div>
  );
};

export default AdminEditProduct;
