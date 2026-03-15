import { useOutletContext } from "react-router-dom";

export default function ShopkeeperInventoryPage() {
  const { inventory } = useOutletContext();

  return (
    <div className="sk-page">
      <div className="sk-card">
        <div className="sk-card-head">Inventory + Low Stock Alerts</div>
        <div className="sk-card-body">
      <div className="grid md:grid-cols-2 gap-2">
        {inventory.map((item) => (
          <div key={item._id} className="sk-row-card">
            <p className="font-medium sk-text">{item.productId?.name}</p>
            <p className="text-sm sk-text">Qty: {item.quantity} | Price: ₹{item.price}</p>
            {item.quantity < 5 && <p className="text-xs text-red-600">Low stock alert</p>}
          </div>
        ))}
      </div>
        </div>
      </div>
    </div>
  );
}
