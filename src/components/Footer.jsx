import { Link } from "react-router-dom";
import { theme } from "@/utils/theme";
import { Leaf, Instagram, Twitter, Facebook, MapPin, Phone, Mail, Send } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const colTitle = { fontFamily: theme.fonts.mono, fontSize: 11, color: theme.colors.primaryLight, letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" };
  const linkStyle = { color: "rgba(255,255,255,0.75)", fontSize: 14, padding: "6px 0", cursor: "pointer", textDecoration: "none", display: "block", transition: theme.transition };

  return (
    <footer style={{ marginTop: 80, padding: "60px 24px 30px", background: "#1A2E1A", color: "#fff" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: theme.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={20} color="#fff" />
            </div>
            <div style={{ fontFamily: theme.fonts.heading, fontWeight: 800, fontSize: 26, letterSpacing: 1 }}>YUBI</div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.70)", fontSize: 14, lineHeight: 1.7 }}>
            Premium Indian e-commerce — fresh food delivery, authentic spices, and quality agro products sourced directly from farms.
          </p>
        </div>

        <div>
          <div style={colTitle}>Quick Links</div>
          <Link to="/home" style={linkStyle}>Home</Link>
          <Link to="/menu" style={linkStyle}>Food Menu</Link>
          <Link to="/spices" style={linkStyle}>Spices</Link>
          <Link to="/agro" style={linkStyle}>Agro Products</Link>
          <Link to="/blog" style={linkStyle}>Blog</Link>
        </div>

        <div>
          <div style={colTitle}>Contact</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12, color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
            <MapPin size={16} style={{ color: theme.colors.primaryLight, marginTop: 2, flexShrink: 0 }} />
            <span>YUBI HQ, Green Valley, Bengaluru, India 560001</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12, color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
            <Phone size={16} style={{ color: theme.colors.primaryLight, flexShrink: 0 }} />
            <span>+91 98765 43210</span>
          </div>
          <div style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
            <Mail size={16} style={{ color: theme.colors.primaryLight, flexShrink: 0 }} />
            <span>hello@yubi.com</span>
          </div>
        </div>

        <div>
          <div style={colTitle}>Newsletter</div>
          <p style={{ color: "rgba(255,255,255,0.70)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
            Get recipes, farm stories, and exclusive offers monthly.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); setEmail(""); }} style={{ display: "flex", gap: 8 }}>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{
                flex: 1, padding: "10px 12px", borderRadius: 10,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff", fontSize: 13, outline: "none",
              }}
            />
            <button type="submit" style={{
              padding: "10px 14px", borderRadius: 10, background: theme.gradient,
              color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center",
            }}><Send size={16} /></button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "40px auto 0", paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.10)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontFamily: theme.fonts.mono }}>© 2026 YUBI · CRAFTED IN INDIA</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[Instagram, Twitter, Facebook].map((Icon, i) => (
            <div key={i} style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", transition: theme.transition }}>
              <Icon size={16} />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
