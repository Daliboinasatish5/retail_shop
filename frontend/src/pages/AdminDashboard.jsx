import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [overview, setOverview] = useState({ users: 0, products: 0, orders: 0 });
  const [activePanel, setActivePanel] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const wholesalers = users.filter((u) => u.role === "wholesaler");
  const shopkeepers = users.filter((u) => u.role === "shopkeeper");
  const customers   = users.filter((u) => u.role === "customer");

  const load = async () => {
    const [usersRes, overviewRes] = await Promise.all([
      api.get("/users/admin/users"),
      api.get("/users/admin/overview"),
    ]);
    setUsers(usersRes.data);
    setOverview(overviewRes.data);
  };

  useEffect(() => { load(); }, []);

  const deleteUser = async (id) => {
    await api.delete(`/users/admin/users/${id}`);
    await load();
  };

  const initials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const filtered = (list) =>
    list.filter((u) =>
      [u.name, u.email, u.phone, u.role].join(" ")
        .toLowerCase().includes(searchQuery.toLowerCase())
    );

  const stats = [
    { key: "overview",    icon: "📊", num: users.length,       label: "Overview"     },
    { key: "wholesalers", icon: "🏭", num: wholesalers.length,  label: "Wholesalers"  },
    { key: "shopkeepers", icon: "🏪", num: shopkeepers.length,  label: "Shopkeepers"  },
    { key: "customers",   icon: "🛒", num: customers.length,    label: "Customers"    },
    { key: "products",    icon: "📦", num: overview.products,   label: "Products"     },
  ];

  const tableData = {
    wholesalers: { icon: "🏭", title: "Wholesalers", list: wholesalers },
    shopkeepers: { icon: "🏪", title: "Shopkeepers", list: shopkeepers },
    customers:   { icon: "🛒", title: "Customers",   list: customers  },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        /* ── GLOBAL RESET: kills white bleed from any parent ── */
        html, body, #root {
          background: #080c09 !important;
          margin: 0 !important;
          padding: 0 !important;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ─────────────────────────────────────────────────────
           COLOR RULES:
           background  → #080c09 (near black)
           cards/panel → #0d1410 (very dark, tiny green tint)
           borders     → rgba(255,255,255,0.07)  subtle white
           green       → ONLY on numbers, labels, icons, badges
           NO rgba(52,211,153,x) on backgrounds ever
        ───────────────────────────────────────────────────── */

        .dash {
          width: 100%;
          min-height: calc(100vh - 66px);
          background: #080c09;
          padding: 2.5rem 2.5rem 4rem;
          font-family: 'DM Sans', sans-serif;
          color: #d4e8da;
        }

        /* ── HEADER ── */
        .dash-header {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2.25rem;
          flex-wrap: wrap; gap: 1rem;
        }
        .dash-eyebrow {
          display: flex; align-items: center; gap: 7px;
          font-size: 0.68rem; font-weight: 500; color: #34d399;
          text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 5px;
        }
        .dash-eyebrow::before {
          content: ''; width: 16px; height: 1.5px;
          background: #34d399; border-radius: 2px;
        }
        .dash-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.85rem; font-weight: 700;
          color: #ecf5ef; letter-spacing: -0.03em;
        }
        .dash-badge {
          display: flex; align-items: center; gap: 7px;
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 100px; padding: 6px 16px;
          font-size: 0.77rem; color: #34d399;
          background: transparent; white-space: nowrap;
        }
        .dash-actions { display: flex; align-items: center; gap: 0.6rem; }
        .btn-back {
          border: 1px solid rgba(255,255,255,0.14);
          background: #0f1512;
          color: #d4e8da;
          border-radius: 10px;
          padding: 7px 14px;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-back:hover {
          border-color: rgba(52,211,153,0.35);
          background: #131c17;
        }
        .badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #34d399;
          animation: blink 2.5s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        /* ── STAT CARDS ── */
        .stat-grid {
          display: grid; grid-template-columns: repeat(5, 1fr);
          gap: 12px; margin-bottom: 2rem;
        }
        .stat-card {
          background: #0d1410;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 1.3rem 1.1rem 1rem;
          cursor: pointer; position: relative; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s, background 0.2s;
        }
        .stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #059669, #34d399);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.3s cubic-bezier(.4,0,.2,1);
        }
        .stat-card:hover {
          border-color: rgba(52,211,153,0.2);
          transform: translateY(-2px); background: #101710;
        }
        .stat-card:hover::before { transform: scaleX(1); }
        .stat-card.sc-active {
          border-color: rgba(52,211,153,0.35);
          background: #101710; transform: translateY(-2px);
        }
        .stat-card.sc-active::before { transform: scaleX(1); }
        .stat-icon {
          width: 32px; height: 32px;
          background: rgba(52,211,153,0.07);
          border: 1px solid rgba(52,211,153,0.12);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.88rem; margin-bottom: 1rem;
        }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 700;
          color: #34d399; letter-spacing: -0.04em; line-height: 1;
        }
        .stat-label {
          font-size: 0.68rem; color: #3a6348;
          text-transform: uppercase; letter-spacing: 0.1em; margin-top: 5px;
        }
        .stat-card.sc-active .stat-label { color: #6ab88a; }
        .stat-hint {
          position: absolute; bottom: 9px; right: 10px;
          font-size: 0.6rem; color: #34d399; opacity: 0;
        }
        .stat-card.sc-active .stat-hint { opacity: 0.6; }

        /* ── PANEL ── */
        .panel {
          display: none;
          border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          background: #0d1410;
        }
        .panel.p-active {
          display: block;
          animation: panelIn 0.3s ease both;
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* panel header — pure dark, NO green background */
        .panel-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem;
          background: #0d1410;
        }
        .panel-title-wrap { display: flex; align-items: center; gap: 10px; }
        .panel-icon {
          width: 34px; height: 34px;
          background: rgba(52,211,153,0.07);
          border: 1px solid rgba(52,211,153,0.14);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.95rem;
        }
        .panel-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 700; color: #ecf5ef;
        }
        .panel-count {
          font-size: 0.7rem; color: #34d399;
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 100px; padding: 3px 10px;
        }
        .panel-search {
          display: flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; padding: 7px 12px;
          transition: border-color 0.2s;
        }
        .panel-search:focus-within {
          border-color: rgba(52,211,153,0.28);
        }
        .panel-search input {
          background: transparent; border: none; outline: none;
          font-size: 0.82rem; color: #d4e8da;
          font-family: 'DM Sans', sans-serif; width: 160px;
        }
        .panel-search input::placeholder { color: #2e5040; }

        /* ── TABLE ── */
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { border-bottom: 1px solid rgba(255,255,255,0.06); }
        thead th {
          padding: 0.85rem 1.5rem;
          font-size: 0.67rem; text-transform: uppercase;
          letter-spacing: 0.1em; color: #2e5040;
          font-weight: 500; text-align: left; white-space: nowrap;
        }
        tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.12s;
        }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: rgba(52,211,153,0.025); }
        tbody td {
          padding: 0.9rem 1.5rem;
          font-size: 0.86rem; color: #6b8a78;
          vertical-align: middle;
        }
        tbody td:first-child { color: #d4e8da; font-weight: 500; }

        .avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: #0c1f12;
          border: 1px solid rgba(52,211,153,0.18);
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 0.68rem; font-weight: 600; color: #34d399;
          margin-right: 9px; vertical-align: middle; flex-shrink: 0;
        }
        .role-pill {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.69rem; padding: 2px 9px; border-radius: 100px;
          background: rgba(52,211,153,0.06);
          border: 1px solid rgba(52,211,153,0.14);
          color: #34d399;
        }
        .btn-delete {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.72rem; font-weight: 500; color: #f87171;
          background: rgba(248,113,113,0.07);
          border: 1px solid rgba(248,113,113,0.18);
          border-radius: 6px; padding: 4px 11px;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background 0.15s;
        }
        .btn-delete:hover { background: rgba(248,113,113,0.14); }

        /* ── OVERVIEW 3-COL — pure dark cells ── */
        .overview-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: rgba(255,255,255,0.05);
        }
        .ov-cell { padding: 2.25rem 2rem; background: #0d1410; transition: background 0.15s; }
        .ov-cell:hover { background: #101710; }
        .ov-big {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem; font-weight: 700;
          color: #34d399; letter-spacing: -0.04em; line-height: 1;
        }
        .ov-label {
          font-size: 0.68rem; color: #2e5040;
          text-transform: uppercase; letter-spacing: 0.12em; margin-top: 6px;
        }
        .ov-sub { font-size: 0.78rem; color: #4a7060; margin-top: 6px; font-weight: 300; }

        /* ── EMPTY ── */
        .empty-state { padding: 3rem 2rem; text-align: center; }
        .empty-state .empty-icon { font-size: 2rem; opacity: 0.3; margin-bottom: 8px; }
        .empty-state p { font-size: 0.85rem; color: #2e5040; }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) { .stat-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .overview-grid { grid-template-columns: 1fr; }
          .dash { padding: 1.5rem 1rem 3rem; }
          thead th, tbody td { padding: 0.75rem 1rem; }
          .panel-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="dash">

        {/* HEADER */}
        <div className="dash-header">
          <div>
            <p className="dash-eyebrow">Control Center</p>
            <h1 className="dash-title">Admin Dashboard</h1>
          </div>
          <div className="dash-actions">
            <button className="btn-back" onClick={() => navigate("/login")}>← Back</button>
            <div className="dash-badge">
              <span className="badge-dot"></span>
              {users.length} active users
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="stat-grid">
          {stats.map((s) => (
            <div
              key={s.key}
              className={`stat-card${activePanel === s.key ? " sc-active" : ""}`}
              onClick={() => { setActivePanel(s.key); setSearchQuery(""); }}
            >
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
              <span className="stat-hint">▼ open</span>
            </div>
          ))}
        </div>

        {/* PANELS */}
        <div className="panels">

          {/* Overview */}
          <div className={`panel${activePanel === "overview" ? " p-active" : ""}`}>
            <div className="panel-header">
              <div className="panel-title-wrap">
                <div className="panel-icon">📊</div>
                <span className="panel-title">Platform Overview</span>
              </div>
            </div>
            <div className="overview-grid">
              <div className="ov-cell">
                <div className="ov-big">{overview.products}</div>
                <div className="ov-label">Total Products</div>
                <div className="ov-sub">Across all wholesalers</div>
              </div>
              <div className="ov-cell">
                <div className="ov-big">{overview.orders}</div>
                <div className="ov-label">Total Orders</div>
                <div className="ov-sub">All-time order count</div>
              </div>
              <div className="ov-cell">
                <div className="ov-big">{users.length}</div>
                <div className="ov-label">Total Users</div>
                <div className="ov-sub">
                  {wholesalers.length} wholesalers · {shopkeepers.length} shops · {customers.length} customers
                </div>
              </div>
            </div>
          </div>

          {/* User tables */}
          {Object.entries(tableData).map(([key, { icon, title, list }]) => (
            <div key={key} className={`panel${activePanel === key ? " p-active" : ""}`}>
              <div className="panel-header">
                <div className="panel-title-wrap">
                  <div className="panel-icon">{icon}</div>
                  <span className="panel-title">{title}</span>
                  <span className="panel-count">{list.length} users</span>
                </div>
                <div className="panel-search">
                  <span style={{ fontSize: "0.78rem", color: "#2e5040" }}>🔍</span>
                  <input
                    placeholder={`Search ${title.toLowerCase()}…`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered(list).length > 0 ? (
                      filtered(list).map((u) => (
                        <tr key={u._id}>
                          <td><span className="avatar">{initials(u.name)}</span>{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.phone || "—"}</td>
                          <td><span className="role-pill">{icon} {u.role}</span></td>
                          <td>
                            <button className="btn-delete" onClick={() => deleteUser(u._id)}>
                              ✕ Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <p>No results for "{searchQuery}"</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Products */}
          <div className={`panel${activePanel === "products" ? " p-active" : ""}`}>
            <div className="panel-header">
              <div className="panel-title-wrap">
                <div className="panel-icon">📦</div>
                <span className="panel-title">Total Products</span>
                <span className="panel-count">{overview.products} items</span>
              </div>
            </div>
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <p>Product details are managed by the Wholesaler Dashboard</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}