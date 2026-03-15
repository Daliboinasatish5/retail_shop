import { useOutletContext } from "react-router-dom";
import "../../styles/wholesaler.css";

export default function ProductInventoryPage() {
  const { products } = useOutletContext();

  return (
    <div className="wh-page">
      <div className="wh-card">
        <div className="wh-card-header"><span className="wh-card-title">Product Inventory</span></div>
        <div className="wh-card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
            {products.map((p) => (
              <div key={p._id} className="wh-inner-card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: "0.92rem", fontWeight: 500, color: "#d4e8da", marginBottom: "2px" }}>{p.name}</p>
                    <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#2e5040" }}>{p.category}</p>
                  </div>
                  <span className="wh-tag">{p.category}</span>
                </div>
                <div className="wh-meta-row" style={{ marginTop: "10px" }}>
                  <div className="wh-meta-item">
                    <span className="wh-meta-val">{p.quantity}</span>
                    <span className="wh-meta-lbl">Quantity</span>
                  </div>
                  <div className="wh-meta-sep"></div>
                  <div className="wh-meta-item">
                    <span className="wh-meta-val">₹{p.price}</span>
                    <span className="wh-meta-lbl">Price</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#2e5040", marginTop: "8px", fontWeight: 300 }}>
                  {p.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
