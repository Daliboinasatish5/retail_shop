import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function WholesalerNotificationsPage() {
  const { notifications } = useOutletContext();

  return (
    <PageCard title="Live Notifications">
      <div className="space-y-2 text-sm">
        {notifications.map((n) => (
          <div key={n._id} className="border rounded p-2">
            <p>{n.message}</p>
            <p className="text-xs text-slate-500">{n.type}</p>
          </div>
        ))}
      </div>
    </PageCard>
  );
}
