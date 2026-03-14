import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function ProductInventoryPage() {
  const { products } = useOutletContext();

  return (
    <PageCard title="Product Inventory">
      <div className="grid md:grid-cols-2 gap-2">
        {products.map((p) => (
          <div key={p._id} className="border rounded p-2">
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-slate-600">{p.category}</p>
            <p className="text-sm">Qty: {p.quantity} | ₹{p.price}</p>
            <p className="text-xs text-slate-500">{p.description || "No description"}</p>
          </div>
        ))}
      </div>
    </PageCard>
  );
}
