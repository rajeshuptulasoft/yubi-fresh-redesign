import { useState } from "react";
import { theme } from "@/utils/theme";
import BackButton from "@/components/BackButton";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

const SEED = [
  { id: "1", title: "5 Heirloom Spices That Define South Indian Cuisine", category: "Spice Tips", status: "Published", date: "2026-04-12" },
  { id: "2", title: "Inside the YUBI Kitchen: A Day in the Life", category: "Company News", status: "Published", date: "2026-04-02" },
  { id: "3", title: "Rainy-Day Khichdi with Roasted Cumin", category: "Recipes", status: "Draft", date: "2026-03-28" },
];

export default function AdminBlog() {
  const [blogs, setBlogs] = useState(SEED);
  const [editing, setEditing] = useState(null); // null | {} | blog
  const [confirmDel, setConfirmDel] = useState(null);

  const save = (b) => {
    if (b.id) setBlogs((arr) => arr.map((x) => (x.id === b.id ? b : x)));
    else setBlogs((arr) => [...arr, { ...b, id: String(Date.now()) }]);
    setEditing(null);
    toast.success("Blog saved");
  };

  const del = (id) => {
    setBlogs((arr) => arr.filter((x) => x.id !== id));
    setConfirmDel(null);
    toast.success("Blog deleted");
  };

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <BackButton />
            <div>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: 11, color: theme.colors.primary, letterSpacing: 2 }}>ADMIN / BLOG</div>
              <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 40, color: theme.colors.text, margin: "4px 0 0" }}>Manage Blog</h1>
            </div>
          </div>
          <button onClick={() => setEditing({ title: "", category: "Recipes", status: "Draft", date: new Date().toISOString().slice(0, 10), content: "" })}
            style={primaryBtn}>
            <Plus size={16} /> Create New Blog
          </button>
        </div>

        <div style={{ marginTop: 28, background: "#fff", borderRadius: 20, border: `1px solid ${theme.colors.border}`, overflow: "hidden", boxShadow: theme.shadowSoft }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: theme.colors.surfaceAlt }}>
                {["Title", "Category", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "14px 18px", fontFamily: theme.fonts.mono, fontSize: 11, letterSpacing: 1, color: theme.colors.primaryDark }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.id} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                  <td style={{ padding: "14px 18px", fontWeight: 600, color: theme.colors.text }}>{b.title}</td>
                  <td style={{ padding: "14px 18px", color: theme.colors.textDim }}>{b.category}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700,
                      background: b.status === "Published" ? "rgba(76,175,80,0.15)" : "rgba(255,111,0,0.15)",
                      color: b.status === "Published" ? theme.colors.primaryDark : "#BF360C",
                    }}>{b.status}</span>
                  </td>
                  <td style={{ padding: "14px 18px", color: theme.colors.textDim, fontFamily: theme.fonts.mono, fontSize: 13 }}>{b.date}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <button onClick={() => setEditing(b)} style={iconBtn}><Edit2 size={14} /></button>
                    <button onClick={() => setConfirmDel(b)} style={{ ...iconBtn, color: theme.colors.error, marginLeft: 8 }}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && <BlogEditor blog={editing} onClose={() => setEditing(null)} onSave={save} />}
      {confirmDel && (
        <Modal onClose={() => setConfirmDel(null)} title="Delete blog?">
          <p style={{ color: theme.colors.textDim }}>This cannot be undone. "{confirmDel.title}" will be removed permanently.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
            <button style={secondaryBtn} onClick={() => setConfirmDel(null)}>Cancel</button>
            <button style={{ ...primaryBtn, background: theme.colors.error }} onClick={() => del(confirmDel.id)}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function BlogEditor({ blog, onClose, onSave }) {
  const [form, setForm] = useState({ ...blog });
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (status) => {
    if (!form.title.trim()) { toast.error("Title required"); return; }
    onSave({ ...form, status });
  };
  return (
    <Modal onClose={onClose} title={blog.id ? "Edit Blog" : "Create New Blog"} wide>
      <Field label="Title">
        <input value={form.title} onChange={(e) => upd("title", e.target.value)} style={input} />
      </Field>
      <Field label="Category">
        <select value={form.category} onChange={(e) => upd("category", e.target.value)} style={input}>
          {["Recipes", "Farming", "Spice Tips", "Company News"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Cover Image URL">
        <input value={form.cover || ""} onChange={(e) => upd("cover", e.target.value)} style={input} placeholder="https://..." />
      </Field>
      <Field label="Content (Markdown supported)">
        <textarea value={form.content || ""} onChange={(e) => upd("content", e.target.value)} rows={10} style={{ ...input, resize: "vertical", fontFamily: theme.fonts.mono }} />
      </Field>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18, flexWrap: "wrap" }}>
        <button style={secondaryBtn} onClick={() => submit("Draft")}>Save Draft</button>
        <button style={primaryBtn} onClick={() => submit("Published")}>Publish</button>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose, title, wide }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(26,46,26,0.55)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="ss-fade-up" style={{
        background: "#fff", borderRadius: 20, padding: 24, maxWidth: wide ? 720 : 460, width: "100%",
        maxHeight: "90vh", overflow: "auto", border: `1px solid ${theme.colors.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: 26, color: theme.colors.text, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: theme.colors.textDim }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontWeight: 600, color: theme.colors.primaryDark, marginBottom: 6, fontSize: 13 }}>{label}</label>
      {children}
    </div>
  );
}

const input = { width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${theme.colors.border}`, fontSize: 14, background: "#fff", color: theme.colors.text, outline: "none", fontFamily: theme.fonts.body };
const primaryBtn = { display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 14, background: theme.gradient, color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: theme.shadow };
const secondaryBtn = { display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 14, background: "#fff", color: theme.colors.primaryDark, border: `2px solid ${theme.colors.primary}`, cursor: "pointer", fontWeight: 700, fontSize: 14 };
const iconBtn = { width: 34, height: 34, borderRadius: 10, background: theme.colors.surfaceAlt, border: "none", cursor: "pointer", color: theme.colors.primaryDark, display: "inline-flex", alignItems: "center", justifyContent: "center" };
