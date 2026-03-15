import { useOutletContext } from "react-router-dom";

export default function ShopkeeperKathabookPage() {
  const { kathabookEntries } = useOutletContext();

  return (
    <div className="sk-page">
      <div className="sk-card">
        <div className="sk-card-head">Kathabook Entries from Customers</div>
        <div className="sk-card-body">
          <div className="space-y-2">
            {kathabookEntries.length === 0 ? (
              <p className="text-sm sk-muted">No Kathabook entries yet.</p>
            ) : (
              kathabookEntries.map((entry) => (
                <div key={entry._id} className="sk-row-card">
                  <p className="font-medium sk-text">{entry.productId?.name}</p>
                  <p className="text-sm sk-text">
                    Qty: {entry.quantity} | Unit: ₹{entry.unitPrice} | Total: ₹{entry.totalPrice}
                  </p>
                  <p className="text-xs sk-muted">Customer: {entry.customerId?.name}</p>
                  <p className="text-xs sk-muted">Phone: {entry.customerId?.phone || "-"}</p>
                  <p className="text-xs sk-muted">Address: {entry.customerId?.address || "Not available"}</p>
                  <p className="text-xs mt-1" style={{ color: "#34d399" }}>
                    Status: {entry.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
