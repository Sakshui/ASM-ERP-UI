import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/track-repair.css";

const STATUS_STEPS = ["ACCEPTED", "IN_PROGRESS", "REPAIRED", "RETURNED"];

const TrackMyRepairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/repairs/my")
      .then(res => setRepairs(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div className="customer-repairs-page">

      {/* ===== HEADER (FULL WIDTH BACKGROUND) ===== */}
      <div className="page-headerr">
        <div className="header-innerr">
          <div className="header-text">
            <h1>My Repairs</h1>
            <p>Track and manage your machine repairs</p>
          </div>

          <button
            className="back-icon"
            onClick={() => navigate("/customer")}
          >
            ←
          </button>
        </div>
      </div>

      {/* ===== PAGE CONTENT ===== */}
      <div className="page-container">

        <div className="repair-list">
          {repairs.map(repair => {
            const currentIndex = STATUS_STEPS.indexOf(repair.status);
            const finalPrice =
              repair.finalPrice ?? repair.estimatedPrice;

            return (
              <div key={repair.id} className="repair-card">

                <div className="repair-header">
                  <h3>{repair.machineName}</h3>
                  <span className="status-chip">
                    {repair.status.replace("_", " ")}
                  </span>
                </div>

                <p className="issue">
                  Issue: {repair.issueDescription}
                </p>

                <div className="repair-timeline">
                  {STATUS_STEPS.map((step, idx) => (
                    <div
                      key={step}
                      className={`repair-timeline-step ${
                        idx <= currentIndex ? "active" : ""
                      }`}
                    >
                      <span className="dot" />
                      <span className="label">
                        {step.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>

                {repair.estimatedReturnDate && (
                  <div className="return-date">
                    <span>Estimated Return</span>
                    <strong>
                      {new Date(
                        repair.estimatedReturnDate
                      ).toLocaleDateString()}
                    </strong>
                  </div>
                )}

                {repair.estimatedPrice != null && (
                  <div className="pricing-box">
                    <div className="price-line">
                      <span>Estimated Price</span>
                      <strong>₹{repair.estimatedPrice}</strong>
                    </div>
                    <div className="price-line final">
                      <span>Final Price</span>
                      <strong>₹{finalPrice}</strong>
                    </div>
                  </div>
                )}

                <a
                  href={`https://wa.me/917517406585?text=Hi, I am checking the status of my repair for ${repair.machineName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                >
                  Chat with Shop on WhatsApp
                </a>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default TrackMyRepairs;
