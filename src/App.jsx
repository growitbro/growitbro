import { useState, useEffect, useRef } from "react";

// ─── SCROLL REVEAL HOOK ────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── REVEAL WRAPPER ────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── SHARED STYLES & CONFIG ────────────────────────────────────────────────
const G = {
  deepGreen: "#1A3D2B",
  midGreen: "#2D6A4F",
  lightGreen: "#52B788",
  paleGreen: "#D8F3DC",
  cream: "#FAFAF7",
  warmCream: "#F2EFE7",
  earth: "#8B5E3C",
  textDark: "#1A1A16",
  textMid: "#444440",
  textLight: "#888880",
};

const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { overflow-x: hidden; }
:root {
  --green-deep: #1A3D2B; --green-mid: #2D6A4F; --green-light: #52B788;
  --green-pale: #D8F3DC; --cream: #FAFAF7; --cream-warm: #F2EFE7;
  --text-dark: #1A1A16; --text-mid: #444440; --text-light: #888880;
}
h1, h2, h3, h4 { font-family: 'Playfair Display', Georgia, serif; }
p, span, li, label, input, textarea, select, button, a { font-family: 'DM Sans', sans-serif; }
.ghover { transition: transform 0.28s ease, box-shadow 0.28s ease; cursor: pointer; }
.ghover:hover { transform: translateY(-4px); box-shadow: 0 20px 52px rgba(26,61,43,0.1); }
.section { padding: 80px 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.tag { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--green-mid); background: var(--green-pale); padding: 5px 14px;
  border-radius: 100px; display: inline-block; margin-bottom: 18px; }
.btn-p { background: var(--green-deep); color: white; border: none; cursor: pointer;
  border-radius: 100px; padding: 13px 30px; font-size: 14px; font-weight: 600;
  letter-spacing: 0.03em; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 8px; }
.btn-p:hover { background: var(--green-mid); transform: translateY(-1px); }
.btn-o { background: transparent; color: var(--green-deep); border: 2px solid var(--green-deep);
  cursor: pointer; border-radius: 100px; padding: 11px 30px; font-size: 14px; font-weight: 600;
  transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 8px; }
.btn-o:hover { background: var(--green-pale); }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.fadein { animation: fadeUp 0.5s ease forwards; }
input:focus, textarea:focus, select:focus { border-color: var(--green-mid) !important; outline: none; }
html { scroll-behavior: smooth; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes pulse-ring { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(1.5);opacity:0} }
.float { animation: float 5s ease-in-out infinite; }
@media (max-width: 768px) {
  .g2 { grid-template-columns: 1fr !important; }
  .g4 { grid-template-columns: 1fr 1fr !important; }
  .section { padding: 52px 0; }
  .hide-m { display: none !important; }
  .show-m { display: block !important; }
}
`;

// ─── LOGO SVG ──────────────────────────────────────────────────────────────
const Logo = ({ size = 36, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill={G.deepGreen} />
    <path d="M20 7C20 7 13 11 13 19C13 23.4 16.1 27 20 27C23.9 27 27 23.4 27 19C27 11 20 7 20 7Z" fill="white" opacity="0.9" />
    <path d="M20 14C20 14 16 17.5 17.3 22C18.6 26 20 27 20 27V14Z" fill={G.lightGreen} />
    <path d="M20 27V22" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 33H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <rect x="16" y="31" width="8" height="3" rx="1.5" fill="white" opacity="0.5" />
  </svg>
);

// ─── NAV ───────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "rental", label: "Plant Rentals" },
  { id: "plants", label: "Buy Plants" },
  { id: "landscaping", label: "Landscaping" },
  { id: "maintenance", label: "Maintenance" },
  { id: "contact", label: "Contact" },
];

function Navbar({ page, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = (id) => { navigate(id); setMenuOpen(false); };
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,250,247,0.93)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(26,61,43,0.07)", padding: "14px 0" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => nav("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={36} />
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: G.deepGreen, lineHeight: 1.1 }}>Growitbro</div>
            <div style={{ fontSize: 9, color: G.textLight, letterSpacing: "0.1em", textTransform: "uppercase" }}>Agritech Pvt Ltd</div>
          </div>
        </div>
        <div className="hide-m" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => nav(n.id)} style={{
              fontSize: 14, fontWeight: 500, color: page === n.id ? "white" : G.textDark,
              cursor: "pointer", padding: "7px 14px", borderRadius: 100, transition: "all 0.2s",
              border: "none", background: page === n.id ? G.deepGreen : "transparent",
            }}>{n.label}</button>
          ))}
        </div>
        <button className="btn-p hide-m" style={{ fontSize: 13, padding: "10px 22px" }} onClick={() => nav("contact")}>Book Consultation</button>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 6, lineHeight: 0 }} className="show-m">
          <svg width="22" height="16" viewBox="0 0 22 16"><rect y="0" width="22" height="2" rx="1" fill={G.deepGreen}/><rect y="7" width="22" height="2" rx="1" fill={G.deepGreen}/><rect y="14" width="22" height="2" rx="1" fill={G.deepGreen}/></svg>
        </button>
      </div>
      {menuOpen && (
        <div style={{ padding: "10px 24px 20px", borderTop: "1px solid rgba(26,61,43,0.07)" }}>
          {NAV_ITEMS.map(n => (
            <div key={n.id} onClick={() => nav(n.id)} style={{ padding: "13px 0", fontSize: 15, fontWeight: page === n.id ? 600 : 400, color: page === n.id ? G.midGreen : G.textDark, cursor: "pointer", borderBottom: "1px solid rgba(26,61,43,0.06)" }}>{n.label}</div>
          ))}
          <button className="btn-p" style={{ marginTop: 16, width: "100%", justifyContent: "center" }} onClick={() => nav("contact")}>Book Consultation</button>
        </div>
      )}
    </nav>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────
function Footer({ navigate }) {
  return (
    <footer style={{ background: G.deepGreen, color: "white", padding: "60px 0 32px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Logo size={32} />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>Growitbro</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.75, maxWidth: 200 }}>Transform your spaces into lush green life. Premium greenery, managed to perfection.</p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>Services</div>
            {["rental:Plant Rentals", "plants:Buy Plants", "landscaping:Landscaping", "maintenance:Maintenance"].map(s => {
              const [id, label] = s.split(":");
              return <div key={id} onClick={() => navigate(id)} style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginBottom: 10, cursor: "pointer" }} onMouseEnter={e => e.target.style.color = "white"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.65)"}>{label}</div>;
            })}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>Find Us</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.85 }}>Hans Business Park<br />Sohna Road, Sector 48<br />Gurugram – 122018<br /><br />+91 9992208888<br />care@growitbro.com</p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>Hours</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.9 }}>Mon – Fri: 8am – 8pm<br />Sat – Sun: 6am – 9pm</p>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {["IG", "FB", "TW"].map(s => <div key={s} style={{ width: 34, height: 34, background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.7)" }}>{s}</div>)}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>© 2025 Growitbro Agritech Pvt Ltd. All rights reserved.</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Gurugram, India</span>
        </div>
      </div>
    </footer>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────
const HOME_SERVICES = [
  { icon: "🪴", title: "Plant Rentals", desc: "Like Netflix, but for oxygen. Zero capex, full greenery.", page: "rental" },
  { icon: "🌿", title: "Buy Plants", desc: "Hand-selected, climate-resilient plants for every lifestyle.", page: "plants" },
  { icon: "🏙️", title: "Landscaping", desc: "Bespoke corporate and residential green transformations.", page: "landscaping" },
  { icon: "✂️", title: "Maintenance", desc: "Expert horticulturists for homes, offices, public spaces.", page: "maintenance" },
];
const STATS = [
  { value: "500+", label: "Corporate Clients" }, { value: "12K+", label: "Plants Deployed" },
  { value: "100%", label: "Replacement Guarantee" }, { value: "4", label: "Cities Covered" },
];

function HomePage({ navigate }) {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setActiveIdx(i => (i + 1) % HOME_SERVICES.length), 3200); return () => clearInterval(t); }, []);

  return (
    <div className="fadein">
      {/* Hero */}
      <section style={{ minHeight: "90vh", display: "flex", alignItems: "center", background: `linear-gradient(135deg, ${G.deepGreen} 0%, ${G.midGreen} 65%, ${G.lightGreen} 100%)`, position: "relative", overflow: "hidden", padding: "80px 0 60px" }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 640, height: 640, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 380, height: 380, borderRadius: "50%", background: "rgba(255,255,255,0.025)", pointerEvents: "none" }} />
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} data-class="g2">
          <div style={{ color: "white" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 26, background: "rgba(255,255,255,0.1)", borderRadius: 100, padding: "6px 16px 6px 8px", fontSize: 13, fontWeight: 500 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: G.lightGreen, display: "inline-block" }} />
              Gurugram's Premium Green Partners
            </div>
            <h1 style={{ color: "white", fontSize: "clamp(40px, 5vw, 66px)", fontWeight: 900, lineHeight: 1.04, marginBottom: 24, letterSpacing: "-0.025em" }}>
              Premium<br />Greenery,<br /><span style={{ color: "#A7E3C0" }}>Managed to<br />Perfection.</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.78, maxWidth: 460, marginBottom: 36, fontWeight: 300 }}>
              We transform offices, hotels, and homes into thriving green sanctuaries — handling everything from delivery to daily care.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn-p" style={{ background: "white", color: G.deepGreen, padding: "14px 32px", fontSize: 15 }} onClick={() => navigate("rental")}>Explore Rentals ↗</button>
              <button className="btn-o" style={{ borderColor: "rgba(255,255,255,0.38)", color: "white", padding: "14px 32px", fontSize: 15 }} onClick={() => navigate("contact")}>Talk to Us</button>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 50, flexWrap: "wrap" }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "white" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Animated Cards */}
          <div style={{ position: "relative", height: 340 }}>
            {HOME_SERVICES.map((s, i) => (
              <div key={s.title} onClick={() => setActiveIdx(i)} style={{
                position: "absolute", top: `${i * 14}px`, left: `${i * 14}px`, right: 0,
                background: i === activeIdx ? "white" : "rgba(255,255,255,0.07)",
                borderRadius: 20, padding: "28px 30px", cursor: "pointer",
                transition: "all 0.48s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: i === activeIdx ? "scale(1)" : "scale(0.96)",
                zIndex: i === activeIdx ? 10 : 4 - i, opacity: Math.abs(i - activeIdx) > 1 ? 0.25 : 1,
              }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
                <h3 style={{ fontSize: 20, marginBottom: 8, color: i === activeIdx ? G.deepGreen : "white" }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: i === activeIdx ? G.textMid : "rgba(255,255,255,0.68)" }}>{s.desc}</p>
                {i === activeIdx && (
                  <button onClick={() => navigate(s.page)} style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: G.midGreen, background: G.paleGreen, border: "none", borderRadius: 100, padding: "8px 18px", cursor: "pointer" }}>Learn more →</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section style={{ background: G.paleGreen, padding: "24px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 64, animation: "marquee 22s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
          {[...Array(4)].fill(["Zero Capex", "100% Replacement Guarantee", "Expert Horticulturists", "Same-Day Delivery", "Pan-India Scalability"]).flat().map((t, i) => (
            <span key={i} style={{ fontSize: 13, fontWeight: 700, color: G.deepGreen, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {t}<span style={{ marginLeft: 32, color: G.lightGreen }}>✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="tag">How It Works</span>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", letterSpacing: "-0.02em" }}>4 Steps to a Lively<br />Green Space</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }} className="g4">
            {[
              { n: "01", t: "Consultation", d: "Free on-site visit to understand your space, aesthetic and needs.", dark: true },
              { n: "02", t: "Selection", d: "We curate the perfect plants matched to your lighting and theme.", dark: false },
              { n: "03", t: "Delivery", d: "White-glove installation with styled pots and precision placements.", dark: true },
              { n: "04", t: "Maintenance", d: "Scheduled care visits — we handle it all. You enjoy the green.", dark: false },
            ].map((s, i) => (
              <div key={s.n} style={{ padding: "40px 28px", background: s.dark ? G.deepGreen : "white", borderRadius: i === 0 ? "18px 4px 4px 18px" : i === 3 ? "4px 18px 18px 4px" : 4 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 900, color: s.dark ? "rgba(255,255,255,0.1)" : "rgba(26,61,43,0.07)", lineHeight: 1, marginBottom: 18 }}>{s.n}</div>
                <h3 style={{ fontSize: 21, marginBottom: 10, color: s.dark ? "white" : G.deepGreen }}>{s.t}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: s.dark ? "rgba(255,255,255,0.65)" : G.textMid }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Rental */}
      <section className="section" style={{ background: "var(--cream-warm)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="g2">
            <div>
              <span className="tag">Why Growitbro Rental</span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", letterSpacing: "-0.02em", marginBottom: 16 }}>The smarter<br />office greenery model</h2>
              <p style={{ color: G.textMid, fontSize: 15, lineHeight: 1.78, marginBottom: 28 }}>Nature is beautiful, but nature is also work. Our subscription model keeps your office perpetually lush without any capital expenditure.</p>
              <button className="btn-p" onClick={() => navigate("rental")}>View Rental Plans →</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { icon: "₹", t: "Zero Capex", d: "All-inclusive monthly rent." },
                { icon: "🌱", t: "Always Green", d: "Free plant replacement included." },
                { icon: "👨‍🌾", t: "Expert Care", d: "Professional horticulturists." },
                { icon: "🎨", t: "Aesthetic Match", d: "Pots matched to your theme." },
              ].map(f => (
                <div key={f.t} style={{ background: "white", borderRadius: 16, padding: "22px 18px", border: `1px solid rgba(26,61,43,0.08)` }}>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
                  <h4 style={{ fontSize: 15, marginBottom: 5, color: G.deepGreen }}>{f.t}</h4>
                  <p style={{ fontSize: 12, color: G.textLight, lineHeight: 1.6 }}>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pull Quote */}
      <section style={{ background: G.deepGreen, padding: "80px 0", textAlign: "center" }}>
        <div className="container">
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 100, color: "rgba(82,183,136,0.2)", lineHeight: 0.6, marginBottom: 28 }}>"</div>
          <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 44px)", fontWeight: 700, color: "white", maxWidth: 660, margin: "0 auto 20px", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            It's like Netflix, but for oxygen.
          </blockquote>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>— What our clients say</p>
          <button className="btn-p" style={{ marginTop: 40, background: G.lightGreen, color: G.deepGreen, padding: "14px 32px" }} onClick={() => navigate("contact")}>Book a Free Consultation</button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="tag">Our Services</span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", letterSpacing: "-0.02em" }}>Everything Green,<br />Under One Roof</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {HOME_SERVICES.map((s, idx) => (
              <Reveal key={s.title} delay={idx * 80}>
              <div className="ghover" onClick={() => navigate(s.page)} style={{ background: "white", borderRadius: 20, padding: "34px 26px", border: `1px solid rgba(26,61,43,0.08)`, height: "100%" }}>
                <div style={{ fontSize: 34, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 20, marginBottom: 10, color: G.deepGreen }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: G.textMid, lineHeight: 1.7, marginBottom: 18 }}>{s.desc}</p>
                <span style={{ fontSize: 13, fontWeight: 600, color: G.midGreen }}>Explore →</span>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── RENTAL PAGE ───────────────────────────────────────────────────────────
const RENTAL_BENEFITS = [
  { icon: "₹", t: "Zero Capex", d: "All-inclusive monthly rent. No upfront purchase." },
  { icon: "🌿", t: "100% Replacement", d: "Free plant swap if it ever loses vitality." },
  { icon: "👨‍🌾", t: "Expert Care", d: "Professionally trained horticulturists on schedule." },
  { icon: "🎨", t: "Aesthetic Match", d: "Pots and plants matched to your interior theme." },
  { icon: "🌍", t: "Scalable", d: "All branch offices, one single bill." },
  { icon: "📅", t: "Flexible", d: "Short-term events or long-term offices — we adapt." },
];
const FAQS = [
  { q: "What happens if a plant dies or starts looking unhealthy?", a: "Growitbro provides a 100% Replacement Guarantee. We monitor every plant during maintenance visits and replace it immediately at no cost if it loses its vitality or aesthetic appeal. Your space will always look 'Day 1' fresh." },
  { q: "Our office has very little natural light. Can we still have real plants?", a: "Absolutely. We specialise in low-light species like ZZ plants, Pothos, Snake Plants, and Peace Lilies. Our consultants will assess your space and recommend species that thrive in artificial lighting." },
  { q: "Does plant maintenance disrupt our daily office operations?", a: "Not at all. Our teams work quietly during off-peak hours — early morning or after hours — and coordinate visit timings with your facilities manager. Most visits take 15–30 minutes per floor." },
];

function RentalPage({ navigate }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="fadein">
      <section style={{ padding: "80px 0 60px", background: `linear-gradient(155deg, ${G.deepGreen} 0%, ${G.midGreen} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "rgba(82,183,136,0.07)", pointerEvents: "none" }} />
        <div className="container">
          <span className="tag" style={{ background: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.92)" }}>Plant Rentals</span>
          <h1 style={{ color: "white", fontSize: "clamp(34px, 5vw, 58px)", fontWeight: 900, letterSpacing: "-0.025em", marginBottom: 18, maxWidth: 620, lineHeight: 1.06 }}>
            Bring Your Space to Life.<br /><span style={{ color: "#A7E3C0" }}>Without the Commitment.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.78, maxWidth: 500, marginBottom: 34 }}>Premium plant rentals for homes, offices, and events. We deliver, we style, and — if you want — we even water.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn-p" style={{ background: "white", color: G.deepGreen }} onClick={() => navigate("contact")}>Book Free Consultation</button>
            <button className="btn-o" style={{ borderColor: "rgba(255,255,255,0.35)", color: "white" }}>+91 9992208888</button>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="tag">Who We Serve</span>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", letterSpacing: "-0.02em" }}>Green spaces for every kind of business</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
            {[
              { icon: "☕", l: "Cafes", d: "Warm, inviting atmospheres that keep customers returning." },
              { icon: "🏨", l: "Hotels", d: "Luxurious greenery for lobbies, rooms, and event halls." },
              { icon: "🏢", l: "Offices", d: "Boost productivity with biophilic work environments." },
              { icon: "🎪", l: "Events", d: "Short-term rentals for weddings, launches, and corporate events." },
            ].map(c => (
              <div key={c.l} className="ghover" style={{ background: "white", borderRadius: 20, padding: "34px 22px", textAlign: "center", border: `1px solid rgba(26,61,43,0.08)` }}>
                <div style={{ fontSize: 38, marginBottom: 12 }}>{c.icon}</div>
                <h3 style={{ fontSize: 19, marginBottom: 8, color: G.deepGreen }}>{c.l}</h3>
                <p style={{ fontSize: 13, color: G.textMid, lineHeight: 1.65 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section" style={{ background: "var(--cream-warm)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }} className="g2">
            <div>
              <span className="tag">Why Rent, Not Buy</span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", letterSpacing: "-0.02em", marginBottom: 16 }}>6 reasons offices choose our rental model</h2>
              <p style={{ color: G.textMid, fontSize: 15, lineHeight: 1.78 }}>Our rental model flips the equation — you get all the beauty, none of the burden.</p>
              <div style={{ marginTop: 28, background: G.deepGreen, borderRadius: 16, padding: "26px 28px" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 900, color: "#A7E3C0", lineHeight: 1 }}>100%</div>
                <p style={{ fontSize: 13, marginTop: 8, color: "rgba(255,255,255,0.72)", lineHeight: 1.65 }}>Replacement guarantee — if a plant loses its charm, we swap it. No questions asked.</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {RENTAL_BENEFITS.map(b => (
                <div key={b.t} style={{ display: "flex", gap: 18, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "18px 20px", border: `1px solid rgba(26,61,43,0.08)` }}>
                  <div style={{ fontSize: 22, minWidth: 34, textAlign: "center" }}>{b.icon}</div>
                  <div>
                    <h4 style={{ fontSize: 15, marginBottom: 4, color: G.deepGreen }}>{b.t}</h4>
                    <p style={{ fontSize: 13, color: G.textMid, lineHeight: 1.6 }}>{b.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container" style={{ maxWidth: 740 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="tag">FAQ</span>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", letterSpacing: "-0.02em" }}>Got questions? We've got answers.</h2>
          </div>
          {FAQS.map((faq, i) => (
            <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ background: "white", borderRadius: 14, marginBottom: 10, overflow: "hidden", border: `1px solid rgba(26,61,43,0.1)`, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px" }}>
                <h4 style={{ fontSize: 15, color: G.textDark, maxWidth: "88%", lineHeight: 1.45 }}>{faq.q}</h4>
                <span style={{ fontSize: 22, color: G.midGreen, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
              </div>
              {openFaq === i && <div style={{ padding: "0 22px 20px", fontSize: 14, color: G.textMid, lineHeight: 1.75 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: G.paleGreen, padding: "60px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-0.02em", marginBottom: 12 }}>Ready to greenify your office?</h2>
          <p style={{ color: G.textMid, fontSize: 15, marginBottom: 30 }}>Book a free consultation. No commitment required.</p>
          <button className="btn-p" style={{ padding: "15px 40px", fontSize: 16 }} onClick={() => navigate("contact")}>Book Free Consultation →</button>
        </div>
      </section>
    </div>
  );
}

// ─── PLANTS PAGE ───────────────────────────────────────────────────────────
const PLANT_CATS = [
  { icon: "🎁", t: "Gifting Plants", d: "Beautifully packaged for birthdays, Diwali, housewarmings, and corporate gifting.", badge: "Most Popular" },
  { icon: "🌱", t: "Table Plants", d: "Your personal desk buddy. Low-maintenance mood-lifting plants for any workspace.", badge: null },
  { icon: "🌿", t: "Balcony & Home", d: "From trailing pothos to dramatic fiddle-leaf figs — curated for every home corner.", badge: null },
  { icon: "🪴", t: "Hobby Buying", d: "Unusual varieties, rare finds, seasonal picks for the curious plant explorer.", badge: null },
  { icon: "🌳", t: "Plant Collectors", d: "Statement pieces and rare tropicals sourced from our nursery.", badge: "Limited Stock" },
];
const PLANT_LIST = [
  { name: "Fiddle Leaf Fig", light: "Bright indirect", care: "Medium", size: "Floor plant" },
  { name: "Snake Plant", light: "Any light", care: "Very Easy", size: "Table / Floor" },
  { name: "Pothos Golden", light: "Low to bright", care: "Easy", size: "Hanging / Table" },
  { name: "Peace Lily", light: "Low light", care: "Easy", size: "Table / Floor" },
  { name: "ZZ Plant", light: "Low light", care: "Very Easy", size: "Table / Floor" },
  { name: "Monstera", light: "Bright indirect", care: "Medium", size: "Floor statement" },
];

function PlantsPage({ navigate }) {
  return (
    <div className="fadein">
      <section style={{ padding: "80px 0 60px", background: "var(--cream-warm)", borderBottom: `1px solid rgba(26,61,43,0.08)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: G.paleGreen, opacity: 0.55, pointerEvents: "none" }} />
        <div className="container">
          <span className="tag">Buy Plants</span>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.06, color: G.deepGreen, marginBottom: 18, maxWidth: 560 }}>Plants Grown<br />for Your Lifestyle.</h1>
          <p style={{ color: G.textMid, fontSize: 16, lineHeight: 1.78, maxWidth: 480, marginBottom: 34 }}>Hand-selected, climate-resilient greenery delivered from our nursery to your doorstep. Gift a plant. Grow a plant. Love a plant.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn-p" onClick={() => navigate("contact")}>Visit Our Nursery</button>
            <button className="btn-o" onClick={() => navigate("contact")}>Order Online →</button>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="tag">Categories</span>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-0.02em" }}>Find your perfect plant</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {PLANT_CATS.map(c => (
              <div key={c.t} className="ghover" onClick={() => navigate("contact")} style={{ background: "white", borderRadius: 20, padding: "30px 24px", border: `1px solid rgba(26,61,43,0.08)`, position: "relative" }}>
                {c.badge && <div style={{ position: "absolute", top: 14, right: 14, background: c.badge === "Limited Stock" ? "#FFF3CD" : G.paleGreen, color: c.badge === "Limited Stock" ? "#6D4C00" : G.deepGreen, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100 }}>{c.badge}</div>}
                <div style={{ fontSize: 34, marginBottom: 12 }}>{c.icon}</div>
                <h3 style={{ fontSize: 19, marginBottom: 8, color: G.deepGreen }}>{c.t}</h3>
                <p style={{ fontSize: 13, color: G.textMid, lineHeight: 1.65 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: G.deepGreen }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="tag" style={{ background: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.9)" }}>Featured Plants</span>
            <h2 style={{ color: "white", fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-0.02em" }}>Popular picks from our nursery</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {PLANT_LIST.map((p, i) => (
              <div key={p.name} className="ghover" onClick={() => navigate("contact")} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", padding: "26px 22px" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: i % 2 === 0 ? G.paleGreen : "var(--cream-warm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 14 }}>🪴</div>
                <h3 style={{ color: "white", fontSize: 17, marginBottom: 12 }}>{p.name}</h3>
                {[["Light", p.light], ["Care", p.care], ["Best For", p.size]].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.82)" }}>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--cream-warm)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="g2">
            <div style={{ background: G.paleGreen, borderRadius: 24, padding: "52px 38px", textAlign: "center" }}>
              <div style={{ fontSize: 72, lineHeight: 1 }}>🌸</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: G.deepGreen, marginTop: 18, lineHeight: 1.25 }}>Gift a plant.<br />Gift oxygen.</div>
              <p style={{ fontSize: 13, color: G.textMid, marginTop: 10, lineHeight: 1.7 }}>Beautifully packaged with care cards and grow guides.</p>
            </div>
            <div>
              <span className="tag">Plant Gifting</span>
              <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-0.02em", marginBottom: 16 }}>The gift that keeps on growing</h2>
              <p style={{ color: G.textMid, fontSize: 15, lineHeight: 1.78, marginBottom: 26 }}>Our gifting range comes beautifully packaged with a personalised care card and grow guide. Perfect for birthdays, Diwali, housewarmings, and corporate gifting.</p>
              {["✔ Same-day delivery in Gurugram", "✔ Custom pot & packaging", "✔ Personalised grow care card", "✔ Bulk corporate orders welcome"].map(f => (
                <div key={f} style={{ fontSize: 14, fontWeight: 500, color: G.textDark, marginBottom: 10 }}>{f}</div>
              ))}
              <button className="btn-p" style={{ marginTop: 26 }} onClick={() => navigate("contact")}>Order a Gift Plant →</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── LANDSCAPING PAGE ──────────────────────────────────────────────────────
function LandscapingPage({ navigate }) {
  return (
    <div className="fadein">
      <section style={{ padding: "80px 0 60px", background: `linear-gradient(155deg, #173324 0%, ${G.deepGreen} 55%, ${G.midGreen} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", background: "rgba(82,183,136,0.04)", clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0% 100%)", pointerEvents: "none" }} />
        <div className="container">
          <span className="tag" style={{ background: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.92)" }}>Landscaping</span>
          <h1 style={{ color: "white", fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.06, marginBottom: 18, maxWidth: 600 }}>Landscapes Built to Thrive,<br /><span style={{ color: "#A7E3C0" }}>Not Just Survive.</span></h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.78, maxWidth: 500, marginBottom: 34 }}>Bespoke outdoor and indoor green transformations. From lush corporate courtyards to serene residential balconies — we design, plant, and maintain.</p>
          <button className="btn-p" style={{ background: "white", color: G.deepGreen }} onClick={() => navigate("contact")}>Book a Site Survey</button>
        </div>
      </section>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="tag">Scope of Work</span>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-0.02em" }}>Where we create green magic</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {[
              { icon: "🏢", t: "Corporate Hubs", d: "Transform lobbies, atriums, and courtyards into impressive biophilic spaces.", dark: true },
              { icon: "🌇", t: "Balconies & Terraces", d: "From compact city balconies to expansive rooftop terraces, beautifully planted.", dark: false },
              { icon: "🌆", t: "Public Spaces", d: "Malls, airports, hospitals, and parks — large-scale greening with precision.", dark: true },
              { icon: "🏡", t: "Farmhouses & Resorts", d: "Bespoke garden design for luxury properties demanding extraordinary experiences.", dark: false },
            ].map(s => (
              <div key={s.t} className="ghover" style={{ borderRadius: 20, padding: "34px 24px", background: s.dark ? G.deepGreen : "white", border: s.dark ? "none" : `1px solid rgba(26,61,43,0.08)` }}>
                <div style={{ fontSize: 34, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 19, marginBottom: 10, color: s.dark ? "white" : G.deepGreen }}>{s.t}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: s.dark ? "rgba(255,255,255,0.66)" : G.textMid }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--cream-warm)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span className="tag">Our Process</span>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-0.02em" }}>From vision to verdant reality</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { n: "01", t: "Site Survey", d: "Free on-site assessment — light, soil, drainage, and spatial requirements documented." },
              { n: "02", t: "Concept Design", d: "Detailed concept plan with plant palettes and 3D visualisations before work begins." },
              { n: "03", t: "Execution", d: "Trained crew handles earthwork, irrigation, planting, and finishing with precision." },
              { n: "04", t: "Handover & Care", d: "Complete care manual plus optional ongoing maintenance contracts for pristine results." },
            ].map((p, i) => (
              <div key={p.n} style={{ padding: "32px 26px", background: "white", borderRadius: 18, border: `1px solid rgba(26,61,43,0.08)`, borderTop: `4px solid ${i % 2 === 0 ? G.deepGreen : G.lightGreen}` }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: "rgba(26,61,43,0.08)", lineHeight: 1, marginBottom: 14 }}>{p.n}</div>
                <h3 style={{ fontSize: 19, marginBottom: 8, color: G.deepGreen }}>{p.t}</h3>
                <p style={{ fontSize: 14, color: G.textMid, lineHeight: 1.7 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: G.paleGreen }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="g2">
            <div>
              <span className="tag">Our Expertise</span>
              <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-0.02em", marginBottom: 16 }}>Landscape design that endures</h2>
              <p style={{ color: G.textMid, fontSize: 15, lineHeight: 1.78, marginBottom: 28 }}>We combine horticultural science with spatial design to create green spaces that grow more beautiful over time.</p>
              <button className="btn-p" onClick={() => navigate("contact")}>Request Site Survey →</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Soil analysis and preparation", "Irrigation system design & installation", "Native and exotic plant combinations", "Hardscape integration (pathways, planters)", "Low-maintenance species selection", "Ongoing maintenance contracts available"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 14, background: "white", borderRadius: 12, padding: "14px 18px", border: `1px solid rgba(26,61,43,0.08)` }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.midGreen, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: G.textDark, fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── MAINTENANCE PAGE ──────────────────────────────────────────────────────
const MAINT_SERVICES = [
  { icon: "💧", t: "Scheduled Watering", d: "Customised watering schedules based on species, pot size, and season." },
  { icon: "✂️", t: "Pruning & Shaping", d: "Regular trimming to maintain healthy growth and aesthetic form." },
  { icon: "🌱", t: "Fertilisation", d: "Nutrient management tailored to each plant's individual requirements." },
  { icon: "🔬", t: "Pest & Disease Control", d: "Early detection and organic-first treatment of pests and fungal issues." },
  { icon: "🪴", t: "Repotting", d: "Timely repotting with fresh substrate to support continued growth." },
  { icon: "📊", t: "Health Reports", d: "Monthly plant-by-plant health summaries for corporate clients." },
];

function MaintenancePage({ navigate }) {
  return (
    <div className="fadein">
      <section style={{ padding: "80px 0 60px", background: `linear-gradient(160deg, var(--cream-warm) 0%, var(--green-pale) 100%)`, borderBottom: `1px solid rgba(26,61,43,0.08)` }}>
        <div className="container">
          <span className="tag">Maintenance</span>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.06, marginBottom: 18, maxWidth: 580, color: G.deepGreen }}>
            Expert Care for<br /><span style={{ color: G.midGreen }}>Thriving Green Spaces.</span>
          </h1>
          <p style={{ color: G.textMid, fontSize: 16, lineHeight: 1.78, maxWidth: 490, marginBottom: 34 }}>Most indoor plants fail due to inconsistent care. Our technically trained teams ensure your greenery stays lush, healthy, and professional.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn-p" onClick={() => navigate("contact")}>Get a Maintenance Quote</button>
            <button className="btn-o">+91 9992208888</button>
          </div>
        </div>
      </section>

      <section style={{ background: G.deepGreen, padding: "60px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="g2">
            <div>
              <h2 style={{ color: "white", fontSize: "clamp(22px, 3vw, 34px)", letterSpacing: "-0.02em", marginBottom: 14 }}>Why most office plants don't make it past 6 months</h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.8 }}>Plants wither not from bad luck but because indoor plants have specific needs that rarely get met consistently in a busy environment.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Irregular watering", "Scheduled visits on fixed days"],
                ["Wrong fertiliser or none", "Species-specific nutrition plans"],
                ["Pests caught too late", "Early-detection inspections"],
                ["Root-bound, stunted growth", "Timely repotting & soil refresh"],
              ].map(([prob, fix]) => (
                <div key={prob} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, background: "rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "13px 16px", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ fontSize: 10, color: "#F4A0A0", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>PROBLEM</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.78)" }}>{prob}</div>
                  </div>
                  <div style={{ padding: "13px 16px" }}>
                    <div style={{ fontSize: 10, color: "#A7E3C0", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>OUR FIX</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.78)" }}>{fix}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="tag">What's Included</span>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-0.02em" }}>Full-spectrum plant care</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {MAINT_SERVICES.map(s => (
              <div key={s.t} className="ghover" style={{ background: "white", borderRadius: 18, padding: "26px 22px", border: `1px solid rgba(26,61,43,0.08)`, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: G.paleGreen, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <h3 style={{ fontSize: 16, marginBottom: 6, color: G.deepGreen }}>{s.t}</h3>
                  <p style={{ fontSize: 13, color: G.textMid, lineHeight: 1.65 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--cream-warm)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="tag">Maintenance Plans</span>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-0.02em" }}>Choose your care level</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
            {[
              { name: "Essential", freq: "Monthly visits", features: ["Watering check & soil moisture", "Basic pruning", "Pest inspection", "Monthly report"], hi: false },
              { name: "Standard", freq: "Bi-monthly visits", features: ["Everything in Essential", "Fertilisation schedule", "Leaf cleaning", "Repotting (annual)", "Priority support"], hi: true },
              { name: "Premium", freq: "Weekly visits", features: ["Everything in Standard", "Disease treatment", "Plant replacements", "Dedicated horticulturist", "24/7 WhatsApp support"], hi: false },
            ].map(plan => (
              <div key={plan.name} style={{ background: plan.hi ? G.deepGreen : "white", borderRadius: 20, padding: "34px 26px", border: plan.hi ? "none" : `1px solid rgba(26,61,43,0.1)`, position: "relative" }}>
                {plan.hi && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: G.lightGreen, color: G.deepGreen, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 16px", borderRadius: 100 }}>Most Popular</div>}
                <h3 style={{ fontSize: 24, marginBottom: 5, color: plan.hi ? "white" : G.deepGreen }}>{plan.name}</h3>
                <div style={{ fontSize: 13, color: plan.hi ? "rgba(255,255,255,0.55)" : G.textLight, marginBottom: 22 }}>{plan.freq}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 15, height: 15, borderRadius: "50%", background: plan.hi ? "rgba(255,255,255,0.18)" : G.paleGreen, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: plan.hi ? "white" : G.midGreen }} />
                      </div>
                      <span style={{ fontSize: 13, color: plan.hi ? "rgba(255,255,255,0.82)" : G.textDark }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate("contact")} style={{ width: "100%", padding: "12px", borderRadius: 100, background: plan.hi ? "white" : G.deepGreen, color: plan.hi ? G.deepGreen : "white", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>Get a Quote</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── CONTACT PAGE ──────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const inputStyle = { width: "100%", border: `1.5px solid rgba(26,61,43,0.15)`, borderRadius: 10, padding: "12px 14px", fontSize: 14, outline: "none", background: "var(--cream)", color: G.textDark, transition: "border 0.2s", fontFamily: "'DM Sans', sans-serif" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: G.textMid, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 };

  return (
    <div className="fadein">
      <section style={{ padding: "80px 0 60px", background: "var(--cream-warm)", borderBottom: `1px solid rgba(26,61,43,0.08)` }}>
        <div className="container">
          <span className="tag">Contact Us</span>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.06, color: G.deepGreen, marginBottom: 14 }}>Let's build something<br />green together.</h1>
          <p style={{ color: G.textMid, fontSize: 16, lineHeight: 1.78, maxWidth: 460 }}>Whether you need a rental quote, want to buy plants, or have a landscaping project — we'd love to hear from you.</p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 56, alignItems: "start" }} className="g2">
            <div>
              <div style={{ background: G.deepGreen, borderRadius: 22, padding: "38px 32px", marginBottom: 18 }}>
                <h3 style={{ color: "white", fontSize: 21, marginBottom: 26 }}>Get in touch</h3>
                {[
                  { icon: "📞", l: "Phone", v: "+91 9992208888" },
                  { icon: "✉️", l: "Email", v: "care@growitbro.com" },
                  { icon: "📍", l: "Address", v: "Hans Business Park\nIn front of Radisson Hotel\nSohna Road, Sector 48, Gurugram – 122018" },
                ].map(c => (
                  <div key={c.l} style={{ display: "flex", gap: 14, marginBottom: 22 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.11)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 4 }}>{c.l}</div>
                      <div style={{ fontSize: 13, color: "white", lineHeight: 1.65, whiteSpace: "pre-line" }}>{c.v}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: G.paleGreen, borderRadius: 18, padding: "26px 28px" }}>
                <h4 style={{ fontSize: 17, color: G.deepGreen, marginBottom: 14 }}>Working Hours</h4>
                {[["Mon – Fri", "8am – 8pm"], ["Sat – Sun", "6am – 9pm"]].map(([d, h]) => (
                  <div key={d}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                      <span style={{ color: G.textMid }}>{d}</span><span style={{ fontWeight: 600, color: G.textDark }}>{h}</span>
                    </div>
                    <div style={{ height: 1, background: "rgba(26,61,43,0.1)", margin: "8px 0" }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "white", borderRadius: 22, padding: "44px 40px", border: `1px solid rgba(26,61,43,0.08)` }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "36px 0" }}>
                  <div style={{ fontSize: 60, marginBottom: 18 }}>🌿</div>
                  <h3 style={{ fontSize: 26, color: G.deepGreen, marginBottom: 10 }}>We'll be in touch!</h3>
                  <p style={{ fontSize: 14, color: G.textMid, lineHeight: 1.75, maxWidth: 340, margin: "0 auto 24px" }}>Thanks for reaching out. Our team will contact you within 24 hours to discuss your green space needs.</p>
                  <button className="btn-o" onClick={() => setSubmitted(false)}>Send another message</button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: 22, marginBottom: 6, color: G.textDark }}>Book an appointment</h3>
                  <p style={{ fontSize: 13, color: G.textLight, marginBottom: 28 }}>We'll get back to you within 24 hours.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    {[["firstName", "First Name", "Arjun"], ["lastName", "Last Name", "Sharma"]].map(([name, label, placeholder]) => (
                      <div key={name}>
                        <label style={labelStyle}>{label}</label>
                        <input name={name} value={form[name]} onChange={handle} placeholder={placeholder} style={inputStyle} onFocus={e => e.target.style.borderColor = G.midGreen} onBlur={e => e.target.style.borderColor = "rgba(26,61,43,0.15)"} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    {[["email", "Email", "arjun@company.com", "email"], ["phone", "Phone", "+91 98765 43210", "tel"]].map(([name, label, placeholder, type]) => (
                      <div key={name}>
                        <label style={labelStyle}>{label}</label>
                        <input name={name} type={type} value={form[name]} onChange={handle} placeholder={placeholder} style={inputStyle} onFocus={e => e.target.style.borderColor = G.midGreen} onBlur={e => e.target.style.borderColor = "rgba(26,61,43,0.15)"} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Service Interested In</label>
                    <select name="service" value={form.service} onChange={handle} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">Select a service…</option>
                      <option value="rental">Plant Rentals</option>
                      <option value="buy">Buy Plants</option>
                      <option value="landscaping">Landscaping</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="other">Other / Not Sure</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 26 }}>
                    <label style={labelStyle}>Message</label>
                    <textarea name="message" value={form.message} onChange={handle} placeholder="Tell us about your space, number of plants needed, or any questions…" rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={e => e.target.style.borderColor = G.midGreen} onBlur={e => e.target.style.borderColor = "rgba(26,61,43,0.15)"} />
                  </div>
                  <button className="btn-p" onClick={() => setSubmitted(true)} style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: 15 }}>Send Message →</button>
                  <p style={{ fontSize: 11, color: G.textLight, textAlign: "center", marginTop: 12 }}>By submitting, you agree to our terms and conditions.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: G.deepGreen, padding: "58px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="tag" style={{ background: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.92)" }}>Stay Green</span>
          <h2 style={{ color: "white", fontSize: "clamp(22px, 3vw, 34px)", letterSpacing: "-0.02em", marginBottom: 10 }}>Join our green community</h2>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 14, marginBottom: 26 }}>Plant care tips, seasonal guides, and Growitbro updates — delivered to your inbox.</p>
          <div style={{ display: "flex", gap: 0, maxWidth: 420, margin: "0 auto", borderRadius: 100, overflow: "hidden", background: "white" }}>
            <input type="email" placeholder="Your email address" style={{ flex: 1, border: "none", outline: "none", padding: "13px 20px", fontSize: 14, background: "transparent", color: G.textDark }} />
            <button style={{ background: G.deepGreen, color: "white", border: "none", padding: "13px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", borderRadius: "0 100px 100px 0" }}>Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ROOT APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  const navigate = (id) => {
    setPage(id);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const pages = {
    home: <HomePage navigate={navigate} />,
    rental: <RentalPage navigate={navigate} />,
    plants: <PlantsPage navigate={navigate} />,
    landscaping: <LandscapingPage navigate={navigate} />,
    maintenance: <MaintenancePage navigate={navigate} />,
    contact: <ContactPage />,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--cream)", minHeight: "100vh" }}>
      <style>{globalCSS}</style>
      <Navbar page={page} navigate={navigate} />
      <main key={page}>{pages[page]}</main>
      <Footer navigate={navigate} />
    </div>
  );
}
