import { useParams, Link } from "react-router-dom";
import { theme } from "@/utils/theme";
import BackButton from "@/components/BackButton";
import { BLOGS } from "./Blog";
import { Calendar, Clock, User, Share2, Copy, Facebook, Twitter } from "lucide-react";
import { toast } from "sonner";

export default function BlogDetail() {
  const { blogId } = useParams();
  const blog = BLOGS.find((b) => b.id === blogId) || BLOGS[0];
  const related = BLOGS.filter((b) => b.id !== blog.id).slice(0, 3);

  const share = (kind) => {
    const url = window.location.href;
    if (kind === "copy") { navigator.clipboard.writeText(url); toast.success("Link copied!"); return; }
    const text = encodeURIComponent(blog.title);
    const u = encodeURIComponent(url);
    const map = {
      whatsapp: `https://wa.me/?text=${text}%20${u}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${u}`,
    };
    window.open(map[kind], "_blank");
  };

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 24px 80px" }}>
        <BackButton />
        <img src={blog.cover} alt={blog.title} style={{
          width: "100%", maxHeight: 500, objectFit: "cover",
          borderRadius: 20, marginTop: 24, border: `1px solid ${theme.colors.border}`,
        }} />
        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: "clamp(34px,5vw,52px)", color: theme.colors.text, margin: "28px 0 16px", lineHeight: 1.15 }}>
          {blog.title}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", color: theme.colors.textDim, marginBottom: 18, fontFamily: theme.fonts.mono, fontSize: 13 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: theme.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
              {blog.author[0]}
            </div>
            <span>{blog.author}</span>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={13} /> {new Date(blog.date).toLocaleDateString()}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} /> {blog.read} min read</span>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {[blog.category, "YUBI", "Farm Fresh"].map((t) => (
            <span key={t} style={{
              padding: "6px 12px", borderRadius: 999, background: "rgba(76,175,80,0.10)",
              color: theme.colors.primaryDark, fontSize: 12, fontWeight: 600, fontFamily: theme.fonts.mono,
            }}>#{t}</span>
          ))}
        </div>

        <div style={{ color: theme.colors.text, fontSize: 17, lineHeight: 1.8 }}>
          <p>{blog.excerpt}</p>
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: 30, color: theme.colors.primaryDark, marginTop: 32 }}>The story behind</h2>
          <p>
            At YUBI, every product begins on a farm. We work with growers across India to bring you ingredients
            picked at peak freshness and processed with care. This means traceability you can taste — and prices that
            actually support farmers.
          </p>
          <ul style={{ paddingLeft: 22, marginTop: 16 }}>
            <li>Sourced directly from partner farms</li>
            <li>Processed in small batches</li>
            <li>Sealed in tamper-proof packaging</li>
            <li>Delivered fresh to your door</li>
          </ul>
          <h3 style={{ fontFamily: theme.fonts.heading, fontSize: 24, color: theme.colors.text, marginTop: 28 }}>What's next</h3>
          <p>
            We're constantly expanding our catalog. Subscribe to our newsletter for monthly stories, recipes, and
            launch announcements straight from the YUBI team.
          </p>
        </div>

        {/* Share */}
        <div style={{ marginTop: 36, padding: 20, borderRadius: 16, background: theme.colors.surfaceAlt, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <Share2 size={20} color={theme.colors.primaryDark} />
          <strong style={{ color: theme.colors.text }}>Share this post:</strong>
          <ShareBtn onClick={() => share("whatsapp")} label="WhatsApp" />
          <ShareBtn onClick={() => share("facebook")} icon={<Facebook size={16} />} />
          <ShareBtn onClick={() => share("twitter")} icon={<Twitter size={16} />} />
          <ShareBtn onClick={() => share("copy")} icon={<Copy size={16} />} label="Copy" />
        </div>

        {/* Related */}
        <h2 style={{ fontFamily: theme.fonts.heading, fontSize: 32, color: theme.colors.text, marginTop: 56, marginBottom: 18 }}>Related Blogs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
          {related.map((r) => (
            <Link key={r.id} to={`/blog/${r.id}`} style={{ textDecoration: "none", color: "inherit" }} className="ss-hover-lift">
              <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: `1px solid ${theme.colors.border}` }}>
                <img src={r.cover} alt={r.title} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                <div style={{ padding: 14 }}>
                  <div style={{ fontFamily: theme.fonts.mono, fontSize: 10, color: theme.colors.primary, letterSpacing: 1 }}>{r.category.toUpperCase()}</div>
                  <div style={{ fontFamily: theme.fonts.heading, fontSize: 18, color: theme.colors.text, marginTop: 6, lineHeight: 1.25 }}>{r.title}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShareBtn({ onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 10,
      background: "#fff", border: `1px solid ${theme.colors.border}`,
      color: theme.colors.primaryDark, cursor: "pointer", display: "inline-flex",
      alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13,
    }}>{icon} {label}</button>
  );
}
