import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function CustomerProductsPage() {
  const {
    selectedShop,
    products,
    quantity,
    setQuantity,
    bill,
    bulkMessage,
    buy,
    requestBulkOrder,
  } = useOutletContext();

  return (
    <div className="space-y-4">
      <PageCard title="Shop Products">
        {!selectedShop && (
          <p className="mb-3 text-sm text-amber-700">Please select a shop first in the Shops tab.</p>
        )}
        {bulkMessage && <p className="mb-3 rounded bg-slate-100 px-3 py-2 text-sm text-slate-700">{bulkMessage}</p>}
        <div className="grid md:grid-cols-2 gap-2">
          {products.map((item) => {
            const qty = Number(quantity[item.productId?._id] || 1);
            const subtotal = qty * Number(item.price || 0);
            return (
              <div key={item._id} className="border rounded p-2">
                <p className="font-medium">{item.productId?.name}</p>
                <p className="text-sm">{item.productId?.category}</p>
                <p className="text-sm">Available: {item.quantity} | ₹{item.price}</p>
                <p className="text-xs text-slate-500">Selected Qty Total: ₹{subtotal}</p>
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    min="1"
                    className="border rounded px-2 py-1 w-20"
                    value={quantity[item.productId?._id] || 1}
                    onChange={(e) => setQuantity({ ...quantity, [item.productId?._id]: e.target.value })}
                  />
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                    disabled={!selectedShop}
                    onClick={() => buy(item.productId?._id)}
                  >
                    Order
                  </button>
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                    disabled={!selectedShop}
                    onClick={() => buy(item.productId?._id)}
                  >
                    Pay & Buy
                  </button>
                  <button
                    className="px-3 py-1 bg-amber-500 text-white rounded disabled:opacity-50"
                    disabled={!selectedShop}
                    onClick={() => requestBulkOrder(item.productId?._id)}
                  >
                    Bulk Request
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </PageCard>

      {bill && (
        <PageCard title="Bill + Payment">
          {bill.lines.map((line, idx) => (
            <p key={idx}>
              Product: {line.productId} | Qty: {line.quantity} | Price: ₹{line.unitPrice} | Total: ₹{line.lineTotal}
            </p>
          ))}
          <p className="font-semibold mt-2">Grand Total: ₹{bill.total}</p>
          <p className="text-sm text-green-700 mt-1">Payment Status: {bill.paymentStatus || "Paid"}</p>
        </PageCard>
      )}
    </div>
  );
}
