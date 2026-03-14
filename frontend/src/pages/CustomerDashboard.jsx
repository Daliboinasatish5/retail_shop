import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import api from "../services/api";
import { getUser } from "../services/auth";

export default function CustomerDashboard() {
  const user = getUser();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [bill, setBill] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bulkMessage, setBulkMessage] = useState("");
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

  const bulkOrders = orders.filter((order) => order.bulkRequest);
  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded text-sm ${isActive ? "bg-indigo-600 text-white" : "bg-white border text-slate-700"}`;

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
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Customer Dashboard</h1>

      <div className="flex flex-wrap gap-2">
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
          feedbackMessage,
          feedbackForm,
          setFeedbackForm,
          selectShop,
          buy,
          requestBulkOrder,
          sendFeedback,
        }}
      />
    </div>
  );
}
