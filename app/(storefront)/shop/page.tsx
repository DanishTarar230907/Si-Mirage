'use client';

// app/(storefront)/shop/page.tsx
// Production shop with URL-synced filters, search, sort, pagination

import { Suspense, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, ChevronDown, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/store/useCartStore';
import { LUXURY_EASE, staggerContainer, staggerItemFadeUp } from '@/lib/animations';
import type { Product } from '@/types/cms';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const CATEGORIES = ['All', 'Aviator', 'Wayfarer', 'Round', 'Sport', 'Luxury'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'best_seller', label: 'Best Sellers' },
  { value: 'rating', label: 'Highest Rated' },
];
const PAGE_SIZE = 12;

// ─────────────────────────────────────────────
// Hook: Build and fire Supabase query
// ─────────────────────────────────────────────
function useShopProducts(category: string, search: string, sort: string, page: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const fetchProducts = async () => {
      let query = supabase
        .from('products')
        .select('id, name, category, price, discount_price, image_url, hover_image_url, badge, is_new, is_best_seller, rating_avg, review_count, stock_quantity, status', { count: 'exact' })
        .eq('status', 'active');

      if (category && category.toLowerCase() !== 'all') {
        query = query.ilike('category', category);
      }
      if (search.trim()) {
        query = query.ilike('name', `%${search.trim()}%`);
      }

      // Sort
      if (sort === 'price_asc') query = query.order('price', { ascending: true });
      else if (sort === 'price_desc') query = query.order('price', { ascending: false });
      else if (sort === 'best_seller') query = query.eq('is_best_seller', true).order('created_at', { ascending: false });
      else if (sort === 'rating') query = query.order('rating_avg', { ascending: false });
      else query = query.order('created_at', { ascending: false }); // newest

      // Pagination
      const from = page * PAGE_SIZE;
      query = query.range(from, from + PAGE_SIZE - 1);

      const { data, count, error } = await query;
      if (active) {
        if (!error && data) {
          setProducts(data as Product[]);
          setTotal(count || 0);
        }
        setLoading(false);
      }
    };

    fetchProducts();
    return () => { active = false; };
  }, [category, search, sort, page]);

  return { products, total, loading };
}

// ─────────────────────────────────────────────
// Main page content (inside Suspense)
// ─────────────────────────────────────────────
function ShopPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || '0');
  const q = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(q);
  const [sortOpen, setSortOpen] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { products, total, loading } = useShopProducts(category, q, sort, page);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasMore = page < totalPages - 1;

  // URL push helper
  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === '' || v === 'all' || v === 'newest' || v === '0') {
          params.delete(k);
        } else {
          params.set(k, v);
        }
      });
      const qs = params.toString();
      router.push(pathname + (qs ? `?${qs}` : ''), { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Debounced search
  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      pushParams({ q: val, page: '0' });
    }, 350);
  };

  const clearSearch = () => {
    setSearchInput('');
    pushParams({ q: null, page: '0' });
  };

  const setCategory = (cat: string) => pushParams({ category: cat, page: '0' });
  const setSort = (s: string) => { pushParams({ sort: s, page: '0' }); setSortOpen(false); };
  const setPage = (p: number) => pushParams({ page: String(p) });

  const activeFilters = useMemo(() => {
    const f: { label: string; clear: () => void }[] = [];
    if (q) f.push({ label: `"${q}"`, clear: clearSearch });
    if (category && category !== 'all') f.push({ label: category, clear: () => pushParams({ category: null, page: '0' }) });
    if (sort && sort !== 'newest') f.push({ label: SORT_OPTIONS.find(s => s.value === sort)?.label || sort, clear: () => pushParams({ sort: null }) });
    return f;
  }, [q, category, sort]);

  const clearAll = () => router.push(pathname);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Page Header */}
      <div className="bg-white border-b border-black/6">
        <div className="container mx-auto px-6 py-10 md:py-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#C5A059] mb-2">
            Si Mirage
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-[#121212]">The Collection</h1>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border-b border-black/6 sticky top-[60px] z-30 shadow-sm">
        <div className="container mx-auto px-6 py-3 flex flex-col gap-3">
          {/* Top row: categories + search + sort */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
                    category.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#121212] text-white'
                      : 'bg-transparent text-black/50 hover:text-black hover:bg-black/5 border border-black/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Search */}
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search frames..."
                className="pl-9 pr-8 py-2 text-xs bg-[#F5F5F3] border border-black/8 text-[#121212] placeholder-black/30 focus:outline-none focus:border-[#C5A059] transition-colors w-44 md:w-52"
              />
              {searchInput && (
                <button onClick={clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-black/10 hover:border-black/25 text-black/60 hover:text-black transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {SORT_OPTIONS.find(s => s.value === sort)?.label || 'Sort'}
                <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-1 bg-white border border-black/10 shadow-lg z-50 w-48 py-1"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSort(opt.value)}
                        className={`w-full px-4 py-2.5 text-left text-xs transition-colors ${
                          sort === opt.value
                            ? 'text-[#C5A059] font-semibold bg-[#C5A059]/5'
                            : 'text-black/60 hover:text-black hover:bg-black/3'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Active filter chips */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 flex-wrap overflow-hidden"
              >
                <span className="text-[10px] uppercase tracking-widest text-black/40 font-semibold">Active:</span>
                {activeFilters.map((f, i) => (
                  <span key={i} className="flex items-center gap-1 bg-[#121212]/8 text-[#121212] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1">
                    {f.label}
                    <button onClick={f.clear} className="ml-1 hover:text-red-500 transition-colors">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
                <button onClick={clearAll} className="text-[10px] uppercase tracking-wider text-black/40 hover:text-black transition-colors underline">
                  Clear All
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results Count */}
      <div className="container mx-auto px-6 pt-8 pb-4">
        <p className="text-xs text-black/40 font-medium">
          {loading ? 'Searching...' : `${total} ${total === 1 ? 'piece' : 'pieces'} found`}
        </p>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-6 pb-20">
        {loading ? (
          <ShopSkeletonGrid />
        ) : products.length === 0 ? (
          <ShopEmptyState onClear={clearAll} />
        ) : (
          <>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, i) => (
                <ShopProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-14">
                {page > 0 && (
                  <button
                    onClick={() => setPage(page - 1)}
                    className="px-5 py-2.5 border border-black/15 text-xs font-semibold uppercase tracking-widest text-black/60 hover:border-black hover:text-black transition-colors"
                  >
                    Previous
                  </button>
                )}
                <span className="text-xs text-black/40">
                  Page {page + 1} of {totalPages}
                </span>
                {hasMore && (
                  <button
                    onClick={() => setPage(page + 1)}
                    className="px-5 py-2.5 bg-[#121212] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
                  >
                    Load More
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────────
function ShopProductCard({ product, index }: { product: Product; index: number }) {
  const openCart = useCartStore((s) => s.openCart);
  const addItem = useCartStore((s) => s.addItem);

  const price = Number(product.price);
  const discountPrice = product.discount_price ? Number(product.discount_price) : null;
  const discount = discountPrice && price ? Math.round(((price - discountPrice) / price) * 100) : null;

  return (
    <motion.div
      variants={staggerItemFadeUp}
      className="group flex flex-col relative bg-white border border-black/5 hover:border-black/15 hover:shadow-md transition-all duration-500"
    >
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative block w-full aspect-[4/5] overflow-hidden bg-[#F5F4F0]">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
            className="object-cover transition-opacity duration-700 group-hover:opacity-0"
          />
        )}
        {product.hover_image_url && (
          <Image
            src={product.hover_image_url}
            alt={product.name}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount && (
            <span className="bg-[#121212] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
              -{discount}%
            </span>
          )}
          {product.is_new && (
            <span className="bg-white border border-black/10 text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
              New
            </span>
          )}
          {product.is_best_seller && (
            <span className="bg-[#C5A059] text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
              Best Seller
            </span>
          )}
        </div>

        {/* Quick Add */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 bg-[#121212] text-white text-[10px] font-bold uppercase tracking-widest py-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C5A059]"
          onClick={(e) => {
            e.preventDefault();
            addItem({
              id: product.id!,
              productId: product.id!,
              name: product.name,
              price: discountPrice || price,
              quantity: 1,
              image: product.image_url || '',
            });
          }}
        >
          Quick Add
        </motion.button>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-1">
          {product.category}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-[#121212] hover:text-[#C5A059] transition-colors leading-tight mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#121212]">
            Rs. {(discountPrice || price).toLocaleString()}
          </span>
          {discountPrice && (
            <span className="text-xs text-black/35 line-through">
              Rs. {price.toLocaleString()}
            </span>
          )}
        </div>
        {product.stock_quantity !== undefined && product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <p className="text-[10px] text-red-500 font-semibold mt-1.5">
            Only {product.stock_quantity} left
          </p>
        )}
        {product.stock_quantity === 0 && (
          <p className="text-[10px] text-black/40 font-semibold mt-1.5">Sold Out</p>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────
function ShopSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col bg-white border border-black/5">
          <div className="w-full aspect-[4/5] bg-black/6 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-2.5 w-16 bg-black/6 rounded animate-pulse" />
            <div className="h-3 w-3/4 bg-black/6 rounded animate-pulse" />
            <div className="h-3 w-1/3 bg-black/6 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────
function ShopEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-28 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-6">
        <Search className="w-7 h-7 text-black/25" />
      </div>
      <h3 className="text-lg font-light text-[#121212] mb-2">No frames found</h3>
      <p className="text-sm text-black/40 mb-8 max-w-xs leading-relaxed">
        Try adjusting your search or filters to discover more of our collection.
      </p>
      <button
        onClick={onClear}
        className="px-8 py-3 bg-[#121212] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
      >
        Clear All Filters
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Page export (wrapped in Suspense for useSearchParams)
// ─────────────────────────────────────────────
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F6]">
        <div className="container mx-auto px-6 pt-20">
          <ShopSkeletonGrid />
        </div>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}

// Necessary for no-scrollbar utility class
// Add to globals.css if not present:
// .no-scrollbar::-webkit-scrollbar { display: none; }
// .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
