import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { connectSocket } from "../services/socket";
import { getUser } from "../services/auth";
import api from "../services/api";

const initialForm = {
  name: "",
  category: "fruits",
  price: 0,
  quantity: 0,
  description: "",
};

export default function WholesalerDashboard() {
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
    `px-3 py-2 rounded text-sm ${isActive ? "bg-indigo-600 text-white" : "bg-white border text-slate-700"}`;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Wholesaler Dashboard</h1>

      <div className="flex flex-wrap gap-2">
        <NavLink end to="/dashboard/wholesaler" className={navClass}>
          Overview
        </NavLink>
        <NavLink to="/dashboard/wholesaler/add-product" className={navClass}>
          Add Product
        </NavLink>
        <NavLink to="/dashboard/wholesaler/inventory" className={navClass}>
          Inventory
        </NavLink>
        <NavLink to="/dashboard/wholesaler/orders" className={navClass}>
          Orders
        </NavLink>
        <NavLink to="/dashboard/wholesaler/contacts" className={navClass}>
          Shopkeepers
        </NavLink>
        <NavLink to="/dashboard/wholesaler/notifications" className={navClass}>
          Notifications
        </NavLink>
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
    </div>
  );
}
