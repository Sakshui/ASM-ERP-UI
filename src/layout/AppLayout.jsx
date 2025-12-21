import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../styles/layout-shell.css";

const AppLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <div className="app-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
