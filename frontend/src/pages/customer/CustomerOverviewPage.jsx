import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function CustomerOverviewPage() {
  const { user, shops, products, orders, bill } = useOutletContext();

  return (
    <div className="space-y-4">
      <PageCard title="Profile">
        <p>Name: {user?.name}</p>
        <p>Phone: {user?.phone || "-"}</p>
        <p>Address: {user?.address || "-"}</p>
      </PageCard>

      <div className="grid md:grid-cols-4 gap-4">
        <PageCard title="Nearby Shops">{shops.length}</PageCard>
        <PageCard title="Visible Products">{products.length}</PageCard>
        <PageCard title="Total Orders">{orders.length}</PageCard>
        <PageCard title="Last Payment">{bill?.paymentStatus || "-"}</PageCard>
      </div>
    </div>
  );
}
