import { useOutletContext } from "react-router-dom";
import "../../styles/wholesaler.css";

const initials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export default function WholesalerContactsPage() {
  const { shopkeepers } = useOutletContext();

  return (
    <div className="wh-page">
      <div className="wh-card">
        <div className="wh-card-header"><span className="wh-card-title">All Shopkeepers With Location</span></div>
        <div className="wh-card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
            {shopkeepers.map((s) => (
              <div key={s._id} className="wh-inner-card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="wh-avatar">{initials(s.name)}</div>
                    <div>
                      <p style={{ fontSize: "0.92rem", fontWeight: 500, color: "#d4e8da" }}>{s.name}</p>
                      <p style={{ fontSize: "0.78rem", color: "#2e5040", marginTop: "2px" }}>{s.phone || "—"}</p>
                    </div>
                  </div>
                  <span className="wh-tag">Shopkeeper</span>
                </div>
                <div className="wh-soft-panel" style={{ padding: "10px 12px" }}>
                  <p className="wh-soft-panel-label">Location</p>
                  <p className="wh-soft-panel-val">{s.address || "Location not available"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
