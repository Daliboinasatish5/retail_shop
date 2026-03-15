import { useOutletContext } from "react-router-dom";

export default function CustomerOrdersPage() {
  const { orders } = useOutletContext();

  return (
    <div className="cu-card">
      <div className="cu-card-head">Order History</div>
      <div className="cu-card-body space-y-2">
        {orders.map((o) => (
          <div key={o._id} className="cu-row-card">
            <p className="text-sm cu-text">
              {o.productId?.name} | Qty: {o.quantity} | ₹{o.totalPrice} | {o.status}
            </p>
            <p className="text-xs cu-muted">
              Shop Location: {o.sellerLocation || o.sellerId?.address || "Not available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
