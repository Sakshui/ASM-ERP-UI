import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>ASM-MS</h2>

      <NavLink to="/admin">Dashboard</NavLink>
      <NavLink to="/admin/repairs">Repairs</NavLink>

      {/* NEW */}
      <NavLink to="/admin/products">Products</NavLink>

      <NavLink to="/admin/inventory">Inventory</NavLink>
      <NavLink to="/admin/sales">Sales</NavLink>
      <NavLink to="/admin/users">Users</NavLink>
    </div>
  );
};

export default Sidebar;
