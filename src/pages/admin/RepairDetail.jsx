import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/repair-detail.css";

// ⏱ Change to 5000 for testing (5 seconds)
const COOLDOWN_MS = 20 * 60 * 1000;

// 📅 Format timestamp nicely
const formatDateTime = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const RepairDetail = () => {
  const { id } = useParams();

  const [repair, setRepair] = useState(null);
  const [finalPrice, setFinalPrice] = useState("");
  const [priceNote, setPriceNote] = useState("");
  const [priceSaved, setPriceSaved] = useState(false);

  const [lastStatusChangeAt, setLastStatusChangeAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // 🔹 Fetch repair
  useEffect(() => {
    api.get(`/api/repairs/${id}`).then((res) => {
      setRepair(res.data);

      if (res.data.finalPrice !== null) {
        setFinalPrice(res.data.finalPrice);
        setPriceNote(res.data.priceNote || "");
      }

      if (res.data.statusUpdatedAt) {
        setLastStatusChangeAt(new Date(res.data.statusUpdatedAt));
      }
    });
  }, [id]);

  // ⏱ Undo cooldown timer
  useEffect(() => {
    if (!lastStatusChangeAt) return;

    const interval = setInterval(() => {
      const diff =
        COOLDOWN_MS - (Date.now() - lastStatusChangeAt.getTime());

      setTimeLeft(Math.max(0, diff));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastStatusChangeAt]);

  // 🔄 Update status
  const updateStatus = async (status) => {
    const res = await api.put(
      `/api/repairs/${id}/status`,
      null,
      { params: { status } }
    );
    setRepair(res.data);
    setLastStatusChangeAt(new Date());
  };

  // ⏪ Undo status
  const undoStatus = async () => {
    const res = await api.put(`/api/repairs/${id}/undo-status`);
    setRepair(res.data);
    setLastStatusChangeAt(null);
    setTimeLeft(0);
  };

  // 💰 Update final price
  const updateFinalPrice = async () => {
    const res = await api.put(`/api/repairs/${id}/final-price`, {
      finalPrice: Number(finalPrice),
      priceNote,
    });

    setRepair(res.data);
    setPriceSaved(true);
    setTimeout(() => setPriceSaved(false), 3000);
  };

  if (!repair) return null;

  const isReturned = repair.status === "RETURNED";
  const canEditFinalPrice =
    repair.status === "REPAIRED" || repair.status === "RETURNED";

  const undoAllowed = timeLeft > 0;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="repair-detail-page">

      {/* HEADER */}
      <div className="detail-header">
        <h1>Repair #{repair.id}</h1>
        <span className={`status ${repair.status}`}>
          {repair.status.replace("_", " ")}
        </span>
      </div>

      {/* CUSTOMER & MACHINE */}
      <div className="detail-grid">
        <div className="card">
          <h3>Customer</h3>
          <p><strong>Name:</strong> {repair.customerName}</p>
          <p><strong>Phone:</strong> {repair.customerPhone}</p>
        </div>

        <div className="card">
          <h3>Machine</h3>
          <p><strong>Name:</strong> {repair.machineName}</p>
          <p><strong>Issue:</strong> {repair.issueDescription}</p>
        </div>
      </div>

      {/* STATUS TIMELINE */}
      <div className="card">
        <h3>Status Timeline</h3>
        <ul className="timeline">
          <li className={repair.acceptedAt ? "done" : ""}>
            Accepted <span>{formatDateTime(repair.acceptedAt)}</span>
          </li>
          <li className={repair.inProgressAt ? "done" : ""}>
            In Progress <span>{formatDateTime(repair.inProgressAt)}</span>
          </li>
          <li className={repair.repairedAt ? "done" : ""}>
            Repaired <span>{formatDateTime(repair.repairedAt)}</span>
          </li>
          <li className={repair.returnedAt ? "done" : ""}>
            Returned <span>{formatDateTime(repair.returnedAt)}</span>
          </li>
        </ul>
      </div>

      {/* STATUS ACTIONS */}
      <div className="card">
        <h3>Update Status</h3>

        {repair.status === "ACCEPTED" && (
          <button onClick={() => updateStatus("IN_PROGRESS")}>
            Move to In Progress
          </button>
        )}

        {repair.status === "IN_PROGRESS" && (
          <button onClick={() => updateStatus("REPAIRED")}>
            Mark as Repaired
          </button>
        )}

        {repair.status === "REPAIRED" && (
          <button onClick={() => updateStatus("RETURNED")}>
            Mark as Returned
          </button>
        )}

        {/* ⏪ UNDO */}
        {undoAllowed && (
          <div className="undo-box">
            <button className="undo-btn" onClick={undoStatus}>
              Undo Status Update
            </button>
            <p className="undo-timer">
              Undo available for {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
          </div>
        )}
      </div>

      {/* PRICING */}
      <div className="card">
        <h3>Pricing</h3>

        <p>
          <strong>Estimated Price:</strong> ₹ {repair.estimatedPrice}
        </p>

        {canEditFinalPrice && (
          <>
            <div className="pricing-form">
              <input
                type="number"
                placeholder="Final Price"
                value={finalPrice}
                disabled={isReturned}
                onChange={(e) => setFinalPrice(e.target.value)}
              />

              <textarea
                placeholder="Reason for price change (optional)"
                value={priceNote}
                disabled={isReturned}
                onChange={(e) => setPriceNote(e.target.value)}
              />

              <button
                onClick={updateFinalPrice}
                disabled={isReturned}
                className={priceSaved ? "success" : ""}
              >
                Save Final Price
              </button>
            </div>

            {priceSaved && !isReturned && (
              <div className="price-success">
                Final price updated successfully
              </div>
            )}

            {isReturned && (
              <div className="price-locked">
                🔒 Final price is locked after repair is returned
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default RepairDetail;
