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

    const handleSubmit = async (e) => {
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

    // 🔥 THIS IS WHAT YOU WERE MISSING
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
    <>
      <div className="add-product-page">
        <h1>Edit Product</h1>

        <form className="product-form" onSubmit={handleSubmit}>

          <label>Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Product Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Category</label>
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
            required
          />

          <label>Restock Threshold</label>
          <input
            type="number"
            name="restockThreshold"
            value={form.restockThreshold}
            onChange={handleChange}
            required
          />

          {CATEGORY_WITH_PRICE.includes(form.category) && (
            <>
              <label>Unit Price (₹)</label>
              <input
                type="number"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                required
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
                required
              />
            </>
          )}
          
          {/*Show existing image as preview*/}
          {form.imageUrl && (
            <div style={{ marginBottom: "12px" }}>
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
                  border: "1px solid #e5e7eb",
                }}
              />
            </div>
          )}
          {/*Show existing image as preview*/}
          <label>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
          />

          <button className="admin-primary-btn">
            Update Product
          </button>

        </form>
      </div>
    </>
  );
};

export default AdminEditProduct;
