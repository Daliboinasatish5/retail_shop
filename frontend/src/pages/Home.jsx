import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .home-root {
          --black:    #050e07;
          --black2:   #0a140c;
          --surface:  #0f1f12;
          --surface2: #152018;
          --card:     #172219;
          --card2:    #1d2e20;
          --border:   rgba(52,211,153,0.12);
          --border2:  rgba(52,211,153,0.22);
          --green:    #34d399;
          --green2:   #10b981;
          --green3:   #059669;
          --green-dim:rgba(52,211,153,0.08);
          --text:     #e6f4ee;
          --text2:    #8fbb9e;
          --text3:    #4a7a5c;
          font-family: 'DM Sans', sans-serif;
          background: var(--black);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero-wrapper {
          position: relative; overflow: hidden;
          min-height: 94vh; display: flex; align-items: center;
          background:
            radial-gradient(ellipse 900px 600px at -10% -5%, rgba(16,185,129,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 700px 500px at 110% 10%, rgba(5,150,105,0.1) 0%, transparent 55%),
            linear-gradient(180deg, #050e07 0%, #0a140c 100%);
        }
        .hero-grid {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        .orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px); animation: orbFloat 10s ease-in-out infinite; }
        .orb1 { width:500px;height:500px;top:-150px;right:-100px;background:radial-gradient(circle,rgba(16,185,129,0.14),transparent 70%);animation-delay:0s; }
        .orb2 { width:400px;height:400px;bottom:-100px;left:-80px;background:radial-gradient(circle,rgba(5,150,105,0.1),transparent 70%);animation-delay:-4s; }
        .orb3 { width:300px;height:300px;top:50%;left:45%;background:radial-gradient(circle,rgba(52,211,153,0.08),transparent 70%);animation-delay:-7s; }
        @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1);} 40%{transform:translate(24px,-18px) scale(1.06);} 70%{transform:translate(-14px,12px) scale(0.96);} }

        .leaf-deco { position: absolute; pointer-events: none; opacity: 0.06; }
        .hero { position:relative;z-index:2;max-width:1100px;margin:0 auto;padding:88px 2.5rem 72px;display:grid;grid-template-columns:1.1fr 0.9fr;gap:3.5rem;align-items:center;width:100%; }
        .hero-eyebrow { display:inline-flex;align-items:center;gap:8px;font-size:0.7rem;font-weight:500;color:var(--green);text-transform:uppercase;letter-spacing:0.14em;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);padding:5px 14px;border-radius:100px;margin-bottom:1.5rem;animation:fadeUp 0.7s 0.1s ease both; }
        .eyebrow-dot { width:5px;height:5px;border-radius:50%;background:var(--green);animation:blink 2s infinite; }
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        .hero-title { font-family:'Playfair Display',serif;font-size:clamp(2.5rem,4.2vw,3.8rem);font-weight:700;line-height:1.12;letter-spacing:-0.035em;color:#e6f4ee;margin-bottom:1.4rem;animation:fadeUp 0.7s 0.2s ease both; }
        .hero-title em { font-style:italic;background:linear-gradient(135deg,#34d399,#10b981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .hero-sub { font-size:1rem;color:var(--text2);line-height:1.8;font-weight:300;max-width:460px;animation:fadeUp 0.7s 0.3s ease both; }
        .hero-cta { display:flex;gap:1rem;margin-top:2rem;flex-wrap:wrap;animation:fadeUp 0.7s 0.4s ease both; }
        .cta-primary { padding:13px 30px;background:var(--green);color:var(--black);border-radius:10px;font-size:0.92rem;font-weight:600;text-decoration:none;box-shadow:0 6px 24px rgba(52,211,153,0.3);transition:transform 0.2s,box-shadow 0.2s,background 0.2s; }
        .cta-primary:hover{transform:translateY(-2px);background:#5edfac;box-shadow:0 10px 32px rgba(52,211,153,0.45);}
        .cta-outline { padding:12px 30px;border:1.5px solid rgba(52,211,153,0.3);color:var(--green);border-radius:10px;font-size:0.92rem;font-weight:400;text-decoration:none;background:rgba(52,211,153,0.04);transition:border-color 0.2s,background 0.2s,transform 0.2s; }
        .cta-outline:hover{border-color:rgba(52,211,153,0.55);background:rgba(52,211,153,0.1);transform:translateY(-1px);}
        .hero-stats { display:flex;gap:2rem;margin-top:2.5rem;animation:fadeUp 0.7s 0.5s ease both; }
        .stat-item{display:flex;flex-direction:column;gap:2px;}
        .stat-num{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:var(--green);letter-spacing:-0.03em;}
        .stat-label{font-size:0.72rem;color:var(--text3);text-transform:uppercase;letter-spacing:0.1em;}
        .stat-sep{width:1px;background:var(--border);align-self:stretch;margin:4px 0;}
        .hero-visual{animation:fadeUp 0.7s 0.5s ease both;position:relative;}
        .float-badge{position:absolute;top:-18px;right:-16px;z-index:3;background:var(--card2);border:1px solid var(--border2);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);animation:floatBadge 4s ease-in-out infinite;}
        @keyframes floatBadge{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .badge-led{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);}
        .badge-text p:first-child{font-size:0.8rem;font-weight:500;color:var(--text);}
        .badge-text p:last-child{font-size:0.7rem;color:var(--green);}
        .hero-img-wrap{position:relative;border-radius:22px;overflow:hidden;border:1px solid var(--border2);box-shadow:0 24px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(52,211,153,0.08);}
        .hero-img-wrap img{width:100%;height:320px;object-fit:cover;display:block;filter:brightness(0.8) saturate(0.9);}
        .hero-img-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(5,14,7,0.7) 0%,transparent 50%);}
        .hero-img-caption{position:absolute;bottom:20px;left:20px;right:20px;background:rgba(10,20,12,0.88);backdrop-filter:blur(12px);border-radius:12px;padding:14px 16px;border:1px solid var(--border2);display:flex;align-items:center;gap:12px;}
        .caption-icon{width:38px;height:38px;border-radius:9px;background:var(--green3);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}
        .caption-text p:first-child{font-size:0.84rem;font-weight:500;color:var(--text);}
        .caption-text p:last-child{font-size:0.73rem;color:var(--text2);margin-top:1px;}

        /* ── ABOUT ── */
        .about-bg{background:radial-gradient(ellipse 800px 400px at 50% 0%,rgba(16,185,129,0.07) 0%,transparent 65%),#0f1f12;}
        .about-inner{max-width:1100px;margin:0 auto;padding:80px 2.5rem;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;}
        .about-img-wrap{border-radius:20px;overflow:hidden;border:1px solid var(--border2);box-shadow:0 20px 60px rgba(0,0,0,0.5);}
        .about-img-wrap img{width:100%;height:280px;object-fit:cover;display:block;filter:brightness(0.75) saturate(0.85);}
        .section-tag{font-size:0.7rem;text-transform:uppercase;letter-spacing:0.14em;color:var(--green);font-weight:500;margin-bottom:0.6rem;}
        .section-title{font-family:'Playfair Display',serif;font-size:clamp(1.65rem,2.8vw,2.2rem);font-weight:700;color:var(--text);letter-spacing:-0.025em;margin-bottom:1.5rem;}
        .about-text{font-size:1rem;color:var(--text2);line-height:1.85;font-weight:300;}
        .about-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:1.5rem;}
        .pill{font-size:0.76rem;padding:5px 14px;border-radius:100px;background:rgba(52,211,153,0.08);color:var(--green);border:1px solid rgba(52,211,153,0.18);font-weight:400;}

        /* ── FEATURES ── */
        .features-bg{background:var(--black2);}
        .section{max-width:1100px;margin:0 auto;padding:80px 2.5rem;}
        .feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
        .feature-card{background:var(--card);border-radius:18px;border:1px solid var(--border);padding:0 0 1.75rem;transition:transform 0.25s,border-color 0.25s,box-shadow 0.25s;position:relative;overflow:hidden;cursor:pointer;}
        .feature-card-bar{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--green3),var(--green));transform:scaleX(0);transform-origin:left;transition:transform 0.4s cubic-bezier(.4,0,.2,1);}
        .feature-card:hover{transform:translateY(-5px);border-color:rgba(52,211,153,0.3);box-shadow:0 16px 48px rgba(0,0,0,0.5),0 0 0 1px rgba(52,211,153,0.1);}
        .feature-card:hover .feature-card-bar{transform:scaleX(1);}
        .feature-img{width:100%;height:148px;object-fit:cover;display:block;filter:brightness(0.7) saturate(0.75);}
        .feature-body{padding:1.25rem 1.5rem 0;}
        .feature-icon-box{width:42px;height:42px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.18);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;margin-bottom:1rem;}
        .feature-card h3{font-size:0.96rem;font-weight:500;color:var(--text);margin-bottom:0.45rem;}
        .feature-card p{font-size:0.84rem;color:var(--text2);line-height:1.65;font-weight:300;}

        /* ── BENEFITS ── */
        .benefits-bg{background:linear-gradient(160deg,#060f08 0%,#091508 40%,#050e07 100%);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
        .benefits-inner{max-width:1100px;margin:0 auto;padding:80px 2.5rem;}
        .benefits-title{font-family:'Playfair Display',serif;font-size:clamp(1.65rem,2.8vw,2.2rem);font-weight:700;color:var(--text);letter-spacing:-0.025em;margin-bottom:0.6rem;}
        .benefits-sub{font-size:1rem;color:var(--text3);font-weight:300;margin-bottom:2.5rem;line-height:1.7;}
        .benefits-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;}
        .benefit-card{background:rgba(255,255,255,0.03);border-radius:18px;border:1px solid var(--border);padding:2rem;transition:background 0.2s,transform 0.2s,border-color 0.2s;display:flex;gap:1.4rem;align-items:flex-start;}
        .benefit-card:hover{background:rgba(52,211,153,0.05);transform:translateY(-3px);border-color:var(--border2);}
        .benefit-num{font-family:'Playfair Display',serif;font-size:2.6rem;font-weight:700;color:rgba(52,211,153,0.15);line-height:1;flex-shrink:0;}
        .benefit-card h3{font-size:0.96rem;font-weight:500;color:var(--text);margin-bottom:0.4rem;}
        .benefit-card p{font-size:0.84rem;color:var(--text2);line-height:1.65;font-weight:300;}

        /* ── FOOTER ── */
        .footer{background:var(--black);border-top:1px solid var(--border);}
        .footer-inner{max-width:1100px;margin:0 auto;padding:1.8rem 2.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;}
        .footer-logo{font-family:'Playfair Display',serif;font-weight:700;font-size:1.1rem;color:var(--green);display:flex;align-items:center;gap:8px;}
        .footer-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);}
        .footer-copy{font-size:0.78rem;color:var(--text3);}
        .footer-links{display:flex;gap:1.75rem;}
        .footer-link{font-size:0.8rem;color:var(--text3);text-decoration:none;transition:color 0.2s;}
        .footer-link:hover{color:var(--green);}
        .divider-line{max-width:1100px;margin:0 auto;padding:0 2.5rem;}
        .divider-line hr{border:none;border-top:1px solid var(--border);}

        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1);}40%{transform:translate(24px,-18px) scale(1.06);}70%{transform:translate(-14px,12px) scale(0.96);}}

        @media(max-width:900px){
          .hero,.about-inner{grid-template-columns:1fr;padding:52px 1.5rem;}
          .feature-grid,.benefits-grid{grid-template-columns:1fr;}
          .hero-stats{gap:1.25rem;}
          .float-badge{display:none;}
        }
      `}</style>

      <div className="home-root">

        {/* HERO */}
        <div className="hero-wrapper">
          <div className="hero-grid"></div>
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
          <div className="orb orb3"></div>
          <svg className="leaf-deco" style={{top:'8%',left:'2%',width:'110px',transform:'rotate(-15deg)'}} viewBox="0 0 110 130" fill="none">
            <path d="M55 8 Q88 40 76 88 Q46 108 18 76 Q8 42 55 8Z" fill="#34d399"/>
            <path d="M55 8 Q55 55 55 108" stroke="#10b981" strokeWidth="1.5" fill="none"/>
          </svg>
          <svg className="leaf-deco" style={{bottom:'12%',right:'3%',width:'80px',transform:'rotate(145deg)'}} viewBox="0 0 110 130" fill="none">
            <path d="M55 8 Q88 40 76 88 Q46 108 18 76 Q8 42 55 8Z" fill="#10b981"/>
            <path d="M55 8 Q55 55 55 108" stroke="#059669" strokeWidth="1.5" fill="none"/>
          </svg>

          <div className="hero">
            <div>
              <div className="hero-eyebrow">
                <span className="eyebrow-dot"></span>
                Retail Supply Chain Platform
              </div>
              <h1 className="hero-title">
                Smarter Supply for<br/>
                <em>Wholesalers, Shops</em><br/>
                and Customers
              </h1>
              <p className="hero-sub">
                Manage inventory, place and track orders, and run your complete retail flow in one elegant dashboard built for every stakeholder.
              </p>
              <div className="hero-cta">
                <Link to="/signup" className="cta-primary">Get Started Free</Link>
                <Link to="/login" className="cta-outline">View Demo →</Link>
              </div>
              <div className="hero-stats">
                <div className="stat-item"><span className="stat-num">500+</span><span className="stat-label">Businesses</span></div>
                <div className="stat-sep"></div>
                <div className="stat-item"><span className="stat-num">99.9%</span><span className="stat-label">Uptime</span></div>
                <div className="stat-sep"></div>
                <div className="stat-item"><span className="stat-num">4 Roles</span><span className="stat-label">Supported</span></div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="float-badge">
                <div className="badge-led"></div>
                <div className="badge-text">
                  <p>Order #1042 Shipped</p>
                  <p>Just now · 24 items</p>
                </div>
              </div>
              <div className="hero-img-wrap">
                <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80" alt="Warehouse"/>
                <div className="hero-img-overlay"></div>
                <div className="hero-img-caption">
                  <div className="caption-icon">📦</div>
                  <div className="caption-text">
                    <p>Real-time Inventory Sync</p>
                    <p>Auto-updates across all roles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <section id="about" className="about-bg">
          <div className="about-inner">
            <div><div className="about-img-wrap"><img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80" alt="Retail"/></div></div>
            <div>
              <p className="section-tag">About</p>
              <h2 className="section-title">One Platform.<br/>Every Connection.</h2>
              <p className="about-text">This platform connects wholesale suppliers, shopkeepers, and customers in one digital workflow. It reduces manual coordination by centralizing product catalogs, order handling, delivery status, billing, and communication.</p>
              <div className="about-pills">
                <span className="pill">Wholesale Mgmt</span>
                <span className="pill">Order Tracking</span>
                <span className="pill">Smart Inventory</span>
                <span className="pill">Analytics</span>
                <span className="pill">Multi-role Access</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <div className="divider-line" style={{background:'var(--surface)'}}><hr/></div>
        <div className="features-bg">
          <div className="section">
            <p className="section-tag">Features</p>
            <h2 className="section-title">Built for Every Role</h2>
            <div className="feature-grid">
              {[
                {img:"https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=75",icon:"🔐",title:"Role-Based Access",desc:"Secure login and dedicated dashboards for each stakeholder in the supply chain."},
                {img:"https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&q=75",icon:"📦",title:"Order & Inventory Flow",desc:"Track orders from request to delivery with automatic stock updates along the way."},
                {img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=75",icon:"📊",title:"Realtime Insights",desc:"Get notifications, analytics, and sales visibility the moment things happen."}
              ].map((f,i)=>(
                <div className="feature-card" key={i}>
                  <div className="feature-card-bar"></div>
                  <img src={f.img} className="feature-img" alt={f.title}/>
                  <div className="feature-body">
                    <div className="feature-icon-box">{f.icon}</div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="benefits-bg">
          <div className="benefits-inner">
            <p className="section-tag">Benefits</p>
            <h2 className="benefits-title">Why Teams Love It</h2>
            <p className="benefits-sub">Designed to reduce friction at every step of the supply chain.</p>
            <div className="benefits-grid">
              {[
                ["01","Business Friendly","A clean interface designed for daily retail operations without clutter."],
                ["02","Modern & Fast UI","Dark green theme with focused interactions that help your team move faster."],
                ["03","End-to-End Visibility","Every order, stock movement, and notification tracked in real time."],
                ["04","Scales With You","From single shopkeepers to large wholesale networks — grows with your business."]
              ].map(([n,t,d],i)=>(
                <div className="benefit-card" key={i}>
                  <span className="benefit-num">{n}</span>
                  <div><h3>{t}</h3><p>{d}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-logo"><span className="footer-dot"></span>RetailShop</div>
            <p className="footer-copy">© {new Date().getFullYear()} RetailShop. All rights reserved.</p>
            <div className="footer-links">
              <a href="#about" className="footer-link">About</a>
              <a href="#features" className="footer-link">Features</a>
              <a href="#benefits" className="footer-link">Benefits</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}