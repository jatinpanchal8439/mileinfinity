import { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  CreditCard,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  IndianRupee,
  Package,
  Layers,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { formatInr } from "@/lib/format";
import type { ProductDto } from "@/lib/store.functions";
import { ProductSchema, type ProductFormValues } from "@/lib/security";
import { addDatabaseProduct } from "@/lib/database-service";

interface AddProductPanelProps {
  onProductCreated: (newProduct: ProductDto) => void;
  onViewCatalog: () => void;
}

const PRESET_BOTANICAL_IMAGES = [
  { label: "Crimson Beetroot", url: "/images/card-beetroot.png", category: "serum" },
  { label: "Green Tea Elixir", url: "/images/card-green.png", category: "toner" },
  { label: "Blueberry Bliss", url: "/images/product-blueberry.png", category: "moisturizer" },
  { label: "Sunnykiss SPF 50", url: "/images/product-sunscreen.png", category: "sunscreen" },
  { label: "Matcha Radiance", url: "/images/product-matcha.png", category: "mask" },
  { label: "Lavender Soothe", url: "/images/product-lavender.png", category: "cleanser" },
];

export function AddProductPanel({ onProductCreated, onViewCatalog }: AddProductPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("serum");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [priceInr, setPriceInr] = useState<number>(999);
  const [comparePriceInr, setComparePriceInr] = useState<number>(1299);
  const [stock, setStock] = useState<number>(50);
  const [sizes, setSizes] = useState<string[]>(["50ml"]);
  const [sizeInput, setSizeInput] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("/images/card-beetroot.png");
  const [imageSourceMode, setImageSourceMode] = useState<"upload" | "preset" | "url">("upload");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [isNew, setIsNew] = useState(true);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    slug?: string;
    category?: string;
    priceInr?: string;
    stock?: string;
    imageUrl?: string;
    global?: string;
  }>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-generate slug on name change
  function handleNameChange(val: string) {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(autoSlug);
  }

  // Handle local photo file upload
  function handleFileSelected(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
        setImageSourceMode("upload");
      }
    };
    reader.readAsDataURL(file);
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  }

  function handleAddSize() {
    if (!sizeInput.trim()) return;
    if (!sizes.includes(sizeInput.trim())) {
      setSizes([...sizes, sizeInput.trim()]);
    }
    setSizeInput("");
  }

  function handleRemoveSize(sToRemove: string) {
    if (sizes.length <= 1) return;
    setSizes(sizes.filter((s) => s !== sToRemove));
  }

  function handleReset() {
    setName("");
    setSlug("");
    setCategory("serum");
    setTagline("");
    setDescription("");
    setPriceInr(999);
    setComparePriceInr(1299);
    setStock(50);
    setSizes(["50ml"]);
    setImageUrl("/images/card-beetroot.png");
    setImageSourceMode("upload");
    setCustomUrlInput("");
    setErrors({});
    setSuccessMsg(null);
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSuccessMsg(null);

    const formData: ProductFormValues = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: category as any,
      tagline: tagline.trim() || undefined,
      description: description.trim() || undefined,
      priceInr: Number(priceInr),
      comparePriceInr: comparePriceInr ? Number(comparePriceInr) : null,
      stock: Number(stock),
      sizes,
      imageUrl,
      isNew,
      isActive: true,
    };

    // Zod Validation
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
      const created = await addDatabaseProduct(validation.data);
      onProductCreated(created);
      setSuccessMsg(`"${created.name}" is now published and available on storefront!`);
      // Scroll to top or show success banner
      setTimeout(() => {
        handleReset();
      }, 1500);
    } catch (err: any) {
      setErrors({ global: err.message || "Failed to publish product" });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Savings calculation
  const discountPercent =
    comparePriceInr && comparePriceInr > priceInr
      ? Math.round(((comparePriceInr - priceInr) / comparePriceInr) * 100)
      : 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Title & Quick Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#0f3d24]" />
            Add New Product to Store
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in product details, upload botanical packaging photo, and publish directly to catalog
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Form</span>
          </button>
          <button
            type="button"
            onClick={onViewCatalog}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>View Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={onViewCatalog}
            className="underline hover:text-emerald-900 font-bold ml-4"
          >
            Go to Catalog &rarr;
          </button>
        </div>
      )}

      {errors.global && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.global}</span>
        </div>
      )}

      <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: PRODUCT DETAILS & IMAGE UPLOAD (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Core Details */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
              1. Basic Product Information
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mile Infinity Rose Petal Hydrating Dew"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24] focus:ring-1 focus:ring-[#0f3d24] transition-all"
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24] cursor-pointer"
                >
                  <option value="cleanser">Cleansers</option>
                  <option value="toner">Toners & Mists</option>
                  <option value="moisturizer">Moisturizers & Creams</option>
                  <option value="serum">Active Serums</option>
                  <option value="sunscreen">Sunscreens (SPF 50)</option>
                  <option value="mask">Clay & Sheet Masks</option>
                  <option value="bundle">Ritual Sets & Bundles</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  URL Handle (Slug)
                </label>
                <input
                  type="text"
                  placeholder="auto-generated-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-700 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ritual Step / Tagline (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Step 02: Awaken & Hydrate with Damask Rose"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description &amp; Key Botanical Actives
              </label>
              <textarea
                rows={3}
                placeholder="Formulated with hand-harvested botanical extracts, hyaluronic acid, and cold-pressed seed oils..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24] resize-none"
              />
            </div>
          </div>

          {/* Card 2: Photo Upload Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  2. Product Photo &amp; Packaging Image *
                </h3>
                <p className="text-xs text-slate-500">
                  Upload your actual bottle/jar photo or choose from clean botanical presets
                </p>
              </div>

              {/* Source Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setImageSourceMode("upload")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    imageSourceMode === "upload"
                      ? "bg-white text-slate-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageSourceMode("preset")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    imageSourceMode === "preset"
                      ? "bg-white text-slate-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Presets Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setImageSourceMode("url")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    imageSourceMode === "url"
                      ? "bg-white text-slate-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {/* Mode A: Drag & Drop File Upload */}
            {imageSourceMode === "upload" && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-[#0f3d24] bg-emerald-50/50 scale-[1.01]"
                    : "border-slate-300 hover:border-[#0f3d24] hover:bg-slate-50/80"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-[#0f3d24] flex items-center justify-center mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Click to browse product photo, or drag and drop here
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PNG, JPG, or WEBP (Recommended transparent or white background)
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Instant high-res preview on storefront card</span>
                </div>
              </div>
            )}

            {/* Mode B: Botanical Preset Gallery */}
            {imageSourceMode === "preset" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Select a pre-rendered high-definition botanical packaging mockup:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {PRESET_BOTANICAL_IMAGES.map((preset) => {
                    const isSelected = imageUrl === preset.url;
                    return (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#0f3d24] bg-emerald-50/80 ring-2 ring-[#0f3d24]"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <div className="w-14 h-14 rounded-lg bg-white overflow-hidden flex items-center justify-center p-1 border border-slate-100">
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-800 text-center leading-tight">
                          {preset.label}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#0f3d24] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode C: Custom URL */}
            {imageSourceMode === "url" && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  External Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/images/product-bottle.jpg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrlInput.trim()) setImageUrl(customUrlInput.trim());
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#0f3d24] text-white text-xs font-semibold"
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            )}

            {/* Active Image Indicator */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-0.5 overflow-hidden shrink-0">
                  <img src={imageUrl} alt="Active" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block">Selected Photo Active</span>
                  <span className="text-[11px] text-slate-500 truncate block max-w-xs">
                    {imageUrl.startsWith("data:") ? "Local File (base64 encoded)" : imageUrl}
                  </span>
                </div>
              </div>
              <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Ready
              </span>
            </div>
          </div>

          {/* Card 3: Pricing & Inventory */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
              3. Pricing &amp; Inventory Management
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Selling Price (₹ INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={priceInr}
                    onChange={(e) => setPriceInr(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  />
                </div>
                {errors.priceInr && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.priceInr}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Compare at Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={comparePriceInr}
                    onChange={(e) => setComparePriceInr(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-mono text-slate-700 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Starting Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                />
              </div>
            </div>

            {/* Live Discount Pill */}
            {discountPercent > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between">
                <span>
                  Promotional Deal: Customer saves ₹{comparePriceInr - priceInr} ({discountPercent}%
                  OFF)
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[11px]">
                  {discountPercent}% OFF BADGE ACTIVE
                </span>
              </div>
            )}

            {/* Sizes / Volumes Manager */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Available Bottle Sizes / Volumes (e.g. 30ml, 50ml, 100ml)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {sizes.map((sz) => (
                  <span
                    key={sz}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
                  >
                    <span>{sz}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(sz)}
                      className="text-slate-400 hover:text-rose-600"
                      title="Remove size"
                    >
                      ✕
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="e.g. 100ml"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSize();
                      }
                    }}
                    className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Toggle: New Arrival */}
            <div className="pt-2 flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0f3d24] focus:ring-[#0f3d24]"
                />
                <span>Display &quot;New Botanical Ritual&quot; badge on storefront</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY LIVE STOREFRONT PREVIEW (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#0f3d24]" />
                  Live Storefront Preview
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                  Real-time
                </span>
              </div>

              {/* Product Card Replica */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow group">
                <div className="relative aspect-square w-full bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={name || "Product preview"}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  {isNew && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#0f3d24] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      New
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#c49838] text-slate-900 text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    <span>{category}</span>
                    <span>{sizes[0] || "50ml"}</span>
                  </div>

                  <h5 className="font-serif text-base font-bold text-slate-900 line-clamp-1">
                    {name || "Botanical Ritual Product Title"}
                  </h5>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {tagline ||
                      description ||
                      "Clean botanical formulation, designed for everyday radiance."}
                  </p>

                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="font-serif text-lg font-bold text-slate-900">
                      ₹{priceInr.toLocaleString("en-IN")}
                    </span>
                    {comparePriceInr > priceInr && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{comparePriceInr.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Razorpay Button Simulator */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-3 rounded-xl bg-[#0f3d24] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm opacity-90 cursor-default"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#c49838]" />
                      <span>Pay via Razorpay (Instant)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Ready Checklist */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Readiness Checklist:
                </span>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className={`w-3.5 h-3.5 ${name ? "text-emerald-600" : "text-slate-300"}`} />
                  <span>Title configured</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check
                    className={`w-3.5 h-3.5 ${imageUrl ? "text-emerald-600" : "text-slate-300"}`}
                  />
                  <span>Photo uploaded</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check
                    className={`w-3.5 h-3.5 ${priceInr > 0 ? "text-emerald-600" : "text-slate-300"}`}
                  />
                  <span>Pricing set ({formatInr(priceInr)})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check
                    className={`w-3.5 h-3.5 ${stock > 0 ? "text-emerald-600" : "text-slate-300"}`}
                  />
                  <span>Stock allocated ({stock} units)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 font-medium text-xs">
                  <Check className="w-3.5 h-3.5 text-[#008060]" />
                  <span>Sync to Shopify (8x051y-ku.myshopify.com)</span>
                </div>
              </div>

              {/* Action Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !name}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0f3d24] hover:bg-[#092b19] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#c49838]" />
                <span>{isSubmitting ? "Publishing to Store..." : "Publish Product to Store"}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
