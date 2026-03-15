import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function CustomerProductsPage() {
  const {
    selectedShop,
    products,
    quantity,
    setQuantity,
    bill,
    bulkMessage,
    kathabookMessage,
    buy,
    requestBulkOrder,
    addToKathabook,
  } = useOutletContext();
  const [selectedProductId, setSelectedProductId] = useState("");

  return (
    <div className="space-y-4">
      <div className="cu-card">
        <div className="cu-card-head">Shop Products</div>
        <div className="cu-card-body">
          {!selectedShop && (
            <p className="mb-3 text-sm" style={{ color: "#eab308" }}>Please select a shop first in the Shops tab.</p>
          )}
          {bulkMessage && <p className="mb-3 cu-soft text-sm cu-text">{bulkMessage}</p>}
          {kathabookMessage && <p className="mb-3 cu-soft text-sm cu-text">{kathabookMessage}</p>}
          <div className="cu-grid-2">
            {products.map((item) => {
              const qty = Number(quantity[item.productId?._id] || 1);
              const subtotal = qty * Number(item.price || 0);
              const currentProductId = item.productId?._id;
              const isSelected = selectedProductId === currentProductId;

              return (
                <div
                  key={item._id}
                  className="cu-row-card"
                  style={isSelected ? { borderColor: "rgba(52,211,153,0.35)" } : undefined}
                  onClick={() => setSelectedProductId((prev) => (prev === currentProductId ? "" : currentProductId))}
                >
                  <p className="font-medium cu-text">{item.productId?.name}</p>
                  <p className="text-sm cu-text">{item.productId?.category}</p>
                  <p className="text-sm cu-text">Available: {item.quantity} | ₹{item.price}</p>
                  <p className="text-xs cu-muted">Selected Qty Total: ₹{subtotal}</p>

                  {isSelected && (
                    <div className="flex gap-2 mt-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="number"
                        min="1"
                        className="cu-input"
                        style={{ width: "90px" }}
                        value={quantity[item.productId?._id] || 1}
                        onChange={(e) => setQuantity({ ...quantity, [item.productId?._id]: e.target.value })}
                      />
                      <button
                        className="cu-btn-secondary disabled:opacity-50"
                        disabled={!selectedShop}
                        onClick={() => buy(item.productId?._id)}
                      >
                        Order
                      </button>
                      <button
                        className="cu-btn-primary disabled:opacity-50"
                        disabled={!selectedShop}
                        onClick={() => buy(item.productId?._id)}
                      >
                        Pay & Buy
                      </button>
                      <button
                        className="cu-btn-secondary disabled:opacity-50"
                        disabled={!selectedShop}
                        onClick={() => requestBulkOrder(item.productId?._id)}
                      >
                        Bulk Request
                      </button>
                      <button
                        className="cu-btn-secondary disabled:opacity-50"
                        disabled={!selectedShop}
                        onClick={() => addToKathabook(item.productId?._id)}
                      >
                        Kathabook
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {bill && (
        <div className="cu-card">
          <div className="cu-card-head">Bill + Payment</div>
          <div className="cu-card-body space-y-1">
            {bill.lines.map((line, idx) => (
              <p key={idx} className="cu-text">
                Product: {line.productId} | Qty: {line.quantity} | Price: ₹{line.unitPrice} | Total: ₹{line.lineTotal}
              </p>
            ))}
            <p className="font-semibold mt-2 cu-text">Grand Total: ₹{bill.total}</p>
            <p className="text-sm mt-1" style={{ color: "#34d399" }}>Payment Status: {bill.paymentStatus || "Paid"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
