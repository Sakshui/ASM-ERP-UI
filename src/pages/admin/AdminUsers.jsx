import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/admin-users.css";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/admin/users/customers")
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="users-page">

        <div className="page-header">
          <h1>Customers</h1>
          <p>Users registered on the platform</p>
        </div>

        {loading && <p>Loading users...</p>}

        {!loading && users.length === 0 && (
          <p>No customers found.</p>
        )}

        {!loading && users.length > 0 && (
          <div className="users-table">

            <div className="users-page-table-header">
              <span>S.No</span>
              <span>Name</span>
              <span>Contact</span>
              <span>Status</span>
            </div>

            {users.map((user, index) => (
              <div
                key={user.id}
                className="users-page-table-row clickable"
                onClick={() => navigate(`/admin/users/${user.id}/repairs`)}
              >

                <span>{index + 1}</span>

                <span>{user.name || "—"}</span>

                <span>{user.phone || user.email || "—"}</span>

                <span
                  className={`badge ${
                    user.active ? "success" : "danger"
                  }`}
                >
                  {user.active ? "Active" : "Inactive"}
                </span>

              </div>
            ))}

          </div>
        )}


      </div>
    </>
  );
};

export default AdminUsers;
