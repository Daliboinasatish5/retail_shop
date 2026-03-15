import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { connectSocket } from "../services/socket";
import { getUser } from "../services/auth";
import api from "../services/api";
import "../styles/wholesaler.css";

const initialForm = {
  name: "",
  category: "fruits",
  price: 0,
  quantity: 0,
  description: "",
};

export default function WholesalerDashboard() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalSold: { quantitySold: 0, revenue: 0 },
    topShopkeepers: [],
  });
  const [shopkeepers, setShopkeepers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [orderActionLoading, setOrderActionLoading] = useState({});
  const [orderActionMessage, setOrderActionMessage] = useState("");
  const user = getUser();

  const loadData = async () => {
    const [productRes, orderRes, summaryRes, shopkeepersRes] = await Promise.all([
      api.get("/products/my"),
      api.get("/orders/mine"),
      api.get("/analytics/wholesaler/summary"),
      api.get("/users/shops"),
    ]);
    setProducts(productRes.data);
    setOrders(
      orderRes.data.filter(
        (o) =>
          o.orderType === "shopkeeper_order" &&
          String(o.sellerId?._id || o.sellerId) === String(user?.id)
      )
    );
    setSummary(summaryRes.data);
    setShopkeepers(shopkeepersRes.data);

    const notificationsRes = await api.get("/notifications/mine");
    setNotifications(notificationsRes.data);
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

  const addProduct = async (e) => {
    e.preventDefault();
    await api.post("/products", form);
    setForm(initialForm);
    await loadData();
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setOrderActionMessage("");
      setOrderActionLoading((prev) => ({ ...prev, [orderId]: true }));
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrderActionMessage(`Order updated to ${status}`);
      await loadData();
    } catch (error) {
      setOrderActionMessage(error.response?.data?.message || "Failed to update order status");
    } finally {
      setOrderActionLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-xs font-medium border transition ${
      isActive
        ? "text-emerald-300 border-emerald-400/40 bg-emerald-500/10"
        : "text-slate-300 border-white/10 bg-white/5 hover:border-emerald-400/25 hover:text-emerald-300"
    }`;

  return (
    <>
      <div style={{ background: "#080c09", padding: "1.1rem 2.5rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p className="wh-section-tag" style={{ marginBottom: "6px" }}>Supply Control</p>
            <h1 style={{ color: "#ecf5ef", margin: 0, fontFamily: "'Playfair Display', serif", letterSpacing: "-0.03em" }}>
              Wholesaler Dashboard
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
            <button className="wh-btn-primary" onClick={() => navigate("/login")}>Back</button>
            <span className="wh-tag">{products.length} products · {orders.length} orders</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1rem", marginBottom: "0.4rem" }}>
          <NavLink end to="/dashboard/wholesaler" className={navClass}>Overview</NavLink>
          <NavLink to="/dashboard/wholesaler/add-product" className={navClass}>Add Product</NavLink>
          <NavLink to="/dashboard/wholesaler/inventory" className={navClass}>Inventory</NavLink>
          <NavLink to="/dashboard/wholesaler/orders" className={navClass}>Orders</NavLink>
          <NavLink to="/dashboard/wholesaler/contacts" className={navClass}>Shopkeepers</NavLink>
          <NavLink to="/dashboard/wholesaler/notifications" className={navClass}>Notifications</NavLink>
        </div>
      </div>

      <Outlet
        context={{
          form,
          setForm,
          initialForm,
          products,
          orders,
          summary,
          shopkeepers,
          notifications,
          addProduct,
          updateOrderStatus,
          orderActionLoading,
          orderActionMessage,
        }}
      />
    </>
  );
}
