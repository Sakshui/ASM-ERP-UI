import "../../styles/global.css";
import "../../styles/components.css";
import "../../styles/customer.css";
import { useAuth } from "../../auth/AuthContext";

const MyRepairs = () => {
  const { logout } = useAuth();

  return (
    <div className="page">
      <h1>My Repairs</h1>

      <div className="repair-list">
        <div className="card">
          <div className="repair-status">IN_PROGRESS</div>
          <div className="price">Estimated: ₹500</div>
          <div className="price">Final: —</div>
        </div>
      </div>

      <button className="btn btn-danger" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default MyRepairs;
