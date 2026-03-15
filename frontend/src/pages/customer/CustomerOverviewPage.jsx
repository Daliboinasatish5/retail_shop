import { useOutletContext } from "react-router-dom";

export default function CustomerOverviewPage() {
  const { user, shops, products, orders, bill } = useOutletContext();

  return (
    <div className="space-y-4">
      <div className="cu-card">
        <div className="cu-card-head">Profile</div>
        <div className="cu-card-body space-y-1">
          <p className="cu-text">Name: {user?.name}</p>
          <p className="cu-text">Phone: {user?.phone || "-"}</p>
          <p className="cu-text">Address: {user?.address || "-"}</p>
        </div>
      </div>

      <div className="cu-stat-grid">
        <div className="cu-stat-card">
          <p className="cu-stat-label">Nearby Shops</p>
          <p className="cu-stat-num">{shops.length}</p>
        </div>
        <div className="cu-stat-card">
          <p className="cu-stat-label">Visible Products</p>
          <p className="cu-stat-num">{products.length}</p>
        </div>
        <div className="cu-stat-card">
          <p className="cu-stat-label">Total Orders</p>
          <p className="cu-stat-num">{orders.length}</p>
        </div>
        <div className="cu-stat-card">
          <p className="cu-stat-label">Last Payment</p>
          <p className="cu-stat-num">{bill?.paymentStatus || "-"}</p>
        </div>
      </div>
    </div>
  );
}
