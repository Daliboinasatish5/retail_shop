import { useOutletContext } from "react-router-dom";
import "../../styles/wholesaler.css";

export default function WholesalerOverviewPage() {
  const { summary, products, orders, shopkeepers, notifications } = useOutletContext();

  return (
    <div className="wh-page">
      <div className="wh-stat-grid">
        {[
          { label: "Total Products", num: products.length },
          { label: "Total Orders", num: orders.length },
          { label: "Shopkeepers", num: shopkeepers.length },
          { label: "Notifications", num: notifications.length },
        ].map((s) => (
          <div className="wh-stat-card" key={s.label}>
            <div className="wh-stat-label">{s.label}</div>
            <div className="wh-stat-num">{s.num}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1.25rem" }}>
        <div className="wh-stat-card">
          <div className="wh-stat-label">Total Qty Sold</div>
          <div className="wh-stat-num">{summary.totalSold.quantitySold}</div>
        </div>
        <div className="wh-stat-card">
          <div className="wh-stat-label">Total Revenue</div>
          <div className="wh-stat-num">₹{summary.totalSold.revenue}</div>
        </div>
      </div>

      <div className="wh-card">
        <div className="wh-card-header"><span className="wh-card-title">Top Shopkeepers</span></div>
        <div className="wh-card-body">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {summary.topShopkeepers.map((entry) => (
              <div key={entry._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "9px" }}>
                <span style={{ fontSize: "0.84rem", color: "#d4e8da" }}>Shopkeeper {entry._id}</span>
                <span style={{ fontSize: "0.84rem", color: "#34d399", fontWeight: 500 }}>₹{entry.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wh-card">
        <div className="wh-card-header"><span className="wh-card-title">Added Products</span></div>
        <div className="wh-card-body">
          {products.length === 0 ? (
            <p className="wh-muted" style={{ fontSize: "0.88rem" }}>No products added yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
              {products.map((p) => (
                <div key={p._id} className="wh-inner-card">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: "0.92rem", fontWeight: 500, color: "#d4e8da", marginBottom: "2px" }}>{p.name}</p>
                      <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#2e5040" }}>{p.category}</p>
                    </div>
                    <span className="wh-tag">₹{p.price}</span>
                  </div>
                  <div className="wh-meta-row" style={{ marginTop: "12px" }}>
                    <span style={{ fontSize: "0.8rem", color: "#3a5a48" }}>Available Qty</span>
                    <span style={{ fontSize: "0.88rem", fontWeight: 500, color: "#d4e8da", marginLeft: "auto" }}>{p.quantity}</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#2e5040", marginTop: "8px", fontWeight: 300 }}>
                    {p.description || "No description added."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
