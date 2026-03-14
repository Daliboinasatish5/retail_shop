import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function ShopkeeperOrderPage() {
  const { products, createMultipleOrders } = useOutletContext();
  const [orderItems, setOrderItems] = useState([{ productId: "", quantity: 1 }]);
  const [orderMessage, setOrderMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productPriceMap = useMemo(
    () =>
      products.reduce((acc, product) => {
        acc[product._id] = Number(product.price || 0);
        return acc;
      }, {}),
    [products]
  );

  const grandTotal = useMemo(
    () =>
      orderItems.reduce((sum, item) => {
        const price = productPriceMap[item.productId] || 0;
        const qty = Math.max(1, Number(item.quantity) || 1);
        return sum + price * qty;
      }, 0),
    [orderItems, productPriceMap]
  );

  const updateItem = (index, field, value) => {
    setOrderItems((prev) =>
      prev.map((item, currentIndex) => {
        if (currentIndex !== index) return item;
        if (field === "quantity") return { ...item, quantity: Math.max(1, Number(value) || 1) };
        return { ...item, [field]: value };
      })
    );
  };

  const addLine = () => {
    setOrderItems((prev) => [...prev, { productId: "", quantity: 1 }]);
  };

  const removeLine = (index) => {
    setOrderItems((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOrderMessage("");
      setIsSubmitting(true);

      const payload = orderItems
        .map((item) => ({
          productId: item.productId,
          quantity: Math.max(1, Number(item.quantity) || 1),
        }))
        .filter((item) => item.productId);

      const result = await createMultipleOrders(payload);

      if (result.failedCount === 0) {
        setOrderMessage(`All ${result.successCount} orders placed successfully`);
      } else {
        const firstError = result.failedMessages[0] || "Some orders failed";
        setOrderMessage(
          `Placed ${result.successCount} order(s), failed ${result.failedCount} order(s). ${firstError}`
        );
      }

      setOrderItems([{ productId: "", quantity: 1 }]);
    } catch (error) {
      setOrderMessage(error.message || "Failed to place orders");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageCard title="Order from Wholesaler">
      <form className="space-y-3" onSubmit={handleSubmit}>
        {orderMessage && <p className="rounded bg-slate-100 px-3 py-2 text-sm text-slate-700">{orderMessage}</p>}

        {orderItems.map((item, index) => {
          const unitPrice = productPriceMap[item.productId] || 0;
          const quantity = Math.max(1, Number(item.quantity) || 1);
          const lineTotal = unitPrice * quantity;

          return (
            <div key={index} className="rounded border p-3 space-y-2">
              <select
                className="w-full border rounded p-2"
                value={item.productId}
                onChange={(e) => updateItem(index, "productId", e.target.value)}
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} ({product.quantity})
                  </option>
                ))}
              </select>

              <input
                className="w-full border rounded p-2"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
              />

              <p className="text-xs text-slate-600">Unit Price: ₹{unitPrice} | Line Total: ₹{lineTotal}</p>

              <button
                type="button"
                onClick={() => removeLine(index)}
                disabled={orderItems.length === 1}
                className="text-xs text-rose-600 disabled:opacity-40"
              >
                Remove line
              </button>
            </div>
          );
        })}

        <button
          type="button"
          className="w-full border border-indigo-200 text-indigo-700 rounded py-2"
          onClick={addLine}
        >
          Add Another Product
        </button>

        <p className="text-sm font-semibold">Grand Total: ₹{grandTotal}</p>

        <button disabled={isSubmitting} className="w-full bg-indigo-600 text-white rounded py-2 disabled:opacity-60">
          {isSubmitting ? "Placing Orders..." : "Place All Orders"}
        </button>
      </form>
    </PageCard>
  );
}
