import { useEffect, useMemo, useState } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import api from "../services/api";
import { connectSocket } from "../services/socket";
import { getUser } from "../services/auth";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../styles/shopkeeper.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ShopkeeperDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [products, setProducts] = useState([]);
  const [wholesalers, setWholesalers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [kathabookEntries, setKathabookEntries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWholesalerId, setSelectedWholesalerId] = useState("");
  const [orderForm, setOrderForm] = useState({ productId: "", quantity: 1 });
  const [feedbackForm, setFeedbackForm] = useState({ toUser: "", rating: 5, comment: "" });
  const [deliveryLoading, setDeliveryLoading] = useState({});
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [customerOrderLoading, setCustomerOrderLoading] = useState({});
  const [customerOrderMessage, setCustomerOrderMessage] = useState("");
  const [loadMessage, setLoadMessage] = useState("");

  const loadData = async () => {
    const [p, w, i, k, o, a, n] = await Promise.allSettled([
      api.get("/products"),
      api.get("/users/wholesalers"),
      api.get("/inventory/shopkeeper"),
      api.get("/inventory/shopkeeper/kathabook"),
      api.get("/orders/mine"),
      api.get("/analytics/shopkeeper/daily-sales"),
      api.get("/notifications/mine"),
    ]);

    if (p.status === "fulfilled") setProducts(p.value.data || []);
    if (w.status === "fulfilled") setWholesalers(w.value.data || []);
    if (i.status === "fulfilled") setInventory(i.value.data || []);
    if (k.status === "fulfilled") setKathabookEntries(k.value.data || []);
    if (o.status === "fulfilled") setOrders(o.value.data || []);
    if (a.status === "fulfilled") setAnalytics(a.value.data || []);
    if (n.status === "fulfilled") setNotifications(n.value.data || []);

    const hasFailure = [p, w, i, k, o, a, n].some((entry) => entry.status === "rejected");
    setLoadMessage(hasFailure ? "Some dashboard data failed to load. Please refresh once." : "");
  };

  useEffect(() => {
    loadData();

    const socket = connectSocket(user?.id);
    socket.on("notification:new", (payload) => {
      setNotifications((prev) => [payload, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const createOrder = async (e) => {
    e.preventDefault();
    await api.post("/orders/shopkeeper", orderForm);
    setOrderForm({ productId: "", quantity: 1 });
    await loadData();
  };

  const createOrderFromProduct = async (productId, quantity = 1) => {
    await api.post("/orders/shopkeeper", { productId, quantity: Number(quantity) || 1 });
    await loadData();
  };

  const createMultipleOrders = async (items = []) => {
    const normalizedItems = items
      .map((item) => ({
        productId: item.productId,
        quantity: Math.max(1, Number(item.quantity) || 1),
      }))
      .filter((item) => item.productId);

    if (!normalizedItems.length) {
      throw new Error("Please add at least one valid product");
    }

    const results = await Promise.allSettled(
      normalizedItems.map((item) => api.post("/orders/shopkeeper", item))
    );

    const successCount = results.filter((result) => result.status === "fulfilled").length;
    const failed = results.filter((result) => result.status === "rejected");

    await loadData();

    return {
      successCount,
      failedCount: failed.length,
      failedMessages: failed
        .map((result) => result.reason?.response?.data?.message || result.reason?.message || "Failed to place order")
        .filter(Boolean),
    };
  };

  const sendFeedback = async (e) => {
    e.preventDefault();
    await api.post("/feedback", feedbackForm);
    setFeedbackForm({ toUser: "", rating: 5, comment: "" });
  };

  const confirmDelivery = async (orderId) => {
    try {
      setDeliveryMessage("");
      setDeliveryLoading((prev) => ({ ...prev, [orderId]: true }));
      await api.patch(`/orders/${orderId}/confirm-delivery`);
      setDeliveryMessage("Order marked as delivered successfully");
      await loadData();
    } catch (error) {
      setDeliveryMessage(error.response?.data?.message || "Failed to mark order as delivered");
    } finally {
      setDeliveryLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const updateCustomerOrderStatus = async (orderId, status) => {
    try {
      setCustomerOrderMessage("");
      setCustomerOrderLoading((prev) => ({ ...prev, [orderId]: true }));
      await api.patch(`/orders/${orderId}/customer-status`, { status });
      setCustomerOrderMessage(`Customer order updated to ${status}`);
      await loadData();
    } catch (error) {
      setCustomerOrderMessage(error.response?.data?.message || "Failed to update customer order");
    } finally {
      setCustomerOrderLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const navClass = ({ isActive }) =>
    `sk-nav-link ${isActive ? "sk-nav-link-active" : ""}`;

  return (
    <div className="sk-shell">
      <div className="sk-header">
        <div>
          <p className="sk-eyebrow">Retail Operations</p>
          <h1 className="sk-title">Shopkeeper Dashboard</h1>
        </div>
        <div className="sk-actions">
          <button className="sk-back" onClick={() => navigate("/login")}>← Back</button>
          <div className="sk-badge">
            <span className="sk-dot"></span>
            {inventory.length} inventory · {orders.length} orders
          </div>
        </div>
      </div>

      {loadMessage && <p className="sk-soft" style={{ marginBottom: "12px", color: "#eab308" }}>{loadMessage}</p>}

      <div className="sk-nav">
        <NavLink end to="/dashboard/shopkeeper" className={navClass}>
          Overview
        </NavLink>
        <NavLink to="/dashboard/shopkeeper/products" className={navClass}>
          Products
        </NavLink>
        <NavLink to="/dashboard/shopkeeper/order" className={navClass}>
          Order
        </NavLink>
        <NavLink to="/dashboard/shopkeeper/inventory" className={navClass}>
          Inventory
        </NavLink>
        <NavLink to="/dashboard/shopkeeper/analytics" className={navClass}>
          Analytics
        </NavLink>
        <NavLink to="/dashboard/shopkeeper/activity" className={navClass}>
          Activity
        </NavLink>
        <NavLink to="/dashboard/shopkeeper/kathabook" className={navClass}>
          Kathabook
        </NavLink>
        <NavLink to="/dashboard/shopkeeper/sold" className={navClass}>
          Sold Products
        </NavLink>
        <NavLink to="/dashboard/shopkeeper/feedback" className={navClass}>
          Feedback
        </NavLink>
      </div>

      <Outlet
        context={{
          products,
          wholesalers,
          filteredProducts,
          inventory,
          kathabookEntries,
          orders,
          analytics,
          notifications,
          selectedCategory,
          setSelectedCategory,
          selectedWholesalerId,
          setSelectedWholesalerId,
          orderForm,
          setOrderForm,
          feedbackForm,
          setFeedbackForm,
          createOrder,
          createOrderFromProduct,
          createMultipleOrders,
          sendFeedback,
          confirmDelivery,
          deliveryLoading,
          deliveryMessage,
          updateCustomerOrderStatus,
          customerOrderLoading,
          customerOrderMessage,
          currentUserId: user?.id,
        }}
      />
    </div>
  );
}
