import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { saveAuth } from "../services/auth";

const roles = [
  { value: "admin",       label: "👑 Admin" },
  { value: "wholesaler",  label: "🏭 Wholesaler" },
  { value: "shopkeeper",  label: "🏪 Shopkeeper" },
  { value: "customer",    label: "🛒 Customer" },
];

export default function Signup() {
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"shopkeeper", phone:"", address:"" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/signup", form);
      saveAuth(data.token, data.user);
      navigate(`/dashboard/${data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .auth-page {
          min-height: 100vh; display: flex;
          font-family: 'DM Sans', sans-serif; background: #050e07;
        }
        .auth-image-panel {
          flex: 1; position: relative; overflow: hidden;
          display: flex; flex-direction: column; justify-content: flex-end;
        }
        .auth-image-panel img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; filter: brightness(0.45) saturate(0.7);
        }
        .img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(5,14,7,0.7) 0%, rgba(10,30,15,0.4) 50%, rgba(5,14,7,0.85) 100%);
        }
        .img-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px);
          background-size: 56px 56px;
        }
        .img-logo { position: absolute; top: 2.5rem; left: 2.5rem; display: flex; align-items: center; gap: 10px; z-index: 2; }
        .img-logo-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg,#0f2e18,#1a4a28);
          border: 1px solid rgba(52,211,153,0.3);
          display: flex; align-items: center; justify-content: center; font-size: 15px;
          box-shadow: 0 0 20px rgba(52,211,153,0.2);
        }
        .img-logo-text { font-family:'Playfair Display',serif; font-size:1.25rem; font-weight:700; color:#34d399; letter-spacing:-0.02em; }
        .img-quote {
          position: relative; z-index: 2; padding: 2.5rem;
          background: linear-gradient(to top, rgba(5,14,7,0.95) 0%, transparent 100%);
        }
        .img-badges { display: flex; gap: 8px; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .img-badge { display:flex;align-items:center;gap:6px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2);border-radius:100px;padding:5px 12px;font-size:0.76rem;color:#34d399; }
        .img-quote-text { font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:600;font-style:italic;color:#e6f4ee;line-height:1.4;margin-bottom:1rem; }
        .img-stats { display:flex;gap:2rem; }
        .img-stat-num { font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#34d399;display:block; }
        .img-stat-label { font-size:0.72rem;color:#4a7a5c;text-transform:uppercase;letter-spacing:0.1em; }

        .auth-form-panel {
          width: 480px; flex-shrink: 0; background: #050e07;
          display: flex; flex-direction: column; justify-content: center;
          padding: 2.5rem 2.5rem; overflow-y: auto; position: relative;
        }
        .auth-form-panel::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 400px 400px at 100% 0%, rgba(16,185,129,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 300px 300px at 0% 100%, rgba(5,150,105,0.06) 0%, transparent 55%);
          pointer-events: none;
        }
        .form-inner { position:relative;z-index:1;max-width:380px;margin:0 auto;width:100%;animation:cardIn 0.6s ease both; }
        @keyframes cardIn { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }

        .form-heading { font-family:'Playfair Display',serif;font-size:1.75rem;font-weight:700;color:#e6f4ee;letter-spacing:-0.03em;margin-bottom:0.4rem; }
        .form-sub { font-size:0.875rem;color:#4a7a5c;font-weight:300;margin-bottom:1.75rem;line-height:1.5; }

        .auth-form { display:flex;flex-direction:column;gap:0.9rem; }
        .field-group { display:flex;flex-direction:column; }
        .field-row { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
        .field-label { display:block;font-size:0.7rem;font-weight:500;color:#8fbb9e;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px; }
        .auth-input {
          width:100%;background:rgba(255,255,255,0.04);
          border:1px solid rgba(52,211,153,0.14);border-radius:10px;
          padding:11px 14px;font-size:0.9rem;font-weight:300;
          color:#e6f4ee;font-family:'DM Sans',sans-serif;outline:none;
          transition:border-color 0.2s,background 0.2s,box-shadow 0.2s;
        }
        .auth-input::placeholder { color:#3d6b4e; }
        .auth-input:focus { border-color:rgba(52,211,153,0.45);background:rgba(52,211,153,0.05);box-shadow:0 0 0 3px rgba(52,211,153,0.08); }

        .role-grid { display:grid;grid-template-columns:1fr 1fr;gap:8px; }
        .role-option { display:none; }
        .role-label {
          display:flex;align-items:center;justify-content:center;gap:6px;
          padding:9px 8px;background:rgba(255,255,255,0.03);
          border:1px solid rgba(52,211,153,0.12);border-radius:9px;
          font-size:0.8rem;color:#8fbb9e;cursor:pointer;
          transition:background 0.2s,border-color 0.2s,color 0.2s;user-select:none;
        }
        .role-option:checked + .role-label { background:rgba(52,211,153,0.12);border-color:rgba(52,211,153,0.4);color:#34d399; }
        .role-label:hover { border-color:rgba(52,211,153,0.28);color:#a7f3d0; }

        .auth-error { font-size:0.82rem;color:#f87171;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.18);border-radius:8px;padding:8px 12px; }
        .auth-btn {
          width:100%;padding:13px;background:#34d399;color:#050e07;
          border:none;border-radius:10px;font-size:0.92rem;font-weight:600;
          font-family:'DM Sans',sans-serif;cursor:pointer;letter-spacing:0.02em;
          box-shadow:0 6px 24px rgba(52,211,153,0.3);
          transition:transform 0.15s,box-shadow 0.15s,background 0.15s;margin-top:4px;
        }
        .auth-btn:hover { transform:translateY(-2px);background:#5edfac;box-shadow:0 10px 32px rgba(52,211,153,0.45); }
        .auth-btn:active { transform:translateY(0); }

        .auth-divider { display:flex;align-items:center;gap:12px;margin:1rem 0; }
        .auth-divider::before,.auth-divider::after { content:'';flex:1;height:1px;background:rgba(52,211,153,0.1); }
        .auth-divider span { font-size:0.73rem;color:#3d6b4e;white-space:nowrap; }
        .auth-btn-outline {
          width:100%;padding:12px;background:transparent;
          border:1.5px solid rgba(52,211,153,0.25);border-radius:10px;
          font-size:0.9rem;font-weight:500;color:#34d399;
          font-family:'DM Sans',sans-serif;cursor:pointer;
          text-decoration:none;display:block;text-align:center;
          transition:background 0.2s,border-color 0.2s,transform 0.15s;
        }
        .auth-btn-outline:hover { background:rgba(52,211,153,0.08);border-color:rgba(52,211,153,0.45);transform:translateY(-1px); }

        /* ── RESPONSIVE ── */
        @media (max-width: 820px) {
          .auth-page { flex-direction: column; }
          .auth-image-panel { height: 280px; flex: none; width: 100%; }
          .img-quote { padding: 1.5rem; }
          .img-quote-text { font-size: 1.1rem; }
          .img-stats { gap: 1.5rem; }
          .img-logo { top: 1.5rem; left: 1.5rem; }
          .auth-form-panel { width: 100%; padding: 2rem 1.5rem; }
          .form-inner { max-width: 100%; }
        }
        @media (max-width: 480px) {
          .auth-image-panel { height: 220px; }
          .img-quote { padding: 1.25rem; }
          .img-quote-text { font-size: 1rem; }
          .img-badge-hide { display: none; }
          .auth-form-panel { padding: 1.5rem 1.25rem; }
          .form-heading { font-size: 1.45rem; }
          .field-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="auth-page">
        {/* LEFT IMAGE */}
        <div className="auth-image-panel">
          <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80" alt="Retail" />
          <div className="img-overlay"></div>
          <div className="img-grid"></div>
          <div className="img-logo">
            <div className="img-logo-icon">🌿</div>
            <span className="img-logo-text">RetailShop</span>
          </div>
          <div className="img-quote">
            <div className="img-badges">
              <span className="img-badge">✦ Free to Join</span>
              <span className="img-badge img-badge-hide">✦ Instant Access</span>
              <span className="img-badge img-badge-hide">✦ 4 Role Types</span>
            </div>
            <p className="img-quote-text">"Manage your entire retail workflow from one smart dashboard."</p>
            <div className="img-stats">
              <div><span className="img-stat-num">1 min</span><span className="img-stat-label">To Sign Up</span></div>
              <div><span className="img-stat-num">4 Roles</span><span className="img-stat-label">Available</span></div>
              <div><span className="img-stat-num">Free</span><span className="img-stat-label">To Start</span></div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="auth-form-panel">
          <div className="form-inner">
            <h1 className="form-heading">Create account</h1>
            <p className="form-sub">Join the platform — it only takes a minute</p>
            <form className="auth-form" onSubmit={onSubmit}>
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <input className="auth-input" placeholder="John Doe"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field-group">
                <label className="field-label">Email</label>
                <input className="auth-input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field-group">
                <label className="field-label">Password</label>
                <input className="auth-input" type="password" placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="field-group">
                <label className="field-label">Select Role</label>
                <div className="role-grid">
                  {roles.map((r) => (
                    <label key={r.value} style={{ display: "contents" }}>
                      <input type="radio" name="role" value={r.value} className="role-option"
                        checked={form.role === r.value}
                        onChange={(e) => setForm({ ...form, role: e.target.value })} />
                      <span className="role-label">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">Phone</label>
                  <input className="auth-input" placeholder="+91 00000 00000"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="field-group">
                  <label className="field-label">Address</label>
                  <input className="auth-input" placeholder="City, State"
                    value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-btn">Create Account →</button>
              <div className="auth-divider"><span>Already have an account?</span></div>
              <Link to="/login" className="auth-btn-outline">Login Instead</Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}