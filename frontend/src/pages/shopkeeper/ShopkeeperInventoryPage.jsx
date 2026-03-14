import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function ShopkeeperInventoryPage() {
  const { inventory } = useOutletContext();

  return (
    <PageCard title="Inventory + Low Stock Alerts">
      <div className="grid md:grid-cols-2 gap-2">
        {inventory.map((item) => (
          <div key={item._id} className="border rounded p-2">
            <p className="font-medium">{item.productId?.name}</p>
            <p className="text-sm">Qty: {item.quantity} | Price: ₹{item.price}</p>
            {item.quantity < 5 && <p className="text-xs text-red-600">Low stock alert</p>}
          </div>
        ))}
      </div>
    </PageCard>
  );
}
