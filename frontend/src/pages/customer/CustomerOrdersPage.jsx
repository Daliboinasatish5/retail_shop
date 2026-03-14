import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function CustomerOrdersPage() {
  const { orders } = useOutletContext();

  return (
    <PageCard title="Order History">
      {orders.map((o) => (
        <div key={o._id} className="text-sm border-b py-1">
          <p>
            {o.productId?.name} | Qty: {o.quantity} | ₹{o.totalPrice} | {o.status}
          </p>
          <p className="text-xs text-slate-500">
            Shop Location: {o.sellerLocation || o.sellerId?.address || "Not available"}
          </p>
        </div>
      ))}
    </PageCard>
  );
}
