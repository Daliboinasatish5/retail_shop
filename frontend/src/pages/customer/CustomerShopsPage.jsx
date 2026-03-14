import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function CustomerShopsPage() {
  const { shops, selectedShop, selectShop } = useOutletContext();

  return (
    <PageCard title="Nearby Shops">
      <div className="flex flex-wrap gap-2">
        {shops.map((shop) => (
          <button
            key={shop._id}
            className={`px-3 py-2 rounded border ${selectedShop === shop._id ? "bg-indigo-600 text-white" : "bg-white"}`}
            onClick={() => selectShop(shop._id)}
          >
            {shop.name}
          </button>
        ))}
      </div>
    </PageCard>
  );
}
