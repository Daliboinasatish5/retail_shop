export default function PageCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-white/90 p-4 shadow-[0_12px_26px_rgba(2,44,34,0.08)] backdrop-blur-sm">
      <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}
