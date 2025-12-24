import AppLayout from "../layout/AppLayout";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default AdminLayout;
