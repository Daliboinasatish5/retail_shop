import { useOutletContext } from "react-router-dom";

export default function CustomerBulkTrackingPage() {
  const { bulkOrders } = useOutletContext();

  return (
    <div className="cu-card">
      <div className="cu-card-head">Bulk Order Request Tracking</div>
      <div className="cu-card-body space-y-2">
        {bulkOrders.length === 0 ? (
          <p className="text-sm cu-muted">No bulk requests yet.</p>
        ) : (
          bulkOrders.map((order) => (
            <div key={order._id} className="cu-row-card text-sm cu-text">
              {order.productId?.name} | Qty: {order.quantity} | ₹{order.totalPrice} | Status: {order.status}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
