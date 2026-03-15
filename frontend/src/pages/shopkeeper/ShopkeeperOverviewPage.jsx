import { useOutletContext, useNavigate } from "react-router-dom";

export default function ShopkeeperOverviewPage() {
  const { products, wholesalers, inventory, orders, notifications, setSelectedWholesalerId } = useOutletContext();
  const navigate = useNavigate();

  const openWholesalerProducts = (wholesalerId) => {
    setSelectedWholesalerId(wholesalerId);
    navigate("/dashboard/shopkeeper/products");
  };

  return (
    <div className="sk-page">
      <div className="sk-stat-grid" style={{ marginBottom: "1rem" }}>
        {[
          { label: "Wholesalers", value: wholesalers.length },
          { label: "Wholesaler Products", value: products.length },
          { label: "My Inventory", value: inventory.length },
          { label: "Orders", value: orders.length },
          { label: "Notifications", value: notifications.length },
        ].map((item) => (
          <div key={item.label} className="sk-stat-card">
            <div className="sk-stat-label">{item.label}</div>
            <div className="sk-stat-num">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="sk-card">
        <div className="sk-card-head">All Wholesalers</div>
        <div className="sk-card-body">
        {wholesalers.length === 0 ? (
          <p className="sk-muted text-sm">No wholesalers found.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {wholesalers.map((wholesaler) => (
              <button
                key={wholesaler._id}
                type="button"
                onClick={() => openWholesalerProducts(wholesaler._id)}
                className="sk-row-card text-left"
              >
                <p className="text-sm font-semibold sk-text">{wholesaler.name}</p>
                <p className="text-sm sk-muted">{wholesaler.email || "-"}</p>
                <p className="text-sm sk-muted">{wholesaler.phone || "-"}</p>
                <p className="text-sm sk-muted">Location: {wholesaler.address || "Not available"}</p>
                <p className="mt-1 text-xs" style={{ color: "#34d399" }}>Click to view products & order</p>
              </button>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
