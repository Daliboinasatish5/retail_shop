import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function CustomerOrdersPage() {
  const { orders } = useOutletContext();

  return (
    <PageCard title="Order History">
      {orders.map((o) => (
        <p key={o._id} className="text-sm border-b py-1">
          {o.productId?.name} | Qty: {o.quantity} | ₹{o.totalPrice} | {o.status}
        </p>
      ))}
    </PageCard>
  );
}
