import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/admin-user-repairs.css";

const AdminUserRepairs = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [repairs, setRepairs] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/repairs/customer/${userId}`)
      .then(res => {
        const data = res.data || [];
        setRepairs(data);

        if (data.length > 0) {
          setCustomerName(data[0].customerName);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="user-repairs-page">

      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">
          Repair History
          {customerName && (
            <span className="page-subtitle">
              {" "}of {customerName}
            </span>
          )}
        </h1>
      </div>

      {loading && <p>Loading repair history...</p>}

      {!loading && repairs.length === 0 && (
        <p>No repair history found for this customer.</p>
      )}

      {!loading && repairs.length > 0 && (
        <div className="repair-cards">

          {repairs.map(repair => (
            <div key={repair.id} className="repair-card">

              {/* TOP */}
              <div className="repair-card-header">
                <h3>{repair.machineName}</h3>

                <span
                  className={`status-badge ${repair.status.toLowerCase()}`}
                >
                  {repair.status}
                </span>
              </div>

              {/* ISSUE */}
              <p className="repair-issue">
                <strong>Issue:</strong> {repair.issueDescription}
              </p>

              {/* INFO GRID */}
              <div className="repair-info-grid">
                <div>
                  <span className="label">Estimated Price</span>
                  <span>₹ {repair.estimatedPrice ?? "—"}</span>
                </div>

                <div>
                  <span className="label">Estimated Return</span>
                  <span>
                    {repair.estimatedReturnDate
                      ? new Date(repair.estimatedReturnDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>

                <div>
                  <span className="label">Accepted At</span>
                  <span>
                    {repair.acceptedAt
                      ? new Date(repair.acceptedAt).toLocaleString()
                      : "—"}
                  </span>
                </div>

                <div>
                  <span className="label">Returned At</span>
                  <span>
                    {repair.returnedAt
                      ? new Date(repair.returnedAt).toLocaleString()
                      : "—"}
                  </span>
                </div>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default AdminUserRepairs;
