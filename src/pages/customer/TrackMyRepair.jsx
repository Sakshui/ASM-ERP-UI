import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/track-repair.css";

const STATUS_STEPS = [
  "ACCEPTED",
  "IN_PROGRESS",
  "REPAIRED",
  "RETURNED"
];

const TrackMyRepairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/repairs/my")
      .then(res => setRepairs(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading repairs...</p>;

  if (repairs.length === 0) {
    return (
      <div className="empty-state">
        <h3>No active repairs</h3>
        <p>Please contact the shop if you recently submitted a repair.</p>

        <button
          className="back-btn"
          onClick={() => navigate("/customer")}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="customer-repairs-page">
      <h1>My Repairs</h1>
      <p className="subtitle">
        Current repair status for your machines
      </p>

      <div className="repair-list">
        {repairs.map(repair => {
          const currentIndex =
            STATUS_STEPS.indexOf(repair.status);

          const isDelayed =
            repair.estimatedReturnDate &&
            new Date(repair.estimatedReturnDate) < new Date() &&
            repair.status !== "RETURNED";

          return (
            <div key={repair.id} className="repair-card">

              {/* HEADER */}
              <div className="repair-header">
                <h3>{repair.machineName}</h3>
                <span className="status-chip">
                  {repair.status.replace("_", " ")}
                </span>
              </div>

              {/* ISSUE */}
              <p className="issue">
                Issue: {repair.issueDescription}
              </p>

              {/* REPAIR TIMELINE */}
              <div className="repair-timeline">
                {STATUS_STEPS.map((step, idx) => (
                  <div
                    key={`${repair.id}-${step}`}
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

              {/* RETURN DATE */}
              {repair.estimatedReturnDate && (
                <div
                  className={`return-date ${
                    isDelayed ? "delayed" : ""
                  }`}
                >
                  Estimated Return:
                  <strong>
                    {new Date(
                      repair.estimatedReturnDate
                    ).toLocaleDateString()}
                  </strong>
                  {isDelayed && (
                    <span className="delay-text">
                      Delayed
                    </span>
                  )}
                </div>
              )}

              {/* PRICING DETAILS */}
              {repair.estimatedPrice && (
                <div className="pricing-box">
                  <p className="price-line">
                    <span>Estimated Price:</span>
                    <strong>₹{repair.estimatedPrice}</strong>
                  </p>

                  {repair.finalPrice && (
                    <p className="price-line final">
                      <span>Final Price:</span>
                      <strong>₹{repair.finalPrice}</strong>
                    </p>
                  )}

                  {repair.priceNote &&
                    repair.finalPrice &&
                    repair.finalPrice !== repair.estimatedPrice && (
                      <p className="price-note">
                        <strong>Note:</strong> {repair.priceNote}
                      </p>
                    )}
                </div>
              )}


              {/* WHATSAPP */}
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

      {/* BACK BUTTON */}
      <button
        className="back-btn"
        onClick={() => navigate("/customer")}
      >
        Back
      </button>
    </div>
  );
};

export default TrackMyRepairs;
