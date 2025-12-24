// src/layout/AppLayout.jsx
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import "../styles/layout-shell.css";

const AppLayout = () => {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Topbar />

        <div className="app-content">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
