import { useOutletContext } from "react-router-dom";
import "../../styles/wholesaler.css";

export default function AddProductPage() {
  const { form, setForm, addProduct } = useOutletContext();

  return (
    <div className="wh-page">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#0d1410", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ width: "40px", height: "40px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.18)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>📦</div>
        <div>
          <p style={{ fontSize: "0.95rem", fontWeight: 500, color: "#ecf5ef" }}>Create a new wholesale product</p>
          <p style={{ fontSize: "0.78rem", color: "#2e5040", marginTop: "2px" }}>Add stock with category, pricing, quantity, and description.</p>
        </div>
      </div>

      <div className="wh-card">
        <div className="wh-card-header"><span className="wh-card-title">Add Product</span></div>
        <div className="wh-card-body">
          <form style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} onSubmit={addProduct}>
            <div className="wh-field">
              <label className="wh-label">Product Name</label>
              <input className="wh-input" placeholder="Enter product name"
                value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>

            <div className="wh-field">
              <label className="wh-label">Category</label>
              <select className="wh-input" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="groceries">Groceries</option>
              </select>
            </div>

            <div className="wh-field">
              <label className="wh-label">Price (₹)</label>
              <input className="wh-input" type="number" min="0" placeholder="Enter price"
                value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} />
            </div>

            <div className="wh-field">
              <label className="wh-label">Quantity</label>
              <input className="wh-input" type="number" min="0" placeholder="Enter quantity"
                value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: Number(e.target.value) }))} />
            </div>

            <div className="wh-field" style={{ gridColumn: "1/-1" }}>
              <label className="wh-label">Description</label>
              <textarea rows={4} className="wh-input" style={{ resize: "none" }} placeholder="Write a short product description"
                value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>

            <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0a120c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1rem 1.25rem" }}>
              <div>
                <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "#d4e8da" }}>Ready to publish?</p>
                <p style={{ fontSize: "0.75rem", color: "#2e5040", marginTop: "2px" }}>This product will appear in your inventory after saving.</p>
              </div>
              <button type="submit" className="wh-btn-primary">Add Product →</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
