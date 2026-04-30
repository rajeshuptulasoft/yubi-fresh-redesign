import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { theme } from "@/utils/theme";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Bell, ShoppingBag, Menu as MenuIcon, X, User, LogOut, LayoutDashboard, Bike, Leaf } from "lucide-react";

export default function Navbar() {
  const { count } = useCart();
  const { user, role, signOut } = useAuth();
  const { unread, notifications, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const nav = useNavigate();

  const links = [
    { to: "/home", label: "Home" },
    { to: "/menu", label: "Food Menu" },
    { to: "/spices", label: "Spices" },
    { to: "/agro", label: "Agro Products" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const iconBtn = {
    position: "relative", width: 42, height: 42, borderRadius: 12,
    background: "#FFFFFF", border: `1px solid ${theme.colors.border}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: theme.colors.text, textDecoration: "none",
    transition: theme.transition,
  };

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `2px solid ${theme.colors.primary}`,
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 24 }}>
        <Link to="/home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, background: theme.gradient,
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: theme.shadow,
          }}>
            <Leaf size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: theme.fonts.heading, fontWeight: 800, fontSize: 26, color: theme.colors.primaryDark, lineHeight: 1, letterSpacing: 1 }}>
              YUBI
            </div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 9, color: theme.colors.textDim, letterSpacing: 2, marginTop: 2 }}>FARM · KITCHEN · SPICES</div>
          </div>
        </Link>

        <nav className="ss-desktop-nav" style={{ display: "flex", gap: 2, marginLeft: 24 }}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to}
              style={({ isActive }) => ({
                padding: "10px 14px", borderRadius: theme.radius.sm, textDecoration: "none",
                color: isActive ? theme.colors.primaryDark : theme.colors.text,
                fontWeight: 600, fontSize: 14, transition: theme.transition,
                background: isActive ? "rgba(76,175,80,0.10)" : "transparent",
                borderBottom: isActive ? `2px solid ${theme.colors.primary}` : "2px solid transparent",
                borderRadius: 0,
              })}
            >{l.label}</NavLink>
          ))}
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {user && (
            <div style={{ position: "relative" }}>
              <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }} style={iconBtn}>
                <Bell size={18} />
                {unread > 0 && (
                  <span className="ss-pulse-ring ss-badge-pop" style={{
                    position: "absolute", top: -4, right: -4, minWidth: 20, height: 20, borderRadius: 10,
                    background: theme.gradient, color: "#fff", fontSize: 10, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px",
                  }}>{unread}</span>
                )}
              </button>
              {notifOpen && (
                <div className="ss-fade-up" style={{
                  position: "absolute", top: 50, right: 0, width: 340, maxHeight: 420, overflow: "auto",
                  background: "#FFFFFF",
                  borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`,
                  padding: 12, boxShadow: theme.shadowSoft,
                }}>
                  <div style={{ fontFamily: theme.fonts.heading, fontSize: 20, padding: "8px 12px 12px", color: theme.colors.primaryDark }}>Notifications</div>
                  {notifications.length === 0 && <div style={{ padding: 20, textAlign: "center", color: theme.colors.textDim }}>No notifications yet</div>}
                  {notifications.map((n) => (
                    <div key={n.id} style={{ padding: 12, borderRadius: 10, background: theme.colors.surfaceAlt, marginBottom: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</div>
                      <div style={{ fontSize: 13, color: theme.colors.textDim, marginTop: 2 }}>{n.message}</div>
                      <div style={{ fontSize: 10, fontFamily: theme.fonts.mono, color: theme.colors.textDim, marginTop: 6 }}>
                        {new Date(n.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Link to="/cart" style={iconBtn}>
            <ShoppingBag size={18} />
            {count > 0 && (
              <span key={count} className="ss-badge-pop" style={{
                position: "absolute", top: -4, right: -4, minWidth: 20, height: 20, borderRadius: 10,
                background: theme.gradient, color: "#fff", fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px",
              }}>{count}</span>
            )}
          </Link>

          {user ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setUserOpen(!userOpen)} style={{
                width: 42, height: 42, borderRadius: 12, background: theme.gradient,
                color: "#fff", fontWeight: 700, border: "none", cursor: "pointer",
                boxShadow: theme.shadow,
              }}>
                {(user.email || "U")[0].toUpperCase()}
              </button>
              {userOpen && (
                <div className="ss-fade-up" style={{
                  position: "absolute", top: 50, right: 0, width: 240,
                  background: "#FFFFFF",
                  borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`,
                  padding: 8, boxShadow: theme.shadowSoft,
                }}>
                  <div style={{ padding: 12, borderBottom: `1px solid ${theme.colors.border}` }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text }}>{user.email}</div>
                    <div style={{ fontFamily: theme.fonts.mono, fontSize: 10, color: theme.colors.primary, textTransform: "uppercase", marginTop: 4 }}>{role || "customer"}</div>
                  </div>
                  <MenuItem icon={<User size={16} />} label="Profile" onClick={() => { setUserOpen(false); nav("/profile"); }} />
                  <MenuItem icon={<ShoppingBag size={16} />} label="My Orders" onClick={() => { setUserOpen(false); nav("/orders"); }} />
                  {role === "admin" && (
                    <MenuItem icon={<LayoutDashboard size={16} />} label="Admin Dashboard" onClick={() => { setUserOpen(false); nav("/admin"); }} />
                  )}
                  {role === "delivery_partner" && (
                    <MenuItem icon={<Bike size={16} />} label="Delivery Dashboard" onClick={() => { setUserOpen(false); nav("/delivery"); }} />
                  )}
                  <MenuItem icon={<LogOut size={16} />} label="Sign Out" onClick={async () => { setUserOpen(false); await signOut(); nav("/"); }} />
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" style={{
              padding: "10px 18px", borderRadius: 14, background: theme.gradient,
              color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
              boxShadow: theme.shadow,
            }}>Sign In</Link>
          )}

          <button className="ss-mobile-only" onClick={() => setOpen(!open)} style={{ ...iconBtn, marginLeft: 4 }}>
            {open ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="ss-mobile-only ss-slide-in-left" style={{
          background: "#FFFFFF", borderTop: `1px solid ${theme.colors.border}`,
          padding: 12, display: "flex", flexDirection: "column", gap: 4,
        }}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                padding: "12px 14px", borderRadius: 10, textDecoration: "none",
                color: isActive ? theme.colors.primaryDark : theme.colors.text,
                background: isActive ? "rgba(76,175,80,0.10)" : "transparent",
                fontWeight: 600,
              })}
            >{l.label}</NavLink>
          ))}
        </div>
      )}
    </header>
  );
}

function MenuItem({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", borderRadius: 10, background: "transparent",
      border: "none", cursor: "pointer", color: theme.colors.text, fontSize: 14,
      textAlign: "left",
    }}
      onMouseOver={(e) => (e.currentTarget.style.background = theme.colors.surfaceAlt)}
      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ color: theme.colors.primary }}>{icon}</span> {label}
    </button>
  );
}
