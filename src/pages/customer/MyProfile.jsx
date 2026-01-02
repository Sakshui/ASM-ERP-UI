import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/my-profile.css";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Fetch profile
  useEffect(() => {
    api.get("/api/auth/me").then(res => {
      setProfile(res.data);
      setForm({
        fullName: res.data.name, // 🔥 backend sends `name`
        phone: res.data.phone,
        password: ""
      });
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await api.patch("/api/auth/me", {
        fullName: form.fullName, // 🔥 EXACT backend field
        phone: form.phone,
        ...(form.password && { password: form.password })
      });

      // update UI state
      setProfile({
        ...profile,
        name: form.fullName,
        phone: form.phone
      });

      setEditMode(false);
      setForm(prev => ({ ...prev, password: "" }));
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-card">

        <label>Full Name</label>
        <input
          name="fullName"
          value={form.fullName}
          disabled={!editMode}
          onChange={handleChange}
        />

        <label>Email</label>
        <input value={profile.email} disabled />

        <label>Phone Number</label>
        <input
          name="phone"
          value={form.phone}
          disabled={!editMode}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={editMode ? form.password : "********"}
          disabled={!editMode}
          placeholder={editMode ? "Enter new password" : ""}
          onChange={handleChange}
        />

        {!editMode ? (
          <button className="btn primary" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        ) : (
          <div className="profile-actions">
            <button
              className="btn primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="btn secondary"
              onClick={() => {
                setEditMode(false);
                setForm({
                  fullName: profile.name,
                  phone: profile.phone,
                  password: ""
                });
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <button className="back-btnn" onClick={() => navigate("/customer")}>
        Back
      </button>
    </div>
  );
};

export default MyProfile;
