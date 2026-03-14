import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

export default function AddProductPage() {
  const { form, setForm, addProduct } = useOutletContext();

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";
  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <PageCard title="Add Product">
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white">
        <h2 className="text-lg font-semibold">Create a new wholesale product</h2>
        <p className="mt-1 text-sm text-indigo-100">
          Add stock with category, pricing, quantity, and description.
        </p>
      </div>

      <form className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={addProduct}>
        <div>
          <label className={labelClass}>Product Name</label>
          <input
            className={inputClass}
            placeholder="Enter product name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          >
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="dairy">Dairy</option>
            <option value="groceries">Groceries</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Price</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            placeholder="Enter price"
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
          />
        </div>

        <div>
          <label className={labelClass}>Quantity</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            placeholder="Enter quantity"
            value={form.quantity}
            onChange={(e) => setForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            rows="4"
            className={`${inputClass} resize-none`}
            placeholder="Write a short product description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <div>
            <p className="text-sm font-medium text-slate-800">Ready to publish?</p>
            <p className="text-xs text-slate-500">This product will appear in your inventory after saving.</p>
          </div>
          <button className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg">
            Add Product
          </button>
        </div>
      </form>
    </PageCard>
  );
}
