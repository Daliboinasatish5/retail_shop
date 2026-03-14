import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function WholesalerContactsPage() {
  const { shopkeepers } = useOutletContext();

  return (
    <PageCard title="All Shopkeepers With Location">
      <div className="grid gap-3 md:grid-cols-2">
        {shopkeepers.map((shopkeeper) => (
          <div key={shopkeeper._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900">{shopkeeper.name}</p>
                <p className="mt-1 text-sm text-slate-600">Phone: {shopkeeper.phone || "-"}</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                Shopkeeper
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
              <p className="mt-1 text-sm text-slate-700">{shopkeeper.address || "Location not available"}</p>
            </div>
          </div>
        ))}
      </div>
    </PageCard>
  );
}
