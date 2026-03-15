import { useOutletContext } from "react-router-dom";
import "../../styles/wholesaler.css";

const statusClass = { pending: "wh-status-pending", accepted: "wh-status-accepted", delivered: "wh-status-delivered" };

export default function WholesalerOrdersPage() {
  const { orders, updateOrderStatus, orderActionLoading, orderActionMessage } = useOutletContext();

  return (
    <div className="wh-page">
      {orderActionMessage && (
        <div style={{ marginBottom: "1rem", padding: "10px 14px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "9px", fontSize: "0.84rem", color: "#34d399" }}>
          {orderActionMessage}
        </div>
      )}
      <div className="wh-card">
        <div className="wh-card-header"><span className="wh-card-title">Orders From Shopkeepers</span></div>
        <div className="wh-card-body">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {orders.map((o) => (
              <div key={o._id} className="wh-inner-card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.92rem", fontWeight: 500, color: "#d4e8da", marginBottom: "6px" }}>{o.productId?.name}</p>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.8rem", color: "#6b8a78" }}>Qty: {o.quantity}</span>
                    <span className={statusClass[o.status] || "wh-tag"}>{o.status}</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#2e5040", marginBottom: "2px" }}>Buyer: {o.buyerId?.name} ({o.buyerId?.phone || "—"})</p>
                  <p style={{ fontSize: "0.75rem", color: "#2e5040" }}>Delivery: {o.buyerLocation || o.buyerId?.address || "Not available"}</p>
                </div>
                <button
                  className="wh-btn-warn"
                  style={{ whiteSpace: "nowrap", marginTop: "2px" }}
                  disabled={orderActionLoading[o._id] || o.status === "accepted" || o.status === "delivered"}
                  onClick={() => updateOrderStatus(o._id, "accepted")}
                >
                  {orderActionLoading[o._id] ? "Updating…" : "Accept"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
