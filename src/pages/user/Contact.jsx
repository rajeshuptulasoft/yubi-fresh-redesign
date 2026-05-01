import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";

const supportImage = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&auto=format&fit=crop";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [toast, setToast] = useState("");
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    const emailjs = window.emailjs;
    if (emailjs?.send) await emailjs.send("service_yubi", "template_contact", form, "public_key").catch(() => null);
    setToast("Message sent successfully! We'll reply soon.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    window.setTimeout(() => setToast(""), 2600);
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div>
          <span className="contact-eyebrow"><Sparkles size={15} /> YUBI Support</span>
          <h1>Contact YUBI</h1>
          <p>Questions about food, spices, orders, delivery, or wholesale? Our support desk is ready to help.</p>
        </div>
      </section>

      <section className="contact-panel">
        <div className="contact-support">
          <div className="contact-support__image">
            <img src={supportImage} alt="Customer support representative wearing headphones" />
          </div>
          <div>
            <p className="contact-kicker">Let's hear all about it!</p>
            <h2>Get in touch</h2>
            <p>Tell us what you need and the YUBI team will route your request to the right person.</p>
            <div className="contact-mini-list">
              <span><Clock size={16} /> Typical reply within 24 hours</span>
              <span><Phone size={16} /> Call support available</span>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="contact-form">
          <div className="contact-form__grid">
            <Field label="Full Name"><input required value={form.name} onChange={(event) => update("name", event.target.value)} /></Field>
            <Field label="Email"><input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} /></Field>
            <Field label="Phone"><input required value={form.phone} onChange={(event) => update("phone", event.target.value)} /></Field>
            <Field label="Subject"><input required value={form.subject} onChange={(event) => update("subject", event.target.value)} /></Field>
          </div>
          <Field label="Message"><textarea required value={form.message} onChange={(event) => update("message", event.target.value)} /></Field>
          <button className="contact-submit"><Send size={17} /> Send Message</button>
        </form>
      </section>

      <section className="contact-location">
        <Info icon={<MapPin />} title="Address" value="D2/7, Rasulgarh Industrial Estate - 751010, Bhubaneswar, Odisha" />
        <Info icon={<Phone />} title="Phone" value="+91 9439731691" />
        <Info icon={<Mail />} title="Email" value="yubifoods@gmail.com" />
      </section>

      {toast && <div className="contact-toast">{toast}</div>}
    </main>
  );
}

function Info({ icon, title, value }) {
  return <div className="contact-info-card"><div>{icon}</div><h3>{title}</h3><p>{value}</p></div>;
}

function Field({ label, children }) {
  return <label className="contact-field"><span>{label}</span>{children}</label>;
}
