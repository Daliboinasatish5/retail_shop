import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../services/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const logout = () => { clearAuth(); navigate("/login"); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .navbar {
          position: sticky; top: 0; z-index: 200;
          height: 66px; padding: 0 2.5rem;
          display: flex; align-items: center; justify-content: space-between;
          font-family: 'DM Sans', sans-serif;
          background: rgba(5, 14, 7, 0.82);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-bottom: 1px solid rgba(52, 211, 153, 0.12);
          box-shadow: 0 1px 0 rgba(52,211,153,0.06), 0 8px 32px rgba(0,0,0,0.4);
          animation: navIn 0.5s ease both;
        }
        @keyframes navIn {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 1.35rem;
          color: #34d399; text-decoration: none;
          letter-spacing: -0.03em;
          display: flex; align-items: center; gap: 10px;
        }
        .logo-icon {
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg, #0f2e18, #1a4a28);
          border: 1px solid rgba(52,211,153,0.22);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          box-shadow: 0 0 16px rgba(52,211,153,0.2);
        }
        .nav-links { display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0; }
        .nav-link {
          font-size: 0.875rem; color: #8fbb9e;
          text-decoration: none; position: relative; padding-bottom: 2px;
          transition: color 0.2s; font-weight: 400;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1.5px; background: #34d399;
          border-radius: 2px; transition: width 0.3s cubic-bezier(.4,0,.2,1);
        }
        .nav-link:hover { color: #34d399; }
        .nav-link:hover::after { width: 100%; }
        .nav-actions { display: flex; gap: 0.75rem; align-items: center; }
        .nav-user-badge {
          font-size: 0.8rem; font-weight: 500; color: #34d399;
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.2);
          padding: 5px 14px; border-radius: 100px;
        }
        .btn-login {
          font-size: 0.875rem; color: #8fbb9e; text-decoration: none;
          padding: 7px 14px; border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          font-family: 'DM Sans', sans-serif; background: none; border: none; cursor: pointer;
        }
        .btn-login:hover { color: #34d399; background: rgba(52,211,153,0.08); }
        .btn-signup {
          font-size: 0.84rem; font-weight: 500;
          color: #050e07; background: #34d399;
          padding: 9px 20px; border-radius: 9px; text-decoration: none;
          box-shadow: 0 4px 18px rgba(52,211,153,0.25);
          transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
          border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .btn-signup:hover { transform: translateY(-1px); background: #5edfac; box-shadow: 0 6px 24px rgba(52,211,153,0.38); }
        @media (max-width: 768px) {
          .navbar { padding: 0 1.25rem; }
          .nav-links { display: none; }
        }
      `}</style>

      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">🌿</div>
          RetailShop
        </Link>

        {!user && (
          <ul className="nav-links">
            <li><a href={location.pathname === "/" ? "#about" : "/#about"} className="nav-link">About</a></li>
            <li><a href={location.pathname === "/" ? "#features" : "/#features"} className="nav-link">Features</a></li>
            <li><a href={location.pathname === "/" ? "#benefits" : "/#benefits"} className="nav-link">Benefits</a></li>
          </ul>
        )}

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user-badge">{user.name} · {user.role}</span>
              <button onClick={logout} className="btn-signup">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/signup" className="btn-signup">Get Started</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}