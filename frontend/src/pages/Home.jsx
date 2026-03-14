import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-slate-900">Retail Supply Chain Platform</h1>
      <p className="mt-3 text-slate-600">
        Admin, wholesaler, shopkeeper, and customer dashboards with JWT auth and inventory flow.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded">
          Get Started
        </Link>
        <Link to="/login" className="px-4 py-2 border rounded text-slate-700">
          Login
        </Link>
      </div>
    </div>
  );
}
