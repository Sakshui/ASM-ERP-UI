import "../../styles/create-repair.css";
import api from "../../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRepair = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerPhone: "",
    customerName: "",
    machineName: "",
    issueDescription: "",
    estimatedPrice: "",
    estimatedReturnDate: ""
  });

  const [existingCustomer, setExistingCustomer] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // 🔍 Live customer lookup
    if (name === "customerPhone" && value.length >= 10) {
      try {
        const res = await api.get(
          `/api/admin/users/internal/customers/lookup?phone=${value}`
        );

        if (res.data.exists) {
          setForm(prev => ({
            ...prev,
            customerName: res.data.name
          }));
          setExistingCustomer(true);
        } else {
          setForm(prev => ({
            ...prev,
            customerName: ""
          }));
          setExistingCustomer(false);
        }
      } catch {
        setExistingCustomer(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/api/repairs", {
      customerPhone: form.customerPhone,
      customerName: form.customerName,
      machineName: form.machineName,
      issueDescription: form.issueDescription,
      estimatedPrice: Number(form.estimatedPrice),
      estimatedReturnDate: form.estimatedReturnDate
    });

    navigate("/admin/repairs");
  };

  return (
    <>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>Create Repair Job</h1>
          <p style={{ color: "#6b7280", marginTop: "6px" }}>
            Register a new repair job and track its lifecycle
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >

          {/* Customer & Machine */}
          <div style={{ marginBottom: "32px" }}>
            <h3>Customer & Machine</h3>

            {/* TWO COLUMNS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "40px",
                rowGap: "16px",
                alignItems: "center",
              }}
            >
              {/* Mobile */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px auto",
                  columnGap: "12px",
                  alignItems: "center",
                }}
              >
                <label>Mobile no.</label>
                <input
                  name="customerPhone"
                  placeholder="Customer Mobile Number"
                  style={{ width: "260px" }}
                  value={form.customerPhone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Name */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px auto",
                  columnGap: "12px",
                  alignItems: "center",
                }}
              >
                <label>Name</label>
                <input
                  name="customerName"
                  placeholder="Customer Name"
                  style={{ width: "260px" }}
                  value={form.customerName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {form.customerPhone && (
              <p style={{ color: "#f97316", marginTop: "8px", fontSize: "14px" }}>
                New customer will be created if not found
              </p>
            )}
          </div>



          {/* Issue */}
          {/* Machine Name */}
          <label>Machine Name</label>
          <input
            style={{ marginTop: "8px", width: "50%", marginLeft: "15px" }}
            name="machineName"
            placeholder="Machine Name (e.g. Singer Sewing Machine)"
            value={form.machineName}
            onChange={handleChange}
            required
          />

          <div style={{ marginBottom: "32px" }}>
            <h3>Issue Description</h3>

            <textarea
              name="issueDescription"
              placeholder="Describe the issue reported by the customer"
              value={form.issueDescription}
              onChange={handleChange}
              required
              style={{ minHeight: "100px", marginTop: "10px" }}
            />
          </div>

          {/* Pricing */}
          <div style={{ marginBottom: "32px" }}>
            <h3>Pricing & ETA</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginTop: "12px",
              }}
            >
              <input
                type="number"
                name="estimatedPrice"
                placeholder="Estimated Price (₹)"
                value={form.estimatedPrice}
                onChange={handleChange}
                required
              />

              <input
                type="datetime-local"
                name="estimatedReturnDate"
                value={form.estimatedReturnDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "14px",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/admin/repairs")}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                background: "#354f52",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Create Repair
            </button>
          </div>

        </form>
      </div>
    </>
  );
};

export default CreateRepair;
