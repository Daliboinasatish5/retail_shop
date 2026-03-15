import { useOutletContext } from "react-router-dom";
import "../../styles/wholesaler.css";

export default function WholesalerNotificationsPage() {
  const { notifications } = useOutletContext();

  return (
    <div className="wh-page">
      <div className="wh-card">
        <div className="wh-card-header"><span className="wh-card-title">Live Notifications</span></div>
        <div className="wh-card-body">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {notifications.map((n) => (
              <div key={n._id} className="wh-inner-card" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div className="wh-notif-dot"></div>
                <div>
                  <p style={{ fontSize: "0.86rem", color: "#d4e8da", lineHeight: 1.55 }}>{n.message}</p>
                  <p style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#2e5040", marginTop: "4px" }}>{n.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
