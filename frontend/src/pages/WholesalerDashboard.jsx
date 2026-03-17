import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
    `wh-nav-link ${isActive ? "wh-nav-link-active" : ""}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .wh-shell {
          min-height: calc(100vh - 68px);
          width: 100%;
          padding: 2.4rem 2rem 3rem;
          background:
            radial-gradient(ellipse 820px 520px at -8% -8%, rgba(16,185,129,0.1) 0%, transparent 55%),
            radial-gradient(ellipse 720px 420px at 105% 12%, rgba(29,78,216,0.08) 0%, transparent 52%),
            #080c09;
          color: #d4e8da;
          font-family: 'DM Sans', sans-serif;
        }
        .wh-inner { max-width: 1180px; margin: 0 auto; }
        .wh-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 1rem; flex-wrap: wrap; margin-bottom: 1.7rem;
        }
        .wh-eyebrow {
          display: flex; align-items: center; gap: 7px; margin-bottom: 5px;
          font-size: 0.68rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.15em; color: #34d399;
        }
        .wh-eyebrow::before { content: ''; width: 16px; height: 1.5px; border-radius: 2px; background: #34d399; }
        .wh-title {
          font-family: 'Playfair Display', serif; font-size: 1.85rem; font-weight: 700; letter-spacing: -0.03em; color: #ecf5ef;
        }
        .wh-actions { display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap; }
        .wh-back,
        .wh-badge {
          border-radius: 100px; font-size: 0.77rem; white-space: nowrap;
        }
        .wh-back {
          border: 1px solid rgba(255,255,255,0.14); background: #0f1512; color: #d4e8da;
          padding: 7px 14px; cursor: pointer; transition: border-color 0.2s, background 0.2s;
        }
        .wh-back:hover { border-color: rgba(52,211,153,0.35); background: #131c17; }
        .wh-badge {
          display: flex; align-items: center; gap: 7px; padding: 6px 15px; color: #34d399;
          border: 1px solid rgba(52,211,153,0.2); background: transparent;
        }
        .wh-badge-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #34d399; animation: whBlink 2.4s ease-in-out infinite;
        }
        @keyframes whBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .wh-nav {
          display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.5rem;
        }
        .wh-nav-link {
          padding: 0.7rem 1rem; border-radius: 12px; text-decoration: none; font-size: 0.84rem; font-weight: 500;
          color: #8fbba0; background: #0d1410; border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.2s, transform 0.2s, background 0.2s, color 0.2s;
        }
        .wh-nav-link:hover {
          transform: translateY(-1px); color: #d4e8da; border-color: rgba(52,211,153,0.2); background: #101710;
        }
        .wh-nav-link-active {
          color: #ecf5ef; background: linear-gradient(135deg, #0f2f1f, #123925); border-color: rgba(52,211,153,0.34);
          box-shadow: inset 0 1px 0 rgba(52,211,153,0.08);
        }

        .wh-content .wh-card {
          background: #0d1410; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; color: #d4e8da;
          box-shadow: 0 14px 34px rgba(0,0,0,0.28);
        }
        .wh-content .wh-card-title { color: #ecf5ef; }
        .wh-content .wh-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .wh-content .wh-stat-card,
        .wh-content .wh-item-card,
        .wh-content .wh-row-card,
        .wh-content .wh-soft-panel {
          background: #101710; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; color: #d4e8da;
        }
        .wh-content .wh-muted { color: #6f907d; }
        .wh-content .wh-tag {
          display: inline-flex; align-items: center; gap: 4px; border-radius: 999px; padding: 4px 10px;
          background: rgba(52,211,153,0.07); border: 1px solid rgba(52,211,153,0.16); color: #34d399; font-size: 0.72rem;
        }
        .wh-content .wh-input {
          width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 0.8rem 0.95rem; color: #d4e8da; outline: none;
        }
        .wh-content .wh-input:focus {
          border-color: rgba(52,211,153,0.28); box-shadow: 0 0 0 3px rgba(52,211,153,0.08);
        }
        .wh-content .wh-label { display: block; margin-bottom: 0.5rem; font-size: 0.83rem; color: #8fbba0; }
        .wh-content .wh-primary-btn,
        .wh-content .wh-warn-btn {
          border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer;
        }
        .wh-content .wh-primary-btn {
          background: linear-gradient(135deg, #059669, #34d399); box-shadow: 0 10px 22px rgba(5,150,105,0.25);
        }
        .wh-content .wh-warn-btn {
          background: linear-gradient(135deg, #d97706, #f59e0b);
        }
        .wh-content .wh-message {
          margin-bottom: 0.9rem; border-radius: 12px; padding: 0.8rem 1rem; font-size: 0.86rem;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: #d4e8da;
        }

        @media (max-width: 960px) {
          .wh-shell { padding: 1.5rem 1rem 2.5rem; }
          .wh-content .wh-stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .wh-content .wh-stat-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="wh-shell">
        <div className="wh-inner">
          <div className="wh-header">
            <div>
              <p className="wh-eyebrow">Supply Control</p>
              <h1 className="wh-title">Wholesaler Dashboard</h1>
            </div>
            <div className="wh-actions">
              <button className="wh-back" onClick={() => navigate("/login")}>← Back</button>
              <div className="wh-badge">
                <span className="wh-badge-dot"></span>
                {products.length} products · {orders.length} orders
              </div>
            </div>
          </div>

          <div className="wh-nav">
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

          <div className="wh-content">
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
        </div>
      </div>
    </>
  );
}
