import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function ShopkeeperProductsPage() {
  const {
    products,
    wholesalers,
    selectedCategory,
    setSelectedCategory,
    selectedWholesalerId,
    setSelectedWholesalerId,
    inventory,
    createOrderFromProduct,
  } = useOutletContext();
  const [orderQtyByProduct, setOrderQtyByProduct] = useState({});
  const [orderMessage, setOrderMessage] = useState("");

  const filteredInventory = useMemo(() => {
    if (!selectedCategory) return inventory;
    return inventory.filter((item) => item.productId?.category === selectedCategory);
  }, [inventory, selectedCategory]);

  const selectedWholesalerProducts = useMemo(() => {
    const byWholesaler = selectedWholesalerId
      ? products.filter((product) => String(product.wholesalerId?._id || product.wholesalerId) === String(selectedWholesalerId))
      : products;

    if (!selectedCategory) return byWholesaler;
    return byWholesaler.filter((product) => product.category === selectedCategory);
  }, [products, selectedWholesalerId, selectedCategory]);

  const placeOrder = async (productId) => {
    try {
      setOrderMessage("");
      const qty = Math.max(1, Number(orderQtyByProduct[productId] || 1));
      await createOrderFromProduct(productId, qty);
      setOrderMessage("Order placed successfully");
    } catch (error) {
      setOrderMessage(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="space-y-4">
      <PageCard title="Filter Products by Category">
        <div className="flex flex-wrap gap-2">
          <select
            className="border rounded p-2"
            value={selectedWholesalerId}
            onChange={(e) => setSelectedWholesalerId(e.target.value)}
          >
            <option value="">All Wholesalers</option>
            {wholesalers.map((wholesaler) => (
              <option key={wholesaler._id} value={wholesaler._id}>
                {wholesaler.name}
              </option>
            ))}
          </select>

          <select
            className="border rounded p-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="dairy">Dairy</option>
            <option value="groceries">Groceries</option>
          </select>
        </div>
      </PageCard>

      <PageCard title="Wholesaler Product List (Order From Here)">
        {orderMessage && <p className="mb-2 text-sm text-indigo-700">{orderMessage}</p>}
        <div className="space-y-2 max-h-[24rem] overflow-auto">
          {selectedWholesalerProducts.length === 0 ? (
            <p className="text-sm text-slate-500">No wholesaler products found for selected filters.</p>
          ) : (
            selectedWholesalerProducts.map((product) => (
              <div key={product._id} className="border p-2 rounded">
                {(() => {
                  const qty = Math.max(1, Number(orderQtyByProduct[product._id] || 1));
                  const total = qty * Number(product.price || 0);

                  return (
                    <>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm">
                        {product.category} | Stock: {product.quantity} | Unit Price: ₹{product.price}
                      </p>
                      <p className="text-xs text-slate-500">Wholesaler: {product.wholesalerId?.name}</p>
                      <p className="text-xs text-emerald-700 mt-1">Selected Qty Total: ₹{total}</p>

                      <div className="mt-2 flex gap-2">
                        <input
                          type="number"
                          min="1"
                          className="border rounded px-2 py-1 w-20"
                          value={orderQtyByProduct[product._id] || 1}
                          onChange={(e) =>
                            setOrderQtyByProduct((prev) => ({
                              ...prev,
                              [product._id]: Math.max(1, Number(e.target.value || 1)),
                            }))
                          }
                        />
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => placeOrder(product._id)}>
                          Order
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            ))
          )}
        </div>
      </PageCard>

      <PageCard title="My Products (Delivered Orders Only)">
        <div className="space-y-2 max-h-[28rem] overflow-auto">
          {filteredInventory.length === 0 && (
            <p className="text-sm text-slate-500">
              No products yet. Place an order, wait for wholesaler acceptance, then mark delivered in Activity.
            </p>
          )}

          {filteredInventory.map((item) => (
            <div key={item._id} className="border p-2 rounded">
              <p className="font-medium">{item.productId?.name}</p>
              <p className="text-sm">
                {item.productId?.category} | Qty: {item.quantity} | ₹{item.price}
              </p>
            </div>
          ))}
        </div>
      </PageCard>
    </div>
  );
}
