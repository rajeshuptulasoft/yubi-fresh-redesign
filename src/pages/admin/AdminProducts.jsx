import { useState } from "react";
import { theme, fmtPrice } from "@/utils/theme";
import { Card, Button, Input, Badge, Modal } from "@/components/UI";
import { FOODS, SPICES } from "@/utils/catalog";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminProducts() {
  const [products, setProducts] = useState([
    ...FOODS.map((f) => ({ ...f, type: "Food", inStock: true })),
    ...SPICES.map((s) => ({ ...s, type: "Spice", price: s.basePrice, inStock: true })),
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Curries", price: "", desc: "", emoji: "🍛" });

  const add = () => {
    if (!form.name) return toast.error("Name required");
    setProducts([{ id: `n${Date.now()}`, ...form, price: Number(form.price), inStock: true, type: "Food", rating: 4.5 }, ...products]);
    toast.success("Product added (demo — not persisted)");
    setModalOpen(false);
    setForm({ name: "", category: "Curries", price: "", desc: "", emoji: "🍛" });
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "30px 24px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 36, margin: 0 }}>Products</h1>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Add Product</Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {products.map((p) => (
          <Card key={p.id} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ height: 110, background: theme.gradientSoft, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{p.emoji}</div>
            <div style={{ padding: 14 }}>
              <Badge color={p.type === "Food" ? theme.colors.accent : theme.colors.success}>{p.type}</Badge>
              <div style={{ fontFamily: theme.fonts.heading, fontWeight: 600, marginTop: 8 }}>{p.name}</div>
              <div style={{ fontFamily: theme.fonts.mono, color: theme.colors.accent, fontWeight: 700, marginTop: 4 }}>{fmtPrice(p.price)}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <Button size="sm" variant="ghost" style={{ flex: 1 }}><Edit2 size={12} /> Edit</Button>
                <Button size="sm" variant="ghost" style={{ color: theme.colors.error, borderColor: theme.colors.error }}
                  onClick={() => { setProducts(products.filter((x) => x.id !== p.id)); toast.success("Removed"); }}>
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 style={{ fontFamily: theme.fonts.heading, marginTop: 0 }}>Add Product</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Description" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
          <Input placeholder="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input placeholder="Emoji icon" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
          <Button onClick={add} size="lg">Add Product</Button>
        </div>
      </Modal>
    </div>
  );
}
