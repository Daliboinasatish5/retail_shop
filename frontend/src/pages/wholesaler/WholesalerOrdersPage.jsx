import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function WholesalerOrdersPage() {
  const { orders, updateOrderStatus, orderActionLoading, orderActionMessage } = useOutletContext();

  return (
    <PageCard title="Orders From Shopkeepers">
      {orderActionMessage && (
        <p className="mb-3 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">{orderActionMessage}</p>
      )}

      <div className="space-y-2">
        {orders.map((o) => (
          <div key={o._id} className="border rounded p-2 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{o.productId?.name}</p>
              <p className="text-sm">Qty: {o.quantity} | Status: {o.status}</p>
              <p className="text-xs text-slate-500">Buyer: {o.buyerId?.name} ({o.buyerId?.phone})</p>
            </div>
            <div className="flex gap-2">
              <button
                className="px-2 py-1 bg-amber-500 text-white rounded disabled:opacity-50"
                disabled={orderActionLoading[o._id] || o.status === "accepted" || o.status === "delivered"}
                onClick={() => updateOrderStatus(o._id, "accepted")}
              >
                {orderActionLoading[o._id] ? "Updating..." : "Accept"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageCard>
  );
}
