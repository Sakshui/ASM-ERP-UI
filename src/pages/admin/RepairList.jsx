import "../../styles/repair-list.css";
import api from "../../api/axios";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PAGE_SIZE = 10;

// Status priority (lower = higher priority)
const STATUS_PRIORITY = {
  ACCEPTED: 1,
  IN_PROGRESS: 2,
  REPAIRED: 3,
  RETURNED: 4
};

const RepairList = () => {
  const [repairs, setRepairs] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read status from URL
  useEffect(() => {
    const urlStatus = searchParams.get("status");
    if (urlStatus) {
      setStatus(urlStatus);
    }
  }, [searchParams]);

  useEffect(() => {
    api
      .get("/api/repairs")
      .then(res => setRepairs(res.data || []))
      .catch(() => setRepairs([]));
  }, []);

  /* 🔥 FILTER + SORT (FIFO + REPAIRED BOTTOM) */
  const filteredAndSorted = useMemo(() => {
    return repairs
      .filter(r =>
        (!status || r.status === status) &&
        (
          r.customerName.toLowerCase().includes(search.toLowerCase()) ||
          r.machineName.toLowerCase().includes(search.toLowerCase())
        )
      )
      .sort((a, b) => {
        // 1️⃣ Status priority
        const statusDiff =
          STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
        if (statusDiff !== 0) return statusDiff;

        // 2️⃣ FIFO → acceptedAt → id fallback
        const timeA = a.acceptedAt
          ? new Date(a.acceptedAt).getTime()
          : a.id;
        const timeB = b.acceptedAt
          ? new Date(b.acceptedAt).getTime()
          : b.id;

        return timeA - timeB;
      });
  }, [repairs, status, search]);

  /* 🔥 PAGINATION */
  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE);

  const paginatedData = filteredAndSorted.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="repair-list-page">

      {/* HEADER */}
      <div className="page-header">
        <h1>
          {status === "ACCEPTED" && "Pending Repairs"}
          {status === "REPAIRED" && "Pending Returns"}
          {!status && "All Repairs"}
        </h1>

        <button
          className="add-repair-btn"
          onClick={() => navigate("/admin/repairs/new")}
        >
          + Add Repair
        </button>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <input
          placeholder="Search by customer or machine"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={status}
          onChange={e => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REPAIRED">Repaired</option>
          <option value="RETURNED">Returned</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Machine</th>
              <th>Status</th>
              <th>Estimated ₹</th>
              <th>Final ₹</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map(r => (
              <tr
                key={r.id}
                className="clickable-row"
                onClick={() => navigate(`/admin/repairs/${r.id}`)}
              >
                <td>{r.id}</td>
                <td>{r.customerName}</td>
                <td>{r.machineName}</td>
                <td>
                  <span className={`status ${r.status}`}>
                    {r.status.replace("_", " ")}
                  </span>
                </td>
                <td>₹ {r.estimatedPrice}</td>
                <td>{r.finalPrice ? `₹ ${r.finalPrice}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default RepairList;
