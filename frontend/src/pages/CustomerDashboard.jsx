import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import api from "../services/api";
import { getUser } from "../services/auth";
import "../styles/customer.css";

export default function CustomerDashboard() {
  const user = getUser();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [bill, setBill] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bulkMessage, setBulkMessage] = useState("");
  const [kathabookMessage, setKathabookMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackForm, setFeedbackForm] = useState({ toUser: "", rating: 5, comment: "" });

  const loadBase = async () => {
    const [shopsRes, orderRes] = await Promise.all([
      api.get("/users/shops"),
      api.get("/orders/mine"),
    ]);
    setShops(shopsRes.data);
    setOrders(orderRes.data.filter((o) => o.orderType === "customer_order"));
  };

  useEffect(() => {
    loadBase();
  }, []);

  const selectShop = async (shopkeeperId) => {
    setSelectedShop(shopkeeperId);
    const { data } = await api.get(`/inventory/shop/${shopkeeperId}`);
    setProducts(data);
  };

  const buy = async (productId) => {
    const qty = Number(quantity[productId] || 1);
    const { data } = await api.post("/inventory/purchase", {
      shopkeeperId: selectedShop,
      productId,
      quantity: qty,
    });
    setBill({ ...data.bill, paymentStatus: "Paid" });
    await selectShop(selectedShop);
    await loadBase();
  };

  const requestBulkOrder = async (productId) => {
    try {
      setBulkMessage("");
      setKathabookMessage("");
      const qty = Number(quantity[productId] || 1);
      const { data } = await api.post("/inventory/bulk-request", {
        shopkeeperId: selectedShop,
        productId,
        quantity: qty,
      });
      setBulkMessage(data.message || "Bulk request placed successfully");
      await loadBase();
    } catch (error) {
      setBulkMessage(error.response?.data?.message || "Failed to place bulk request");
    }
  };

  const addToKathabook = async (productId) => {
    try {
      setBulkMessage("");
      setKathabookMessage("");
      const qty = Number(quantity[productId] || 1);
      const { data } = await api.post("/inventory/kathabook", {
        shopkeeperId: selectedShop,
        productId,
        quantity: qty,
      });
      setKathabookMessage(data.message || "Added to Kathabook successfully");
      await loadBase();
    } catch (error) {
      setKathabookMessage(error.response?.data?.message || "Failed to add to Kathabook");
    }
  };

  const bulkOrders = orders.filter((order) => order.bulkRequest);
  const navClass = ({ isActive }) =>
    `cu-nav-link ${isActive ? "cu-nav-link-active" : ""}`;

  const sendFeedback = async (e) => {
    e.preventDefault();
    try {
      setFeedbackMessage("");
      await api.post("/feedback", feedbackForm);
      setFeedbackMessage("Feedback sent to shopkeeper successfully");
      setFeedbackForm({ toUser: "", rating: 5, comment: "" });
    } catch (error) {
      setFeedbackMessage(error.response?.data?.message || "Failed to send feedback");
    }
  };

  return (
    <div className="cu-shell">
      <div className="cu-header">
        <div>
          <p className="cu-eyebrow">Retail Operations</p>
          <h1 className="cu-title">Customer Dashboard</h1>
        </div>
        <div className="cu-badge">
          <span className="cu-dot"></span>
          {shops.length} shops · {orders.length} orders
        </div>
      </div>

      <div className="cu-nav">
        <NavLink end to="/dashboard/customer" className={navClass}>
          Overview
        </NavLink>
        <NavLink to="/dashboard/customer/shops" className={navClass}>
          Shops
        </NavLink>
        <NavLink to="/dashboard/customer/products" className={navClass}>
          Products
        </NavLink>
        <NavLink to="/dashboard/customer/orders" className={navClass}>
          Orders
        </NavLink>
        <NavLink to="/dashboard/customer/bulk" className={navClass}>
          Bulk Tracking
        </NavLink>
        <NavLink to="/dashboard/customer/feedback" className={navClass}>
          Feedback
        </NavLink>
      </div>

      <Outlet
        context={{
          user,
          shops,
          selectedShop,
          setSelectedShop,
          products,
          quantity,
          setQuantity,
          bill,
          orders,
          bulkOrders,
          bulkMessage,
          kathabookMessage,
          feedbackMessage,
          feedbackForm,
          setFeedbackForm,
          selectShop,
          buy,
          requestBulkOrder,
          addToKathabook,
          sendFeedback,
        }}
      />
    </div>
  );
}
