import { useAuth } from "../auth/AuthContext";

const Topbar = () => {
  const { logout } = useAuth();

  return (
    <div className="topbar">
      <div>Admin Panel</div>
      <button onClick={logout} className="btn btn-primary">
        Logout
      </button>
    </div>
  );
};

export default Topbar;
