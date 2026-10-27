import { useState, useEffect } from "react";
import {
  X,
  Upload,
  Sparkles,
  Check,
  AlertCircle,
  Package,
  Plus,
  Trash2,
  Eye,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";
import { formatInr } from "@/lib/format";
import type { ProductDto } from "@/lib/store.functions";
import { ProductSchema, type ProductFormValues } from "@/lib/security";
import { addDatabaseProduct, updateDatabaseProduct } from "@/lib/database-service";

interface DynamicProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSaved: (product: ProductDto) => void;
  productToEdit?: ProductDto | null;
}

const PRESET_IMAGES = [
  { label: "Crimson Beetroot", url: "/images/card-beetroot.png" },
  { label: "Green Tea Serum", url: "/images/card-green.png" },
  { label: "Blueberry Moisturizer", url: "/images/product-blueberry.png" },
  { label: "Sunnykiss SPF 50", url: "/images/product-sunscreen.png" },
];

export function DynamicProductModal({
  isOpen,
  onClose,
  onProductSaved,
  productToEdit,
}: DynamicProductModalProps) {
  const isEditing = !!productToEdit;

  const [formData, setFormData] = useState<ProductFormValues>({
    name: "",
    slug: "",
    category: "serum",
    priceInr: 999,
    comparePriceInr: 1299,
    stock: 50,
    sizes: ["30ml"],
    imageUrl: "/images/card-beetroot.png",
    tagline: "",
    description: "",
    isNew: true,
    isActive: true,
  });

  const [sizeInput, setSizeInput] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    slug?: string;
    category?: string;
    priceInr?: string;
    stock?: string;
    imageUrl?: string;
    global?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customImageMode, setCustomImageMode] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        slug: productToEdit.slug,
        category: (productToEdit.category as any) || "serum",
        priceInr: productToEdit.priceInr,
        comparePriceInr: productToEdit.comparePriceInr || null,
        stock: productToEdit.stock,
        sizes: productToEdit.sizes || ["30ml"],
        imageUrl: productToEdit.imageUrl || "/images/card-beetroot.png",
        tagline: productToEdit.tagline || "",
        description: productToEdit.description || "",
        isNew: productToEdit.isNew ?? true,
        isActive: true,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        category: "serum",
        priceInr: 999,
        comparePriceInr: 1299,
        stock: 50,
        sizes: ["30ml"],
        imageUrl: "/images/card-beetroot.png",
        tagline: "",
        description: "",
        isNew: true,
        isActive: true,
      });
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  function handleNameChange(name: string) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : slug,
    }));
  }

  function handleAddSize() {
    if (!sizeInput.trim()) return;
    if (!formData.sizes.includes(sizeInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()],
      }));
    }
    setSizeInput("");
  }

  function handleRemoveSize(sizeToRemove: string) {
    if (formData.sizes.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== sizeToRemove),
    }));
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: event.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Zod schema validation
    const validation = ProductSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: { [key: string]: string } = {};
      for (const err of validation.error.errors) {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && productToEdit) {
        const updated = await updateDatabaseProduct(productToEdit.id, validation.data);
        if (updated) onProductSaved(updated);
      } else {
        const created = await addDatabaseProduct(validation.data);
        onProductSaved(created);
      }
      onClose();
    } catch (err: any) {
      setErrors({ global: err.message || "Failed to save product to database" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 text-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-slate-900 font-normal">
                {isEditing ? "Edit Botanical Formula" : "Add New Botanical Product"}
              </h3>
              <p className="text-[11px] text-slate-500">
                PostgreSQL SQL Database • Zod Validated • Live Storefront Sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {errors.global && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{errors.global}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 space-y-4">
              {/* Product Title */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mile Infinity Rosehip Radiance Oil"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none transition-all ${
                    errors.name ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-[#0f3d24]"
                  }`}
                />
                {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Slug and Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 block mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  />
                  {errors.slug && <p className="text-[10px] text-rose-500 mt-1">{errors.slug}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  >
                    <option value="cleanse">Cleanse (Face Wash)</option>
                    <option value="serum">Serum (Treatment)</option>
                    <option value="moisturizer">Moisturizer (Hydration)</option>
                    <option value="sunscreen">Sunscreen (SPF 50)</option>
                    <option value="treatment">Treatment (Active Ritual)</option>
                    <option value="bundle">Ritual Pair Bundle</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 block mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.priceInr}
                    onChange={(e) => setFormData({ ...formData, priceInr: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  />
                  {errors.priceInr && <p className="text-[10px] text-rose-500 mt-1">{errors.priceInr}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 block mb-1">
                    Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.comparePriceInr || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        comparePriceInr: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 block mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  />
                  {errors.stock && <p className="text-[10px] text-rose-500 mt-1">{errors.stock}</p>}
                </div>
              </div>

              {/* Volume Sizes */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 block mb-1">
                  Sizes / Volume Options
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {formData.sizes.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(s)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 50ml, 100ml"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold uppercase tracking-wider"
                  >
                    Add Size
                  </button>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 block mb-1">
                  Short Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gentle AHA & Mulberry daily cleansing infusion"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 block mb-1">
                  Ritual &amp; Botanical Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe active ingredients, skin feel, and ritual directions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24] resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-[#0f3d24] focus:ring-[#0f3d24]"
                  />
                  <span>Mark as "New Product"</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-[#0f3d24] focus:ring-[#0f3d24]"
                  />
                  <span>Publish &amp; Make Active in Store</span>
                </label>
              </div>
            </div>

            {/* Right Column: Image Selection & Live Preview */}
            <div className="lg:col-span-5 space-y-4">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 block">
                Product Image &amp; Artwork
              </label>

              {/* Presets Grid */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Pick Botanical Image Preset
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, imageUrl: img.url });
                        setCustomImageMode(false);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        formData.imageUrl === img.url
                          ? "border-[#0f3d24] bg-emerald-50/50 ring-1 ring-[#0f3d24]"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="h-8 w-8 rounded-lg object-cover" />
                      <span className="text-[11px] font-medium text-slate-800 line-clamp-1">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image / Upload Option */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Custom Image or File Upload
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomImageMode(!customImageMode)}
                    className="text-[11px] text-[#0f3d24] hover:underline"
                  >
                    {customImageMode ? "Use Presets" : "Enter Custom URL / Upload"}
                  </button>
                </div>

                {customImageMode && (
                  <div className="space-y-2 animate-in fade-in">
                    <input
                      type="text"
                      placeholder="https://example.com/product.jpg or /images/..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                    />
                    <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl bg-slate-50 cursor-pointer text-xs text-slate-600">
                      <Upload className="h-4 w-4 text-slate-400" />
                      <span>Upload local image file</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              {/* Live Preview Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Eye className="h-3 w-3 text-slate-400" />
                  Live Storefront Product Card Preview
                </span>

                <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm space-y-2">
                  <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden relative border border-slate-100">
                    <img
                      src={formData.imageUrl || "/images/card-green.png"}
                      alt={formData.name || "Preview"}
                      className="h-full w-full object-cover"
                    />
                    {formData.isNew && (
                      <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold text-[#0f3d24] uppercase tracking-wider shadow-sm">
                        New Product
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#b48326]">
                    {formData.category}
                  </span>
                  <h5 className="font-serif text-base text-slate-900 font-medium line-clamp-1">
                    {formData.name || "Untitled Botanical Formula"}
                  </h5>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {formData.tagline || "Gentle formulation for daily ritual"}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-serif text-lg font-bold text-slate-900">
                      {formatInr(formData.priceInr)}
                    </span>
                    {formData.comparePriceInr && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatInr(formData.comparePriceInr)}
                      </span>
                    )}
                  </div>

                  {/* Razorpay Button Preview */}
                  <div className="pt-2">
                    <div className="w-full py-2 px-3 rounded-lg bg-[#0c2340] text-white text-[11px] font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                      <span>Pay via Razorpay</span>
                      <span className="text-[9px] text-white/70">({formatInr(formData.priceInr)})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#0f3d24] hover:bg-[#092b19] active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving to Database...</span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>{isEditing ? "Save Changes" : "Save & Publish Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
