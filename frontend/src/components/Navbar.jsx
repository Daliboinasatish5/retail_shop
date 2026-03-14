import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../services/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <Link to="/" className="font-bold text-lg text-indigo-600">
        RetailShop
      </Link>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-slate-600">
              {user.name} ({user.role})
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-slate-800 text-white rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-slate-700">
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm px-3 py-1 bg-indigo-600 text-white rounded"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
