import { useOutletContext, useNavigate } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function ShopkeeperOverviewPage() {
  const { products, wholesalers, inventory, orders, notifications, setSelectedWholesalerId } = useOutletContext();
  const navigate = useNavigate();

  const openWholesalerProducts = (wholesalerId) => {
    setSelectedWholesalerId(wholesalerId);
    navigate("/dashboard/shopkeeper/products");
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-5 gap-4">
        <PageCard title="Wholesalers">{wholesalers.length}</PageCard>
        <PageCard title="Wholesaler Products">{products.length}</PageCard>
        <PageCard title="My Inventory">{inventory.length}</PageCard>
        <PageCard title="Orders">{orders.length}</PageCard>
        <PageCard title="Notifications">{notifications.length}</PageCard>
      </div>

      <PageCard title="All Wholesalers">
        {wholesalers.length === 0 ? (
          <p className="text-sm text-slate-500">No wholesalers found.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {wholesalers.map((wholesaler) => (
              <button
                key={wholesaler._id}
                type="button"
                onClick={() => openWholesalerProducts(wholesaler._id)}
                className="rounded-xl border p-3 text-left hover:border-indigo-400 hover:bg-indigo-50"
              >
                <p className="font-semibold text-slate-900">{wholesaler.name}</p>
                <p className="text-sm text-slate-600">{wholesaler.email || "-"}</p>
                <p className="text-sm text-slate-600">{wholesaler.phone || "-"}</p>
                <p className="text-sm text-slate-600">Location: {wholesaler.address || "Not available"}</p>
                <p className="mt-1 text-xs text-indigo-700">Click to view products & order</p>
              </button>
            ))}
          </div>
        )}
      </PageCard>
    </div>
  );
}
