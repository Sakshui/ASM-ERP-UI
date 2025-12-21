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
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/repairs"
          element={
            <ProtectedRoute role="ADMIN">
              <RepairList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/repairs/new"
          element={
            <ProtectedRoute role="ADMIN">
              <CreateRepair />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/repairs/:id"
          element={
            <ProtectedRoute role="ADMIN">
              <RepairDetail />
            </ProtectedRoute>
          }
        />

        {/* ADMIN PRODUCTS */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products/new"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminAddProduct />
            </ProtectedRoute>
          }
        />


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
        
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="CUSTOMER">
              <MyRepairs />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
