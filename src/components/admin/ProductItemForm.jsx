import { useRef, useState } from "react";
import { ImagePlus, Minus, Plus } from "lucide-react";

const foodCategories = ["All Food", "Breakfast", "Lunch", "Dinner", "Snacks", "Beverages", "Desserts"];
const spiceCategories = ["All Spices", "Whole Spices", "Ground Spices", "Spice Blends", "Seeds", "Leaves"];
const defaultVariantRows = [
  { weight: "100g", stock: 25 },
  { weight: "250g", stock: 25 },
  { weight: "500g", stock: 15 },
];

const blankForm = (type, initial = {}) => ({
  name: initial.name || "",
  price: initial.price || "",
  bulkPrice: initial.bulkPrice || "",
  description: initial.description || "",
  category: initial.foodCategory || initial.spiceCategory || (type === "food" ? "All Food" : "All Spices"),
  badge: initial.badge || "",
  image: initial.image || "",
  isVeg: initial.isVeg !== false,
  isOrganic: Boolean(initial.isOrganic || initial.badge === "Organic"),
  inStock: initial.inStock !== false,
  variants: initial.variants?.length
    ? initial.variants
    : type === "spices"
      ? (initial.sizes || [initial.unit || "250g"]).map((weight, index) => ({ weight, stock: index === 0 ? 8 : 25 }))
      : defaultVariantRows,
});

export default function ProductItemForm({ type = "food", initialItem, submitLabel = "Save Item", onSubmit, onCancel }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState(() => blankForm(type, initialItem));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const categories = type === "food" ? foodCategories : spiceCategories;

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateVariant = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)),
    }));
  };

  const addVariant = () => update("variants", [...form.variants, { weight: "", stock: 0 }]);
  const removeVariant = (index) => update("variants", form.variants.filter((_, i) => i !== index));

  const uploadImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => update("image", reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next = {};
    ["name", "price", "description", "category"].forEach((field) => {
      if (!String(form[field] || "").trim()) next[field] = "This field is required";
    });
    if (Number(form.price) <= 0) next.price = "Enter a valid price";
    if (!form.image) next.image = "Product image is required";
    if (type === "spices") {
      const hasEmptyVariant = form.variants.some((variant) => !String(variant.weight || "").trim() || Number(variant.stock) < 0);
      if (!form.variants.length || hasEmptyVariant) next.variants = "Add valid weight and stock for every variant";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setApiError("");
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...initialItem,
      name: form.name.trim(),
      description: form.description.trim(),
      category: type === "food" ? "food" : "spices",
      foodCategory: type === "food" ? form.category : undefined,
      spiceCategory: type === "spices" ? form.category : undefined,
      price: Number(form.price),
      bulkPrice: type === "spices" && form.bulkPrice ? Number(form.bulkPrice) : undefined,
      image: form.image,
      badge: form.badge.trim(),
      isVeg: type === "food" ? form.isVeg : undefined,
      isOrganic: type === "spices" ? form.isOrganic : undefined,
      inStock: form.inStock,
      variants: type === "spices" ? form.variants.map((variant) => ({ weight: variant.weight.trim(), stock: Number(variant.stock) })) : undefined,
      sizes: type === "spices" ? form.variants.map((variant) => variant.weight.trim()) : undefined,
      unit: type === "spices" ? form.variants[0]?.weight : initialItem?.unit || "1 portion",
    };
    try {
      await onSubmit(payload);
    } catch (error) {
      setApiError(error?.message || error?.error || "Unable to save item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="admin-product-form">
      {apiError && <div className="admin-form-error">{apiError}</div>}
      <FormField label="Name" error={errors.name}>
        <input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder={`${type === "food" ? "Food" : "Spice"} item name`} />
      </FormField>
      <FormField label="Category" error={errors.category}>
        <select value={form.category} onChange={(event) => update("category", event.target.value)}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </FormField>
      <div className="admin-form-grid">
        <FormField label="Price" error={errors.price}>
          <input type="number" min="1" value={form.price} onChange={(event) => update("price", event.target.value)} placeholder="0" />
        </FormField>
        {type === "spices" && (
          <FormField label="Bulk Price">
            <input type="number" min="0" value={form.bulkPrice} onChange={(event) => update("bulkPrice", event.target.value)} placeholder="Optional" />
          </FormField>
        )}
      </div>
      <FormField label="Description" error={errors.description}>
        <textarea value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Describe ingredients, origin, taste, or usage" />
      </FormField>
      <FormField label="Badge">
        <input value={form.badge} onChange={(event) => update("badge", event.target.value)} placeholder="Bestseller, Organic, New" />
      </FormField>
      {type === "spices" ? (
        <FormField label="Weight Variant Stock" error={errors.variants}>
          <div className="variant-editor">
            {form.variants.map((variant, index) => (
              <div className="variant-editor__row" key={`${variant.weight}-${index}`}>
                <input value={variant.weight} onChange={(event) => updateVariant(index, "weight", event.target.value)} placeholder="100g" aria-label="Variant weight" />
                <input type="number" min="0" value={variant.stock} onChange={(event) => updateVariant(index, "stock", event.target.value)} placeholder="Stock" aria-label="Variant stock" />
                <button type="button" className="icon-only-btn" onClick={() => removeVariant(index)} aria-label="Remove variant"><Minus size={16} /></button>
              </div>
            ))}
            <button type="button" className="admin-add-btn admin-add-btn--soft" onClick={addVariant}><Plus size={16} /> Add Variant</button>
          </div>
        </FormField>
      ) : (
        <div className="admin-form-grid">
          <Toggle label="Veg Item" checked={form.isVeg} onChange={(value) => update("isVeg", value)} />
          <Toggle label="In Stock" checked={form.inStock} onChange={(value) => update("inStock", value)} />
        </div>
      )}
      {type === "spices" && (
        <div className="admin-form-grid">
          <Toggle label="Organic" checked={form.isOrganic} onChange={(value) => update("isOrganic", value)} />
          <Toggle label="In Stock" checked={form.inStock} onChange={(value) => update("inStock", value)} />
        </div>
      )}
      <FormField label="Image" error={errors.image}>
        <button type="button" className="image-picker" onClick={() => fileRef.current?.click()}>
          {form.image ? <img src={form.image} alt="Selected product preview" /> : <><ImagePlus size={28} /> Upload product image</>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} hidden />
      </FormField>
      <div className="admin-form-actions">
        <button type="button" className="admin-secondary-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="admin-add-btn" disabled={saving}>{saving ? "Saving..." : submitLabel}</button>
      </div>
    </form>
  );
}

function FormField({ label, error, children }) {
  return <label className="admin-form-field"><span>{label}</span>{children}{error && <small>{error}</small>}</label>;
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="admin-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
