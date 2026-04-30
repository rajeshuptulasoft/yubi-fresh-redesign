// Centralized theme + helper style tokens (used inline across the app)
export const theme = {
  colors: {
    bg: "#0D0D0D",
    surface: "#1A1A1A",
    surfaceAlt: "#141414",
    accent: "#F4A623",
    accent2: "#E85D04",
    text: "#FFFFFF",
    textDim: "#A0A0A0",
    success: "#22C55E",
    error: "#EF4444",
    border: "#2A2A2A",
  },
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'DM Sans', system-ui, -apple-system, sans-serif",
    mono: "'Space Mono', ui-monospace, monospace",
  },
  gradient: "linear-gradient(135deg, #F4A623 0%, #E85D04 100%)",
  gradientSoft: "linear-gradient(135deg, rgba(244,166,35,0.15) 0%, rgba(232,93,4,0.15) 100%)",
  shadow: "0 10px 40px -10px rgba(244, 166, 35, 0.35)",
  shadowSoft: "0 8px 30px rgba(0,0,0,0.4)",
  glass: {
    background: "rgba(26, 26, 26, 0.6)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(244, 166, 35, 0.12)",
  },
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "24px", pill: "999px" },
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

export const fmtPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
