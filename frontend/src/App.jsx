import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import WholesalerDashboard from "./pages/WholesalerDashboard";
import ShopkeeperDashboard from "./pages/ShopkeeperDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import WholesalerOverviewPage from "./pages/wholesaler/WholesalerOverviewPage";
import AddProductPage from "./pages/wholesaler/AddProductPage";
import ProductInventoryPage from "./pages/wholesaler/ProductInventoryPage";
import WholesalerOrdersPage from "./pages/wholesaler/WholesalerOrdersPage";
import WholesalerContactsPage from "./pages/wholesaler/WholesalerContactsPage";
import WholesalerNotificationsPage from "./pages/wholesaler/WholesalerNotificationsPage";
import ShopkeeperOverviewPage from "./pages/shopkeeper/ShopkeeperOverviewPage";
import ShopkeeperProductsPage from "./pages/shopkeeper/ShopkeeperProductsPage";
import ShopkeeperOrderPage from "./pages/shopkeeper/ShopkeeperOrderPage";
import ShopkeeperInventoryPage from "./pages/shopkeeper/ShopkeeperInventoryPage";
import ShopkeeperAnalyticsPage from "./pages/shopkeeper/ShopkeeperAnalyticsPage";
import ShopkeeperActivityPage from "./pages/shopkeeper/ShopkeeperActivityPage";
import ShopkeeperFeedbackPage from "./pages/shopkeeper/ShopkeeperFeedbackPage";
import ShopkeeperSoldProductsPage from "./pages/shopkeeper/ShopkeeperSoldProductsPage";
import CustomerOverviewPage from "./pages/customer/CustomerOverviewPage";
import CustomerShopsPage from "./pages/customer/CustomerShopsPage";
import CustomerProductsPage from "./pages/customer/CustomerProductsPage";
import CustomerOrdersPage from "./pages/customer/CustomerOrdersPage";
import CustomerBulkTrackingPage from "./pages/customer/CustomerBulkTrackingPage";
import CustomerFeedbackPage from "./pages/customer/CustomerFeedbackPage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/wholesaler"
          element={
            <ProtectedRoute allowedRoles={["wholesaler"]}>
              <WholesalerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<WholesalerOverviewPage />} />
          <Route path="add-product" element={<AddProductPage />} />
          <Route path="inventory" element={<ProductInventoryPage />} />
          <Route path="orders" element={<WholesalerOrdersPage />} />
          <Route path="contacts" element={<WholesalerContactsPage />} />
          <Route path="notifications" element={<WholesalerNotificationsPage />} />
        </Route>
        <Route
          path="/dashboard/shopkeeper"
          element={
            <ProtectedRoute allowedRoles={["shopkeeper"]}>
              <ShopkeeperDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<ShopkeeperOverviewPage />} />
          <Route path="products" element={<ShopkeeperProductsPage />} />
          <Route path="order" element={<ShopkeeperOrderPage />} />
          <Route path="inventory" element={<ShopkeeperInventoryPage />} />
          <Route path="analytics" element={<ShopkeeperAnalyticsPage />} />
          <Route path="activity" element={<ShopkeeperActivityPage />} />
          <Route path="sold" element={<ShopkeeperSoldProductsPage />} />
          <Route path="feedback" element={<ShopkeeperFeedbackPage />} />
        </Route>
        <Route
          path="/dashboard/customer"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerOverviewPage />} />
          <Route path="shops" element={<CustomerShopsPage />} />
          <Route path="products" element={<CustomerProductsPage />} />
          <Route path="orders" element={<CustomerOrdersPage />} />
          <Route path="bulk" element={<CustomerBulkTrackingPage />} />
          <Route path="feedback" element={<CustomerFeedbackPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}