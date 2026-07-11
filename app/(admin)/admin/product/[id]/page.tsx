'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ArrowLeft, Star, Trash2, Check, X, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const TABS = ['Info & SEO', 'Pricing', 'Images', 'Variants', 'Reviews'] as const;
type Tab = typeof TABS[number];

const input = 'w-full bg-white border border-black/15 px-3.5 py-2.5 text-sm text-[#121212] focus:outline-none focus:border-[#C5A059] transition-colors';
const label = 'block text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 mb-1.5';
const btnPrimary = 'px-4 py-2 bg-[#121212] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors disabled:opacity-50';

export default function AdminProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('Info & SEO');

  // Fetch product + relations
  const fetchProduct = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*), product_images(*), product_reviews(*)')
      .eq('id', id)
      .single();
    if (!error && data) setProduct(data);
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  const save = async (updates: any) => {
    setSaving(true);
    await supabase.from('products').update(updates).eq('id', id);
    await fetchProduct();
    setSaving(false);
    setSavedMsg('Saved');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-6 h-6 animate-spin text-[#C5A059]" />
    </div>
  );
  if (!product) return <div className="p-8 text-red-500">Product not found.</div>;

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#121212]">
      {/* Header */}
      <div className="bg-[#121212] text-white px-8 py-6 flex items-center gap-4">
        <Link href="/admin" className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Admin — Product Editor</p>
          <h1 className="text-xl font-light mt-0.5 truncate">{product.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="flex items-center gap-1 text-green-400 text-xs font-bold uppercase tracking-widest">
              <Check className="w-3.5 h-3.5" /> {savedMsg}
            </span>
          )}
          {saving && <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-black/8 bg-white px-8">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab ? 'border-[#C5A059] text-[#121212]' : 'border-transparent text-black/40 hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-10">
        {activeTab === 'Info & SEO' && <InfoTab product={product} onSave={save} />}
        {activeTab === 'Pricing' && <PricingTab product={product} onSave={save} />}
        {activeTab === 'Images' && <ImagesTab product={product} onRefresh={fetchProduct} />}
        {activeTab === 'Variants' && <VariantsTab product={product} onRefresh={fetchProduct} />}
        {activeTab === 'Reviews' && <ReviewsTab product={product} onRefresh={fetchProduct} />}
      </div>
    </div>
  );
}

// ── Info & SEO Tab ──────────────────────────────────────
function InfoTab({ product, onSave }: { product: any; onSave: (u: any) => void }) {
  const [form, setForm] = useState({
    name: product.name || '',
    brand: product.brand || 'Si Mirage',
    category: product.category || '',
    frame_type: product.frame_type || '',
    status: product.status || 'active',
    short_description: product.short_description || '',
    long_description: product.long_description || '',
    seo_title: product.seo_title || '',
    seo_description: product.seo_description || '',
  });
  const u = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-black/8 p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#121212] mb-4">Product Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={label}>Product Name</label>
            <input value={form.name} onChange={e => u('name', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Brand</label>
            <input value={form.brand} onChange={e => u('brand', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Category</label>
            <select value={form.category} onChange={e => u('category', e.target.value)} className={input}>
              {['Aviator','Wayfarer','Round','Sport','Luxury'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Frame Type</label>
            <input value={form.frame_type} onChange={e => u('frame_type', e.target.value)} placeholder="Full-rim, Half-rim…" className={input} />
          </div>
          <div>
            <label className={label}>Status</label>
            <select value={form.status} onChange={e => u('status', e.target.value)} className={input}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className={label}>Short Description</label>
            <textarea value={form.short_description} onChange={e => u('short_description', e.target.value)} rows={2} className={`${input} resize-none`} />
          </div>
          <div className="col-span-2">
            <label className={label}>Long Description</label>
            <textarea value={form.long_description} onChange={e => u('long_description', e.target.value)} rows={5} className={`${input} resize-none`} />
          </div>
        </div>
      </div>
      <div className="bg-white border border-black/8 p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#121212] mb-4">SEO Metadata</h2>
        <div>
          <label className={label}>SEO Title</label>
          <input value={form.seo_title} onChange={e => u('seo_title', e.target.value)} placeholder="Title for search engines" className={input} />
        </div>
        <div>
          <label className={label}>SEO Description</label>
          <textarea value={form.seo_description} onChange={e => u('seo_description', e.target.value)} rows={2} className={`${input} resize-none`} />
        </div>
      </div>
      <button onClick={() => onSave(form)} className={btnPrimary}><Save className="w-3.5 h-3.5 inline mr-1.5" />Save Info & SEO</button>
    </div>
  );
}

// ── Pricing Tab ─────────────────────────────────────────
function PricingTab({ product, onSave }: { product: any; onSave: (u: any) => void }) {
  const [form, setForm] = useState({
    price: product.price || 0,
    discount_price: product.discount_price || '',
    sku: product.sku || '',
    stock_quantity: product.stock_quantity || 0,
    is_featured: product.is_featured || false,
    is_best_seller: product.is_best_seller || false,
    is_new_arrival: product.is_new_arrival || false,
    is_new: product.is_new || false,
  });
  const u = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-black/8 p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Pricing & Inventory</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Price (Rs.)</label>
            <input type="number" value={form.price} onChange={e => u('price', Number(e.target.value))} className={input} />
          </div>
          <div>
            <label className={label}>Sale Price (Rs.)</label>
            <input type="number" value={form.discount_price} onChange={e => u('discount_price', e.target.value ? Number(e.target.value) : '')} placeholder="Leave blank if no sale" className={input} />
          </div>
          <div>
            <label className={label}>SKU</label>
            <input value={form.sku} onChange={e => u('sku', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Stock Quantity</label>
            <input type="number" value={form.stock_quantity} onChange={e => u('stock_quantity', Number(e.target.value))} className={input} />
          </div>
        </div>
      </div>
      <div className="bg-white border border-black/8 p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Collection Flags</h2>
        <div className="grid grid-cols-2 gap-3">
          {([['is_featured','Featured Product'],['is_best_seller','Best Seller'],['is_new_arrival','New Arrival'],['is_new','New Tag']] as [string, string][]).map(([key, lbl]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer p-3 border border-black/8 hover:border-[#C5A059]/40 transition-colors">
              <input type="checkbox" checked={!!(form as any)[key]} onChange={e => u(key, e.target.checked)} className="accent-[#C5A059] w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-black/60">{lbl}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={() => onSave(form)} className={btnPrimary}><Save className="w-3.5 h-3.5 inline mr-1.5" />Save Pricing</button>
    </div>
  );
}

// ── Images Tab ──────────────────────────────────────────
function ImagesTab({ product, onRefresh }: { product: any; onRefresh: () => void }) {
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const images: any[] = [...(product.product_images || [])].sort((a, b) => a.display_order - b.display_order);

  const addImage = async () => {
    if (!newUrl.trim()) return;
    setAdding(true);
    await supabase.from('product_images').insert({ product_id: product.id, image_url: newUrl.trim(), display_order: images.length, is_primary: images.length === 0 });
    setNewUrl('');
    await onRefresh();
    setAdding(false);
  };

  const deleteImage = async (imgId: string) => {
    await supabase.from('product_images').delete().eq('id', imgId);
    onRefresh();
  };

  const setPrimary = async (imgId: string) => {
    await supabase.from('product_images').update({ is_primary: false }).eq('product_id', product.id);
    await supabase.from('product_images').update({ is_primary: true }).eq('id', imgId);
    onRefresh();
  };

  const moveImage = async (img: any, dir: -1 | 1) => {
    const idx = images.findIndex(i => i.id === img.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= images.length) return;
    const swap = images[swapIdx];
    await supabase.from('product_images').update({ display_order: swapIdx }).eq('id', img.id);
    await supabase.from('product_images').update({ display_order: idx }).eq('id', swap.id);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-black/8 p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Gallery ({images.length} images)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={img.id} className="relative group border border-black/8 overflow-hidden">
              <div className="relative aspect-[4/5] bg-[#F5F4F0]">
                <Image src={img.image_url} alt="" fill className="object-cover" sizes="200px" />
              </div>
              {img.is_primary && (
                <div className="absolute top-2 left-2 bg-[#C5A059] text-black text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">Primary</div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.is_primary && (
                  <button onClick={() => setPrimary(img.id)} className="bg-[#C5A059] text-black text-[9px] font-bold px-2 py-1 uppercase tracking-wider hover:bg-white transition-colors">
                    Set Primary
                  </button>
                )}
                <button onClick={() => i > 0 && moveImage(img, -1)} className="bg-white/20 text-white text-[9px] px-2 py-1 hover:bg-white/40">↑</button>
                <button onClick={() => i < images.length - 1 && moveImage(img, 1)} className="bg-white/20 text-white text-[9px] px-2 py-1 hover:bg-white/40">↓</button>
                <button onClick={() => deleteImage(img.id)} className="bg-red-600 text-white text-[9px] px-2 py-1 hover:bg-red-700">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-black/8 p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Add Image via URL</h2>
        <div className="flex gap-3">
          <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..." className={`${input} flex-1`} />
          <button onClick={addImage} disabled={adding || !newUrl.trim()} className={btnPrimary}>
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[10px] text-black/40 mt-2">Also update main image_url and hover_image_url in Pricing tab for product cards.</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className={label}>Card Image URL</label>
            <input defaultValue={product.image_url || ''} onBlur={async e => { await supabase.from('products').update({ image_url: e.target.value }).eq('id', product.id); onRefresh(); }} className={input} />
          </div>
          <div>
            <label className={label}>Hover Image URL</label>
            <input defaultValue={product.hover_image_url || ''} onBlur={async e => { await supabase.from('products').update({ hover_image_url: e.target.value }).eq('id', product.id); onRefresh(); }} className={input} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Variants Tab ────────────────────────────────────────
function VariantsTab({ product, onRefresh }: { product: any; onRefresh: () => void }) {
  const variants: any[] = product.product_variants || [];
  const empty = { name: '', color: '', size: '', lens_type: '', sku: '', price_adjustment: 0, stock_quantity: 0 };
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const addVariant = async () => {
    setSaving(true);
    await supabase.from('product_variants').insert({ ...form, product_id: product.id });
    setForm(empty);
    await onRefresh();
    setSaving(false);
  };

  const deleteVariant = async (vid: string) => {
    await supabase.from('product_variants').delete().eq('id', vid);
    onRefresh();
  };

  const updateVariantStock = async (vid: string, qty: number) => {
    await supabase.from('product_variants').update({ stock_quantity: qty }).eq('id', vid);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-black/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-black/6">
          <h2 className="text-xs font-bold uppercase tracking-widest">Variants ({variants.length})</h2>
        </div>
        {variants.length === 0 ? (
          <p className="px-6 py-8 text-sm text-black/40 text-center">No variants yet. Add one below.</p>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-[#F5F5F3] text-[9px] uppercase tracking-widest text-black/50">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Color</th>
                <th className="py-3 px-4 text-left">SKU</th>
                <th className="py-3 px-4 text-left">Price Adj.</th>
                <th className="py-3 px-4 text-left">Stock</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {variants.map(v => (
                <tr key={v.id} className="hover:bg-[#FAFAF8]">
                  <td className="py-3 px-4 font-medium">{v.name}</td>
                  <td className="py-3 px-4 text-black/50">{v.color || '—'}</td>
                  <td className="py-3 px-4 font-mono text-black/50">{v.sku || '—'}</td>
                  <td className="py-3 px-4">{v.price_adjustment >= 0 ? '+' : ''}{v.price_adjustment}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      defaultValue={v.stock_quantity}
                      onBlur={e => updateVariantStock(v.id, Number(e.target.value))}
                      className="w-16 border border-black/10 px-2 py-1 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => deleteVariant(v.id)} className="text-black/30 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white border border-black/8 p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Add Variant</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {([['name','Variant Name (e.g. Matte Black / Polarized)'],['color','Color'],['size','Size'],['lens_type','Lens Type'],['sku','SKU']] as [string,string][]).map(([k, ph]) => (
            <div key={k} className={k === 'name' ? 'col-span-2' : ''}>
              <label className={label}>{ph}</label>
              <input value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={ph} className={input} />
            </div>
          ))}
          <div>
            <label className={label}>Price Adjustment (Rs.)</label>
            <input type="number" value={form.price_adjustment} onChange={e => setForm(f => ({ ...f, price_adjustment: Number(e.target.value) }))} className={input} />
          </div>
          <div>
            <label className={label}>Stock Quantity</label>
            <input type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: Number(e.target.value) }))} className={input} />
          </div>
        </div>
        <button onClick={addVariant} disabled={saving || !form.name} className={btnPrimary}>
          {saving ? <Loader2 className="w-3.5 h-3.5 inline animate-spin mr-1" /> : <Plus className="w-3.5 h-3.5 inline mr-1.5" />}
          Add Variant
        </button>
      </div>
    </div>
  );
}

// ── Reviews Tab ─────────────────────────────────────────
function ReviewsTab({ product, onRefresh }: { product: any; onRefresh: () => void }) {
  const reviews: any[] = product.product_reviews || [];

  const updateStatus = async (rid: string, status: string) => {
    await supabase.from('product_reviews').update({ status }).eq('id', rid);
    onRefresh();
  };

  const statusColor: Record<string, string> = {
    approved: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs text-black/50">{reviews.length} total · {reviews.filter(r => r.status === 'approved').length} approved</p>
          <p className="text-sm font-semibold text-[#C5A059]">Avg: {product.rating_avg || '—'} ⭐ ({product.review_count || 0} approved)</p>
        </div>
      </div>
      {reviews.length === 0 && <p className="text-sm text-black/40 text-center py-12">No reviews yet.</p>}
      {reviews.map(r => (
        <div key={r.id} className="bg-white border border-black/8 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold text-sm">{r.customer_name}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border ${statusColor[r.status] || statusColor.pending}`}>
                  {r.status}
                </span>
                {r.is_verified_purchase && <span className="text-[9px] bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 uppercase tracking-wider font-bold">Verified</span>}
              </div>
              <div className="flex text-[#C5A059] mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-current' : 'fill-current opacity-20'}`} />)}
              </div>
              {r.title && <p className="text-sm font-medium mb-1">{r.title}</p>}
              <p className="text-sm text-black/60 leading-relaxed">{r.comment}</p>
              <p className="text-[10px] text-black/30 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              {r.status !== 'approved' && (
                <button onClick={() => updateStatus(r.id, 'approved')} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 text-[9px] font-bold uppercase tracking-wider hover:bg-green-100 transition-colors">
                  <Check className="w-3 h-3" /> Approve
                </button>
              )}
              {r.status !== 'rejected' && (
                <button onClick={() => updateStatus(r.id, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 text-[9px] font-bold uppercase tracking-wider hover:bg-red-100 transition-colors">
                  <X className="w-3 h-3" /> Reject
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
