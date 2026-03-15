import { useNavigate, useOutletContext } from "react-router-dom";

export default function CustomerShopsPage() {
  const navigate = useNavigate();
  const { shops, selectedShop, selectShop } = useOutletContext();

  return (
    <div className="cu-card">
      <div className="cu-card-head">Nearby Shops</div>
      <div className="cu-card-body">
        <div className="flex flex-wrap gap-2">
          {shops.map((shop) => (
            <button
              key={shop._id}
              className={`cu-btn-secondary ${selectedShop === shop._id ? "cu-btn-active" : ""}`}
              onClick={async () => {
                await selectShop(shop._id);
                navigate("/dashboard/customer/products");
              }}
            >
              {shop.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
