import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RepairList from "./pages/admin/RepairList";
import RepairDetail from "./pages/admin/RepairDetail";
import CreateRepair from "./pages/admin/CreateRepair";
import MyRepairs from "./pages/customer/MyRepairs";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";
import Signup from "./pages/Signup";
import CustomerLanding from "./pages/customer/CustomerLanding";
import ProductCatalog from "./pages/customer/ProductCatalog";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminAddSale from "./pages/admin/AdminAddSale";
import AdminUsers from "./pages/admin/AdminUsers";
import AppLayout from "./layout/AppLayout";
import TrackMyRepair from "./pages/customer/TrackMyRepair";
import MyProfile from "./pages/customer/MyProfile";
import ProductDetail from "./pages/customer/ProductDetail";
import AdminUserRepairs from "./pages/admin/AdminUserRepairs";


const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Navigate to={user.role === "ADMIN" ? "/admin" : "/customer"} />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="repairs" element={<RepairList />} />
          <Route path="repairs/new" element={<CreateRepair />} />
          <Route path="repairs/:id" element={<RepairDetail />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminAddProduct />} />
          <Route path="products/:id" element={<AdminEditProduct />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sales/new" element={<AdminAddSale />} />
          <Route
            path="/admin/users/:userId/repairs"
            element={<AdminUserRepairs />}
          />

        </Route>


        {/* CUSTOMER */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="CUSTOMER">
              <CustomerLanding />
            </ProtectedRoute>
          }
        />
        <Route path="/customer/products" element={<ProductCatalog />} />
        <Route path="/customer/products/:id" element={<ProductDetail />} />
        <Route path="/track-repair" element={<TrackMyRepair />} />
        <Route path="/profile" element={<MyProfile />} />


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
