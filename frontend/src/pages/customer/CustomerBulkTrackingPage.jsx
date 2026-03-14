import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function CustomerBulkTrackingPage() {
  const { bulkOrders } = useOutletContext();

  return (
    <PageCard title="Bulk Order Request Tracking">
      {bulkOrders.length === 0 ? (
        <p className="text-sm text-slate-500">No bulk requests yet.</p>
      ) : (
        bulkOrders.map((order) => (
          <p key={order._id} className="text-sm border-b py-1">
            {order.productId?.name} | Qty: {order.quantity} | ₹{order.totalPrice} | Status: {order.status}
          </p>
        ))
      )}
    </PageCard>
  );
}
