import { useState } from "react";
import { theme } from "@/utils/theme";
import BackButton from "@/components/BackButton";
import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SERVICES = ["Order Support", "Spice Enquiry", "Agro Products", "Bulk Orders", "General"];

export default function Contact() {
  const [service, setService] = useState("Order Support");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Order Support enquiry", message: "" });
  const [loading, setLoading] = useState(false);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // EmailJS integration placeholder — connect with EmailJS keys later.
    // import emailjs from 'emailjs-com';
    // await emailjs.send(SERVICE_ID, TEMPLATE_ID, { ...form, service }, USER_ID);
    try {
      await new Promise((r) => setTimeout(r, 1100));
      toast.success("Your message has been sent! We'll reply within 24 hours.");
      setForm({ name: "", email: "", phone: "", subject: `${service} enquiry`, message: "" });
    } catch (err) {
      toast.error("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <BackButton />
          <div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 11, color: theme.colors.primary, letterSpacing: 2 }}>YUBI / CONTACT</div>
            <h1 style={{ fontFamily: theme.fonts.heading, fontSize: "clamp(36px,5vw,56px)", color: theme.colors.text, margin: "4px 0 0" }}>Get in Touch with YUBI</h1>
          </div>
        </div>

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginTop: 32 }}>
          <InfoCard icon={<MapPin />} label="Address" value="YUBI HQ, Green Valley, Bengaluru, India 560001" />
          <InfoCard icon={<Phone />} label="Phone" value="+91 98765 43210" />
          <InfoCard icon={<Mail />} label="Email" value="hello@yubi.com" />
        </div>

        <div style={{ marginTop: 24, padding: "16px 22px", borderRadius: 14, background: theme.colors.surfaceAlt, color: theme.colors.text, fontSize: 14 }}>
          <strong style={{ color: theme.colors.primaryDark }}>Business hours:</strong> Mon–Sat · 9:00 AM – 8:00 PM IST
        </div>

        <div style={{ marginTop: 28, borderRadius: 20, overflow: "hidden", border: `1px solid ${theme.colors.border}` }}>
          <iframe
            title="YUBI location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31108.5!2d77.59!3d12.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s!5e0!3m2!1sen!2sin!4v1700000000000"
            width="100%" height="320" style={{ border: 0 }} loading="lazy"
          />
        </div>

        {/* Bottom — service form */}
        <div style={{ marginTop: 64 }}>
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: 40, color: theme.colors.text, margin: 0 }}>Contact Our Services</h2>
          <p style={{ color: theme.colors.textDim, fontSize: 16, marginTop: 8 }}>
            Have a question about your order, spices, or agro products? We're here to help.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
            {SERVICES.map((s) => {
              const active = service === s;
              return (
                <button key={s} onClick={() => { setService(s); upd("subject", `${s} enquiry`); }} style={{
                  padding: "10px 18px", borderRadius: 999, fontWeight: 600, fontSize: 14, cursor: "pointer",
                  border: `2px solid ${active ? theme.colors.primary : theme.colors.border}`,
                  background: active ? theme.gradient : "#fff",
                  color: active ? "#fff" : theme.colors.text,
                  fontFamily: theme.fonts.body, transition: theme.transition,
                }}>{s}</button>
              );
            })}
          </div>

          <form onSubmit={submit} style={{ marginTop: 24, background: "#fff", padding: 28, borderRadius: 20, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadowSoft }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 14 }}>
              <Field label="Full Name"><input required value={form.name} onChange={(e) => upd("name", e.target.value)} style={input} /></Field>
              <Field label="Email Address"><input required type="email" value={form.email} onChange={(e) => upd("email", e.target.value)} style={input} /></Field>
              <Field label="Phone Number"><input value={form.phone} onChange={(e) => upd("phone", e.target.value)} style={input} /></Field>
              <Field label="Subject"><input required value={form.subject} onChange={(e) => upd("subject", e.target.value)} style={input} /></Field>
            </div>
            <Field label="Message">
              <textarea required value={form.message} onChange={(e) => upd("message", e.target.value)}
                style={{ ...input, minHeight: 140, resize: "vertical", fontFamily: theme.fonts.body }} />
            </Field>
            <button type="submit" disabled={loading} style={{
              marginTop: 8, width: "100%", padding: "14px 18px", borderRadius: 14,
              background: theme.gradient, color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
              fontSize: 15, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: theme.shadow, opacity: loading ? 0.7 : 1,
            }}>
              {loading ? <><Loader2 size={18} className="ss-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="ss-hover-lift" style={{ background: "#fff", padding: 22, borderRadius: 20, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadowSoft }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: theme.gradientSoft, color: theme.colors.primaryDark, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        {icon}
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: 11, color: theme.colors.primaryDark, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</div>
      <div style={{ color: theme.colors.text, fontSize: 15, fontWeight: 600, marginTop: 6, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginTop: 14 }}>
      <label style={{ display: "block", fontWeight: 600, color: theme.colors.primaryDark, marginBottom: 6, fontSize: 13 }}>{label}</label>
      {children}
    </div>
  );
}

const input = { width: "100%", padding: "11px 13px", borderRadius: 10, border: `1px solid ${theme.colors.border}`, fontSize: 14, background: "#fff", color: theme.colors.text, outline: "none", fontFamily: theme.fonts.body, transition: theme.transition };
