import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function WholesalerOverviewPage() {
  const { summary, products, orders, shopkeepers, notifications } = useOutletContext();

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-4">
        <PageCard title="Total Products">{products.length}</PageCard>
        <PageCard title="Total Orders">{orders.length}</PageCard>
        <PageCard title="Shopkeepers">{shopkeepers.length}</PageCard>
        <PageCard title="Notifications">{notifications.length}</PageCard>
      </div>

      <PageCard title="Analytics Summary">
        <p>Total quantity sold: {summary.totalSold.quantitySold}</p>
        <p>Total revenue: ₹{summary.totalSold.revenue}</p>
        <h4 className="font-semibold mt-3">Top shopkeepers</h4>
        <ul className="text-sm list-disc ml-4">
          {summary.topShopkeepers.map((entry) => (
            <li key={entry._id}>Shopkeeper {entry._id} — ₹{entry.amount}</li>
          ))}
        </ul>
      </PageCard>

      <PageCard title="Added Products">
        {products.length === 0 ? (
          <p className="text-sm text-slate-500">No products added yet.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{product.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                    ₹{product.price}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-600">Available Quantity</span>
                  <span className="font-semibold text-slate-900">{product.quantity}</span>
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  {product.description || "No description added."}
                </p>
              </div>
            ))}
          </div>
        )}
      </PageCard>
    </div>
  );
}
