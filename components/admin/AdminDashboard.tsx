'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Activity, ArrowRight, Bell, Boxes, Camera, ChevronRight, Compass, FileImage, LayoutGrid, Newspaper, Package, Plus, Search, Settings, ShieldCheck, ShoppingBag, Sparkles, Ticket, TrendingUp, UserCircle2, Video, Warehouse } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { adminStorageKey, defaultAdminState, type AdminMediaAsset, type AdminOrder, type AdminProduct, type AdminSection } from '@/lib/adminData';

type ModuleKey = 'overview' | 'hero' | 'announcement' | 'navbar' | 'products' | 'categories' | 'collections' | 'creatives' | 'media' | 'story' | 'testimonials' | 'gallery' | 'newsletter' | 'footer' | 'customers' | 'orders' | 'inventory' | 'discounts' | 'analytics' | 'assets' | 'settings';

type HeroSlide = {
  id: number;
  headline: string;
  subheadline: string;
  cta: string;
  link: string;
  image: string;
  overlay: number;
  active: boolean;
  order: number;
};

type AnnouncementConfig = {
  text: string;
  background: string;
  textColor: string;
  visible: boolean;
  priority: 'High' | 'Medium' | 'Low';
};

type NavbarLink = {
  id: number;
  label: string;
  href: string;
  visible: boolean;
  order: number;
};

type CategoryItem = {
  id: number;
  name: string;
  description: string;
  featured: boolean;
  visible: boolean;
};

type CollectionItem = {
  id: number;
  name: string;
  description: string;
  featured: boolean;
  visible: boolean;
};

type CreativeItem = {
  id: number;
  title: string;
  category: string;
  feature: string;
  featured: boolean;
  visible: boolean;
};

type TestimonialItem = {
  id: number;
  name: string;
  location: string;
  review: string;
  rating: number;
  featured: boolean;
  visible: boolean;
};

type GalleryItem = {
  id: number;
  title: string;
  src: string;
  featured: boolean;
};

type FooterLink = {
  id: number;
  label: string;
  href: string;
  visible: boolean;
};

type Customer = {
  id: number;
  name: string;
  email: string;
  tier: string;
  orders: number;
  status: 'Active' | 'Suspended';
};

type InventoryItem = {
  id: number;
  sku: string;
  name: string;
  stock: number;
  status: 'Healthy' | 'Low' | 'Critical';
};

type DiscountItem = {
  id: number;
  code: string;
  type: string;
  value: number;
  active: boolean;
};

type AnalyticsMetric = {
  id: number;
  label: string;
  value: string;
  change: string;
};

type SettingsConfig = {
  brandName: string;
  logo: string;
  theme: 'Light' | 'Dark';
  seoTitle: string;
  social: string;
};

type CmsState = {
  heroSlides: HeroSlide[];
  announcement: AnnouncementConfig;
  navbarLinks: NavbarLink[];
  products: AdminProduct[];
  categories: CategoryItem[];
  collections: CollectionItem[];
  creatives: CreativeItem[];
  media: AdminMediaAsset[];
  brandStory: {
    mission: string;
    vision: string;
    story: string;
    craftsmanship: string;
    quality: string;
  };
  testimonials: TestimonialItem[];
  gallery: GalleryItem[];
  newsletter: {
    heading: string;
    description: string;
    cta: string;
    subscribers: number;
  };
  footerLinks: FooterLink[];
  customers: Customer[];
  orders: AdminOrder[];
  inventory: InventoryItem[];
  discounts: DiscountItem[];
  analytics: AnalyticsMetric[];
  settings: SettingsConfig;
  sections: AdminSection[];
};

const salesTrend = [2400, 3200, 2850, 3900, 4680, 5840, 7410];

const emptyHero: Omit<HeroSlide, 'id' | 'order'> = {
  headline: '',
  subheadline: '',
  cta: 'Explore Now',
  link: '/shop',
  image: '/images/20250201_233239.jpg',
  overlay: 0.4,
  active: true,
};

const emptyProduct = {
  name: '',
  category: 'Aviator',
  price: 0,
  stock: 0,
  description: '',
  image: '/images/20250201_233239.jpg',
  featured: false,
};

const emptyCategory: Omit<CategoryItem, 'id'> = {
  name: '',
  description: '',
  featured: false,
  visible: true,
};

const emptyCollection: Omit<CollectionItem, 'id'> = {
  name: '',
  description: '',
  featured: false,
  visible: true,
};

const emptyCreative: Omit<CreativeItem, 'id'> = {
  title: '',
  category: 'Campaign',
  feature: '',
  featured: false,
  visible: true,
};

const emptyMedia: Omit<AdminMediaAsset, 'id'> = {
  title: '',
  type: 'image',
  src: '/images/20250201_233239.jpg',
  caption: '',
};

const emptyTestimonial: Omit<TestimonialItem, 'id'> = {
  name: '',
  location: '',
  review: '',
  rating: 5,
  featured: false,
  visible: true,
};

const emptyGallery: Omit<GalleryItem, 'id'> = {
  title: '',
  src: '/images/20250201_233239.jpg',
  featured: false,
};

const emptyFooterLink: Omit<FooterLink, 'id'> = {
  label: '',
  href: '',
  visible: true,
};

const emptyDiscount = {
  code: '',
  type: 'Percentage',
  value: 10,
  active: true,
};

function SalesSparkline() {
  const width = 320;
  const height = 140;
  const max = Math.max(...salesTrend);
  const min = Math.min(...salesTrend);
  const points = salesTrend.map((value, index) => {
    const x = (index / (salesTrend.length - 1)) * width;
    const y = height - ((value - min) / (max - min || 1)) * (height - 32) - 16;
    return `${x},${y}`;
  });
  const line = `M ${points.join(' L ')}`;
  const area = `${line} L ${width},${height} L 0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full">
      <defs>
        <linearGradient id="sales-area" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C5A059" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sales-area)" />
      <motion.path
        d={line}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        fill="none"
        stroke="#C5A059"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InventoryBars({ items }: { items: { name: string; stock: number }[] }) {
  const max = Math.max(...items.map((item) => item.stock));
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const percent = Math.max(14, Math.round((item.stock / max) * 100));
        return (
          <div key={item.name}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-[#121212]">{item.name}</span>
              <span className="text-[#8a7b54]">{item.stock} units</span>
            </div>
            <div className="h-2 rounded-full bg-[#efe8da]">
              <div className="h-2 rounded-full bg-gradient-to-r from-[#C5A059] via-[#E2C06D] to-[#F2E0B0]" style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[2px] border border-black/5 bg-white/80 p-6 shadow-[0_20px_60px_rgba(17,17,17,0.03)] backdrop-blur ${className}`}>{children}</div>;
}

function createDefaultCmsState(): CmsState {
  return {
    heroSlides: [
      {
        id: 1,
        headline: 'The New Standard in Luxury Eyewear',
        subheadline: 'Cinematic silhouettes with sculptural precision.',
        cta: 'Explore The Edit',
        link: '/shop',
        image: '/images/20250201_233239.jpg',
        overlay: 0.35,
        active: true,
        order: 1,
      },
    ],
    announcement: {
      text: 'Complimentary shipping on all orders over Rs. 15,000',
      background: '#121212',
      textColor: '#f7f4ee',
      visible: true,
      priority: 'High',
    },
    navbarLinks: [
      { id: 1, label: 'Home', href: '/', visible: true, order: 1 },
      { id: 2, label: 'Shop', href: '/shop', visible: true, order: 2 },
      { id: 3, label: 'Collections', href: '/collections', visible: true, order: 3 },
    ],
    products: defaultAdminState.products.map((product) => ({ ...product })),
    categories: [
      { id: 1, name: 'Luxury', description: 'Modern statement pieces', featured: true, visible: true },
      { id: 2, name: 'Everyday', description: 'The refined daily edit', featured: false, visible: true },
    ],
    collections: [
      { id: 1, name: 'Luxury Collection', description: 'Cinematic and sculptural', featured: true, visible: true },
      { id: 2, name: 'Everyday Collection', description: 'Refined comfort for daily wear', featured: false, visible: true },
    ],
    creatives: [
      { id: 1, title: 'Seasonal Campaign', category: 'Campaign', feature: 'Editorial launch', featured: true, visible: true },
      { id: 2, title: 'Studio Reels', category: 'Media', feature: 'Behind the scenes', featured: false, visible: true },
    ],
    media: defaultAdminState.media.map((asset) => ({ ...asset })),
    brandStory: {
      mission: 'Crafting precision eyewear with the confidence of an architectural object.',
      vision: 'To create a luxury brand experience that feels timeless and cinematic.',
      story: 'Si Mirage merges sculptural design, rare materials, and editorial storytelling.',
      craftsmanship: 'Each frame is designed with refined engineering and elegant calm.',
      quality: 'Exceptional comfort, longevity, and detail define every release.',
    },
    testimonials: [
      { id: 1, name: 'Ava Khan', location: 'Dubai', review: 'The service feels as polished as the product itself.', rating: 5, featured: true, visible: true },
    ],
    gallery: [
      { id: 1, title: 'Editorial Portrait', src: '/images/20250201_233239.jpg', featured: true },
    ],
    newsletter: {
      heading: 'The private edit',
      description: 'Receive first access to new silhouettes and invitation-only launches.',
      cta: 'Join the list',
      subscribers: 1841,
    },
    footerLinks: [
      { id: 1, label: 'About', href: '/about', visible: true },
      { id: 2, label: 'Contact', href: '/contact', visible: true },
    ],
    customers: [
      { id: 1, name: 'Ava Khan', email: 'ava@luxury.com', tier: 'VIP', orders: 4, status: 'Active' },
      { id: 2, name: 'Noor Ali', email: 'noor@studio.com', tier: 'Returning', orders: 2, status: 'Active' },
    ],
    orders: defaultAdminState.orders.map((order) => ({ ...order })),
    inventory: [
      { id: 1, sku: 'SM-AVI-001', name: 'Aviator', stock: 18, status: 'Healthy' },
      { id: 2, sku: 'SM-WAY-002', name: 'Wayfarer', stock: 9, status: 'Low' },
      { id: 3, sku: 'SM-ROU-003', name: 'Round', stock: 3, status: 'Critical' },
    ],
    discounts: [
      { id: 1, code: 'LUXE10', type: 'Percentage', value: 10, active: true },
      { id: 2, code: 'VIP20', type: 'Percentage', value: 20, active: false },
    ],
    analytics: [
      { id: 1, label: 'Revenue', value: 'Rs. 84.1k', change: '+18.2%' },
      { id: 2, label: 'Conversion', value: '4.8%', change: '+0.6%' },
      { id: 3, label: 'Returning Customers', value: '63%', change: '+8.4%' },
    ],
    settings: {
      brandName: 'Si Mirage',
      logo: '/logo.png',
      theme: 'Light',
      seoTitle: 'Luxury Eyewear Crafted with Precision',
      social: '@simirage',
    },
    sections: defaultAdminState.sections.map((section) => ({ ...section })),
  };
}

function sanitizeCmsState(value: Partial<CmsState> | null | undefined): CmsState {
  const defaults = createDefaultCmsState();

  if (!value || typeof value !== 'object') {
    return defaults;
  }

  return {
    ...defaults,
    ...value,
    heroSlides: Array.isArray(value.heroSlides) ? value.heroSlides : defaults.heroSlides,
    announcement: {
      ...defaults.announcement,
      ...(value.announcement ?? {}),
    },
    navbarLinks: Array.isArray(value.navbarLinks) ? value.navbarLinks : defaults.navbarLinks,
    products: Array.isArray(value.products) ? value.products : defaults.products,
    categories: Array.isArray(value.categories) ? value.categories : defaults.categories,
    collections: Array.isArray(value.collections) ? value.collections : defaults.collections,
    creatives: Array.isArray(value.creatives) ? value.creatives : defaults.creatives,
    media: Array.isArray(value.media) ? value.media : defaults.media,
    brandStory: {
      ...defaults.brandStory,
      ...(value.brandStory ?? {}),
    },
    testimonials: Array.isArray(value.testimonials) ? value.testimonials : defaults.testimonials,
    gallery: Array.isArray(value.gallery) ? value.gallery : defaults.gallery,
    newsletter: {
      ...defaults.newsletter,
      ...(value.newsletter ?? {}),
    },
    footerLinks: Array.isArray(value.footerLinks) ? value.footerLinks : defaults.footerLinks,
    customers: Array.isArray(value.customers) ? value.customers : defaults.customers,
    orders: Array.isArray(value.orders) ? value.orders : defaults.orders,
    inventory: Array.isArray(value.inventory) ? value.inventory : defaults.inventory,
    discounts: Array.isArray(value.discounts) ? value.discounts : defaults.discounts,
    analytics: Array.isArray(value.analytics) ? value.analytics : defaults.analytics,
    settings: {
      ...defaults.settings,
      ...(value.settings ?? {}),
    },
    sections: Array.isArray(value.sections) ? value.sections : defaults.sections,
  };
}

function loadPersistedState(): CmsState {
  if (typeof window === 'undefined') {
    return createDefaultCmsState();
  }

  try {
    const raw = window.localStorage.getItem(adminStorageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CmsState>;
      return sanitizeCmsState(parsed);
    }
  } catch {
    // fall back to defaults
  }

  return createDefaultCmsState();
}

export default function AdminDashboard() {
  const [state, setState] = useState<CmsState>(() => loadPersistedState());
  const [activeModule, setActiveModule] = useState<ModuleKey>('overview');
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [heroForm, setHeroForm] = useState(emptyHero);
  const [editingHeroId, setEditingHeroId] = useState<number | null>(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [collectionForm, setCollectionForm] = useState(emptyCollection);
  const [editingCollectionId, setEditingCollectionId] = useState<number | null>(null);
  const [creativeForm, setCreativeForm] = useState(emptyCreative);
  const [editingCreativeId, setEditingCreativeId] = useState<number | null>(null);
  const [mediaForm, setMediaForm] = useState(emptyMedia);
  const [editingMediaId, setEditingMediaId] = useState<number | null>(null);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
  const [galleryForm, setGalleryForm] = useState(emptyGallery);
  const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null);
  const [footerForm, setFooterForm] = useState(emptyFooterLink);
  const [editingFooterId, setEditingFooterId] = useState<number | null>(null);
  const [discountForm, setDiscountForm] = useState(emptyDiscount);
  const [editingDiscountId, setEditingDiscountId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(adminStorageKey, JSON.stringify(state));
  }, [state]);

  const summary = useMemo(() => {
    const totalSales = state.orders.reduce((sum, order) => sum + order.amount, 0);
    const completed = state.orders.filter((order) => order.status === 'Paid' || order.status === 'Packed' || order.status === 'Shipped').length;
    const pending = state.orders.filter((order) => order.status === 'Pending').length;
    return {
      totalSales,
      completed,
      pending,
      liveSections: state.sections.filter((section) => section.active).length,
      products: state.products.length,
      subscribers: state.newsletter.subscribers,
    };
  }, [state]);

  const handleSaveProduct = (event: FormEvent) => {
    event.preventDefault();
    if (!productForm.name) return;
    if (editingProductId) {
      setState((current) => ({
        ...current,
        products: current.products.map((product) => (product.id === editingProductId ? { ...product, ...productForm, id: product.id } : product)),
      }));
    } else {
      setState((current) => ({
        ...current,
        products: [{ ...productForm, id: Date.now(), price: Number(productForm.price), stock: Number(productForm.stock) }, ...current.products],
      }));
    }
    setEditingProductId(null);
    setProductForm(emptyProduct);
  };

  const startEditProduct = (product: AdminProduct) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      image: product.image,
      featured: product.featured,
    });
    setActiveModule('products');
  };

  const deleteProduct = (id: number) => {
    setState((current) => ({ ...current, products: current.products.filter((product) => product.id !== id) }));
  };

  const handleSaveHero = (event: FormEvent) => {
    event.preventDefault();
    if (!heroForm.headline) return;
    if (editingHeroId) {
      setState((current) => ({
        ...current,
        heroSlides: current.heroSlides.map((slide) => (slide.id === editingHeroId ? { ...slide, ...heroForm, id: slide.id } : slide)),
      }));
    } else {
      setState((current) => ({
        ...current,
        heroSlides: [{ ...heroForm, id: Date.now(), order: current.heroSlides.length + 1 }, ...current.heroSlides],
      }));
    }
    setEditingHeroId(null);
    setHeroForm(emptyHero);
  };

  const editHero = (slide: HeroSlide) => {
    setEditingHeroId(slide.id);
    setHeroForm({
      headline: slide.headline,
      subheadline: slide.subheadline,
      cta: slide.cta,
      link: slide.link,
      image: slide.image,
      overlay: slide.overlay,
      active: slide.active,
    });
    setActiveModule('hero');
  };

  const saveCategory = (event: FormEvent) => {
    event.preventDefault();
    if (!categoryForm.name) return;
    if (editingCategoryId) {
      setState((current) => ({
        ...current,
        categories: current.categories.map((category) => (category.id === editingCategoryId ? { ...category, ...categoryForm, id: category.id } : category)),
      }));
    } else {
      setState((current) => ({ ...current, categories: [{ ...categoryForm, id: Date.now() }, ...current.categories] }));
    }
    setEditingCategoryId(null);
    setCategoryForm(emptyCategory);
  };

  const editCategory = (category: CategoryItem) => {
    setEditingCategoryId(category.id);
    setCategoryForm({ name: category.name, description: category.description, featured: category.featured, visible: category.visible });
    setActiveModule('categories');
  };

  const deleteCategory = (id: number) => {
    setState((current) => ({ ...current, categories: current.categories.filter((category) => category.id !== id) }));
  };

  const saveCollection = (event: FormEvent) => {
    event.preventDefault();
    if (!collectionForm.name) return;
    if (editingCollectionId) {
      setState((current) => ({
        ...current,
        collections: current.collections.map((collection) => (collection.id === editingCollectionId ? { ...collection, ...collectionForm, id: collection.id } : collection)),
      }));
    } else {
      setState((current) => ({ ...current, collections: [{ ...collectionForm, id: Date.now() }, ...current.collections] }));
    }
    setEditingCollectionId(null);
    setCollectionForm(emptyCollection);
  };

  const editCollection = (collection: CollectionItem) => {
    setEditingCollectionId(collection.id);
    setCollectionForm({ name: collection.name, description: collection.description, featured: collection.featured, visible: collection.visible });
    setActiveModule('collections');
  };

  const deleteCollection = (id: number) => {
    setState((current) => ({ ...current, collections: current.collections.filter((collection) => collection.id !== id) }));
  };

  const saveCreative = (event: FormEvent) => {
    event.preventDefault();
    if (!creativeForm.title) return;
    if (editingCreativeId) {
      setState((current) => ({
        ...current,
        creatives: current.creatives.map((creative) => (creative.id === editingCreativeId ? { ...creative, ...creativeForm, id: creative.id } : creative)),
      }));
    } else {
      setState((current) => ({ ...current, creatives: [{ ...creativeForm, id: Date.now() }, ...current.creatives] }));
    }
    setEditingCreativeId(null);
    setCreativeForm(emptyCreative);
  };

  const editCreative = (creative: CreativeItem) => {
    setEditingCreativeId(creative.id);
    setCreativeForm({ title: creative.title, category: creative.category, feature: creative.feature, featured: creative.featured, visible: creative.visible });
    setActiveModule('creatives');
  };

  const deleteCreative = (id: number) => {
    setState((current) => ({ ...current, creatives: current.creatives.filter((creative) => creative.id !== id) }));
  };

  const saveMedia = (event: FormEvent) => {
    event.preventDefault();
    if (!mediaForm.title) return;
    if (editingMediaId) {
      setState((current) => ({
        ...current,
        media: current.media.map((asset) => (asset.id === editingMediaId ? { ...asset, ...mediaForm, id: asset.id } : asset)),
      }));
    } else {
      setState((current) => ({ ...current, media: [{ ...mediaForm, id: Date.now() }, ...current.media] }));
    }
    setEditingMediaId(null);
    setMediaForm(emptyMedia);
  };

  const editMedia = (asset: AdminMediaAsset) => {
    setEditingMediaId(asset.id);
    setMediaForm({ title: asset.title, type: asset.type, src: asset.src, caption: asset.caption });
    setActiveModule('media');
  };

  const deleteMedia = (id: number) => {
    setState((current) => ({ ...current, media: current.media.filter((asset) => asset.id !== id) }));
  };

  const saveTestimonial = (event: FormEvent) => {
    event.preventDefault();
    if (!testimonialForm.name) return;
    if (editingTestimonialId) {
      setState((current) => ({
        ...current,
        testimonials: current.testimonials.map((item) => (item.id === editingTestimonialId ? { ...item, ...testimonialForm, id: item.id } : item)),
      }));
    } else {
      setState((current) => ({ ...current, testimonials: [{ ...testimonialForm, id: Date.now() }, ...current.testimonials] }));
    }
    setEditingTestimonialId(null);
    setTestimonialForm(emptyTestimonial);
  };

  const editTestimonial = (item: TestimonialItem) => {
    setEditingTestimonialId(item.id);
    setTestimonialForm({ name: item.name, location: item.location, review: item.review, rating: item.rating, featured: item.featured, visible: item.visible });
    setActiveModule('testimonials');
  };

  const deleteTestimonial = (id: number) => {
    setState((current) => ({ ...current, testimonials: current.testimonials.filter((item) => item.id !== id) }));
  };

  const saveGallery = (event: FormEvent) => {
    event.preventDefault();
    if (!galleryForm.title) return;
    if (editingGalleryId) {
      setState((current) => ({
        ...current,
        gallery: current.gallery.map((item) => (item.id === editingGalleryId ? { ...item, ...galleryForm, id: item.id } : item)),
      }));
    } else {
      setState((current) => ({ ...current, gallery: [{ ...galleryForm, id: Date.now() }, ...current.gallery] }));
    }
    setEditingGalleryId(null);
    setGalleryForm(emptyGallery);
  };

  const editGallery = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setGalleryForm({ title: item.title, src: item.src, featured: item.featured });
    setActiveModule('gallery');
  };

  const deleteGallery = (id: number) => {
    setState((current) => ({ ...current, gallery: current.gallery.filter((item) => item.id !== id) }));
  };

  const saveFooterLink = (event: FormEvent) => {
    event.preventDefault();
    if (!footerForm.label) return;
    if (editingFooterId) {
      setState((current) => ({
        ...current,
        footerLinks: current.footerLinks.map((link) => (link.id === editingFooterId ? { ...link, ...footerForm, id: link.id } : link)),
      }));
    } else {
      setState((current) => ({ ...current, footerLinks: [{ ...footerForm, id: Date.now() }, ...current.footerLinks] }));
    }
    setEditingFooterId(null);
    setFooterForm(emptyFooterLink);
  };

  const editFooterLink = (link: FooterLink) => {
    setEditingFooterId(link.id);
    setFooterForm({ label: link.label, href: link.href, visible: link.visible });
    setActiveModule('footer');
  };

  const deleteFooterLink = (id: number) => {
    setState((current) => ({ ...current, footerLinks: current.footerLinks.filter((link) => link.id !== id) }));
  };

  const saveDiscount = (event: FormEvent) => {
    event.preventDefault();
    if (!discountForm.code) return;
    if (editingDiscountId) {
      setState((current) => ({
        ...current,
        discounts: current.discounts.map((discount) => (discount.id === editingDiscountId ? { ...discount, ...discountForm, id: discount.id } : discount)),
      }));
    } else {
      setState((current) => ({ ...current, discounts: [{ ...discountForm, id: Date.now() }, ...current.discounts] }));
    }
    setEditingDiscountId(null);
    setDiscountForm(emptyDiscount);
  };

  const editDiscount = (discount: DiscountItem) => {
    setEditingDiscountId(discount.id);
    setDiscountForm({ code: discount.code, type: discount.type, value: discount.value, active: discount.active });
    setActiveModule('discounts');
  };

  const deleteDiscount = (id: number) => {
    setState((current) => ({ ...current, discounts: current.discounts.filter((discount) => discount.id !== id) }));
  };

  const modules: { key: ModuleKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <Activity className="h-4 w-4" /> },
    { key: 'hero', label: 'Hero', icon: <LayoutGrid className="h-4 w-4" /> },
    { key: 'announcement', label: 'Bar', icon: <Sparkles className="h-4 w-4" /> },
    { key: 'navbar', label: 'Navbar', icon: <Compass className="h-4 w-4" /> },
    { key: 'products', label: 'Products', icon: <Package className="h-4 w-4" /> },
    { key: 'categories', label: 'Categories', icon: <Boxes className="h-4 w-4" /> },
    { key: 'collections', label: 'Collections', icon: <ShoppingBag className="h-4 w-4" /> },
    { key: 'creatives', label: 'Creatives', icon: <Camera className="h-4 w-4" /> },
    { key: 'media', label: 'Media', icon: <Video className="h-4 w-4" /> },
    { key: 'story', label: 'Story', icon: <Newspaper className="h-4 w-4" /> },
    { key: 'testimonials', label: 'Reviews', icon: <ShieldCheck className="h-4 w-4" /> },
    { key: 'gallery', label: 'Gallery', icon: <FileImage className="h-4 w-4" /> },
    { key: 'newsletter', label: 'Newsletter', icon: <Bell className="h-4 w-4" /> },
    { key: 'footer', label: 'Footer', icon: <ChevronRight className="h-4 w-4" /> },
    { key: 'customers', label: 'Customers', icon: <UserCircle2 className="h-4 w-4" /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingBag className="h-4 w-4" /> },
    { key: 'inventory', label: 'Inventory', icon: <Warehouse className="h-4 w-4" /> },
    { key: 'discounts', label: 'Discounts', icon: <Ticket className="h-4 w-4" /> },
    { key: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { key: 'assets', label: 'Assets', icon: <FileImage className="h-4 w-4" /> },
    { key: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#111111]">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-8 rounded-[2px] border border-black/5 bg-white/80 px-6 py-8 shadow-[0_24px_80px_rgba(17,17,17,0.04)] backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C5A059]">SI MIRAGE / CMS</p>
              <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Storefront Operations</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f5f5f]">
                A luxury control center for every visible storefront experience, from hero storytelling to orders and inventory.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-[#C5A059]/15 bg-[#C5A059]/8 px-4 py-2 text-sm text-[#8a7b54]">
              <Sparkles className="h-4 w-4" />
              Premium CMS • Live sync
            </div>
          </div>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          {modules.map((module) => (
            <button
              key={module.key}
              onClick={() => setActiveModule(module.key)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] transition-all ${
                activeModule === module.key
                  ? 'border-[#C5A059] bg-[#C5A059] text-black'
                  : 'border-black/5 bg-white/70 text-[#5a5a5a] hover:border-[#C5A059] hover:text-[#111111]'
              }`}
            >
              {module.icon}
              {module.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {activeModule === 'overview' && (
              <section className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Panel>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a7b54]">Today&apos;s sales</p>
                    <p className="mt-3 text-3xl font-semibold text-[#121212]">Rs. {summary.totalSales.toLocaleString()}</p>
                  </Panel>
                  <Panel>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a7b54]">Pending orders</p>
                    <p className="mt-3 text-3xl font-semibold text-[#121212]">{summary.pending}</p>
                  </Panel>
                  <Panel>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a7b54]">Live sections</p>
                    <p className="mt-3 text-3xl font-semibold text-[#C5A059]">{summary.liveSections}</p>
                  </Panel>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <Panel>
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Sales pulse</p>
                        <h2 className="mt-2 text-xl font-light text-[#121212]">Revenue trajectory</h2>
                      </div>
                      <TrendingUp className="h-5 w-5 text-[#C5A059]" />
                    </div>
                    <SalesSparkline />
                  </Panel>
                  <Panel>
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Inventory health</p>
                        <h2 className="mt-2 text-xl font-light text-[#121212]">Silhouette availability</h2>
                      </div>
                      <Warehouse className="h-5 w-5 text-[#C5A059]" />
                    </div>
                    <InventoryBars items={state.inventory.slice(0, 3).map((item) => ({ name: item.name, stock: item.stock }))} />
                  </Panel>
                </div>

                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Operations feed</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">Recent activity</h2>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <div className="divide-y divide-black/5">
                    {state.orders.slice(0, 4).map((order) => (
                      <div key={order.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[#121212]">{order.customer}</p>
                          <p className="mt-1 text-sm text-[#6a6a6a]">{order.item} • {order.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-sm font-semibold text-[#121212]">Rs. {order.amount.toLocaleString()}</p>
                          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b54]">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </section>
            )}

            {activeModule === 'hero' && (
              <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Hero CMS</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">Manage hero slides</h2>
                    </div>
                    <Plus className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <form onSubmit={handleSaveHero} className="grid gap-4">
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Headline" value={heroForm.headline} onChange={(event) => setHeroForm({ ...heroForm, headline: event.target.value })} />
                    <textarea className="min-h-[90px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Subheadline" value={heroForm.subheadline} onChange={(event) => setHeroForm({ ...heroForm, subheadline: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="CTA Label" value={heroForm.cta} onChange={(event) => setHeroForm({ ...heroForm, cta: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="CTA Link" value={heroForm.link} onChange={(event) => setHeroForm({ ...heroForm, link: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Image URL" value={heroForm.image} onChange={(event) => setHeroForm({ ...heroForm, image: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" type="number" step="0.1" placeholder="Overlay" value={heroForm.overlay} onChange={(event) => setHeroForm({ ...heroForm, overlay: Number(event.target.value) })} />
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={heroForm.active} onChange={(event) => setHeroForm({ ...heroForm, active: event.target.checked })} />
                      Publish slide
                    </label>
                    <button type="submit" className="rounded-[2px] bg-[#C5A059] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black">{editingHeroId ? 'Update slide' : 'Create slide'}</button>
                  </form>
                </Panel>

                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Slides</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">Hero inventory</h2>
                    </div>
                    <Search className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <div className="divide-y divide-black/5">
                    {state.heroSlides.map((slide) => (
                      <div key={slide.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[#121212]">{slide.headline}</p>
                          <p className="mt-1 text-sm text-[#6a6a6a]">{slide.subheadline}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b54]">{slide.active ? 'Live' : 'Draft'}</span>
                          <button onClick={() => editHero(slide)} className="rounded-full border border-black/5 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#5a5a5a]">Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </section>
            )}

            {activeModule === 'announcement' && (
              <Panel>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Announcement Bar</p>
                    <h2 className="mt-2 text-xl font-light text-[#121212]">Edit promo messaging</h2>
                  </div>
                  <Sparkles className="h-5 w-5 text-[#C5A059]" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[2px] border border-black/5 bg-[#faf7f0] p-4">
                    <label className="mb-2 block text-sm text-[#6a6a6a]">Promo text</label>
                    <textarea className="min-h-[90px] w-full rounded-[2px] border border-black/5 bg-white px-4 py-3 text-sm outline-none" value={state.announcement.text} onChange={(event) => setState((current) => ({ ...current, announcement: { ...current.announcement, text: event.target.value } }))} />
                  </div>
                  <div className="space-y-4 rounded-[2px] border border-black/5 bg-[#faf7f0] p-4">
                    <div>
                      <label className="mb-2 block text-sm text-[#6a6a6a]">Background</label>
                      <input type="color" value={state.announcement.background} onChange={(event) => setState((current) => ({ ...current, announcement: { ...current.announcement, background: event.target.value } }))} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-[#6a6a6a]">Text color</label>
                      <input type="color" value={state.announcement.textColor} onChange={(event) => setState((current) => ({ ...current, announcement: { ...current.announcement, textColor: event.target.value } }))} />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={state.announcement.visible} onChange={(event) => setState((current) => ({ ...current, announcement: { ...current.announcement, visible: event.target.checked } }))} />
                      Show in storefront
                    </label>
                    <select className="w-full rounded-[2px] border border-black/5 bg-white px-4 py-3 text-sm outline-none" value={state.announcement.priority} onChange={(event) => setState((current) => ({ ...current, announcement: { ...current.announcement, priority: event.target.value as AnnouncementConfig['priority'] } }))}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </Panel>
            )}

            {activeModule === 'navbar' && (
              <Panel>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Navigation CMS</p>
                    <h2 className="mt-2 text-xl font-light text-[#121212]">Manage nav links</h2>
                  </div>
                  <Compass className="h-5 w-5 text-[#C5A059]" />
                </div>
                <div className="divide-y divide-black/5">
                  {state.navbarLinks.map((link) => (
                    <div key={link.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-[#121212]">{link.label}</p>
                        <p className="mt-1 text-sm text-[#6a6a6a]">{link.href}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-[#5f5f5f]">
                          <input type="checkbox" checked={link.visible} onChange={() => setState((current) => ({ ...current, navbarLinks: current.navbarLinks.map((item) => item.id === link.id ? { ...item, visible: !item.visible } : item) }))} />
                        </label>
                        <button className="rounded-full border border-black/5 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#5a5a5a]">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {activeModule === 'products' && (
              <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Products CMS</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">{editingProductId ? 'Edit product' : 'Create product'}</h2>
                    </div>
                    <Plus className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <form onSubmit={handleSaveProduct} className="grid gap-4">
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Product name" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Category" value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" type="number" placeholder="Price" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: Number(event.target.value) })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" type="number" placeholder="Stock" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: Number(event.target.value) })} />
                    <textarea className="min-h-[100px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Description" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} />
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={productForm.featured} onChange={(event) => setProductForm({ ...productForm, featured: event.target.checked })} />
                      Featured / best seller
                    </label>
                    <button type="submit" className="rounded-[2px] bg-[#C5A059] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black">{editingProductId ? 'Update product' : 'Publish product'}</button>
                  </form>
                </Panel>
                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Catalog</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">Manage product list</h2>
                    </div>
                    <Search className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <div className="divide-y divide-black/5">
                    {state.products.map((product) => (
                      <div key={product.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[#121212]">{product.name}</p>
                          <p className="mt-1 text-sm text-[#6a6a6a]">{product.category} • {product.stock} in stock</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-semibold text-[#121212]">Rs. {product.price}</p>
                          <button onClick={() => startEditProduct(product)} className="rounded-full border border-black/5 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#5a5a5a]">Edit</button>
                          <button onClick={() => deleteProduct(product.id)} className="rounded-full border border-[#C5A059]/20 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </section>
            )}

            {activeModule === 'categories' && (
              <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Category CMS</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">{editingCategoryId ? 'Edit category' : 'Create category'}</h2>
                    </div>
                    <Boxes className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <form onSubmit={saveCategory} className="grid gap-4">
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Category name" value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} />
                    <textarea className="min-h-[90px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Description" value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} />
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={categoryForm.featured} onChange={(event) => setCategoryForm({ ...categoryForm, featured: event.target.checked })} />
                      Featured collection
                    </label>
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={categoryForm.visible} onChange={(event) => setCategoryForm({ ...categoryForm, visible: event.target.checked })} />
                      Visible on storefront
                    </label>
                    <button type="submit" className="rounded-[2px] bg-[#C5A059] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black">{editingCategoryId ? 'Update category' : 'Add category'}</button>
                  </form>
                </Panel>
                <Panel>
                  <div className="divide-y divide-black/5">
                    {state.categories.map((category) => (
                      <div key={category.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[#121212]">{category.name}</p>
                          <p className="mt-1 text-sm text-[#6a6a6a]">{category.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => editCategory(category)} className="rounded-full border border-black/5 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#5a5a5a]">Edit</button>
                          <button onClick={() => deleteCategory(category.id)} className="rounded-full border border-[#C5A059]/20 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </section>
            )}

            {activeModule === 'collections' && (
              <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Collection CMS</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">{editingCollectionId ? 'Edit collection' : 'Create collection'}</h2>
                    </div>
                    <ShoppingBag className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <form onSubmit={saveCollection} className="grid gap-4">
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Collection name" value={collectionForm.name} onChange={(event) => setCollectionForm({ ...collectionForm, name: event.target.value })} />
                    <textarea className="min-h-[90px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Description" value={collectionForm.description} onChange={(event) => setCollectionForm({ ...collectionForm, description: event.target.value })} />
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={collectionForm.featured} onChange={(event) => setCollectionForm({ ...collectionForm, featured: event.target.checked })} />
                      Featured
                    </label>
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={collectionForm.visible} onChange={(event) => setCollectionForm({ ...collectionForm, visible: event.target.checked })} />
                      Visible on storefront
                    </label>
                    <button type="submit" className="rounded-[2px] bg-[#C5A059] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black">{editingCollectionId ? 'Update collection' : 'Add collection'}</button>
                  </form>
                </Panel>
                <Panel>
                  <div className="divide-y divide-black/5">
                    {state.collections.map((collection) => (
                      <div key={collection.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[#121212]">{collection.name}</p>
                          <p className="mt-1 text-sm text-[#6a6a6a]">{collection.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => editCollection(collection)} className="rounded-full border border-black/5 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#5a5a5a]">Edit</button>
                          <button onClick={() => deleteCollection(collection.id)} className="rounded-full border border-[#C5A059]/20 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </section>
            )}

            {activeModule === 'creatives' && (
              <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Creative CMS</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">{editingCreativeId ? 'Edit creative' : 'Create creative'}</h2>
                    </div>
                    <Camera className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <form onSubmit={saveCreative} className="grid gap-4">
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Title" value={creativeForm.title} onChange={(event) => setCreativeForm({ ...creativeForm, title: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Category" value={creativeForm.category} onChange={(event) => setCreativeForm({ ...creativeForm, category: event.target.value })} />
                    <textarea className="min-h-[90px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Feature copy" value={creativeForm.feature} onChange={(event) => setCreativeForm({ ...creativeForm, feature: event.target.value })} />
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={creativeForm.featured} onChange={(event) => setCreativeForm({ ...creativeForm, featured: event.target.checked })} />
                      Featured
                    </label>
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={creativeForm.visible} onChange={(event) => setCreativeForm({ ...creativeForm, visible: event.target.checked })} />
                      Visible on storefront
                    </label>
                    <button type="submit" className="rounded-[2px] bg-[#C5A059] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black">{editingCreativeId ? 'Update creative' : 'Add creative'}</button>
                  </form>
                </Panel>
                <Panel>
                  <div className="divide-y divide-black/5">
                    {state.creatives.map((creative) => (
                      <div key={creative.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[#121212]">{creative.title}</p>
                          <p className="mt-1 text-sm text-[#6a6a6a]">{creative.feature}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => editCreative(creative)} className="rounded-full border border-black/5 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#5a5a5a]">Edit</button>
                          <button onClick={() => deleteCreative(creative.id)} className="rounded-full border border-[#C5A059]/20 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </section>
            )}

            {activeModule === 'media' && (
              <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Media CMS</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">{editingMediaId ? 'Edit asset' : 'Upload asset'}</h2>
                    </div>
                    <Video className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <form onSubmit={saveMedia} className="grid gap-4">
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Title" value={mediaForm.title} onChange={(event) => setMediaForm({ ...mediaForm, title: event.target.value })} />
                    <select className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" value={mediaForm.type} onChange={(event) => setMediaForm({ ...mediaForm, type: event.target.value as AdminMediaAsset['type'] })}>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Source URL" value={mediaForm.src} onChange={(event) => setMediaForm({ ...mediaForm, src: event.target.value })} />
                    <textarea className="min-h-[90px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Caption" value={mediaForm.caption} onChange={(event) => setMediaForm({ ...mediaForm, caption: event.target.value })} />
                    <button type="submit" className="rounded-[2px] bg-[#C5A059] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black">{editingMediaId ? 'Update asset' : 'Add asset'}</button>
                  </form>
                </Panel>
                <Panel>
                  <div className="divide-y divide-black/5">
                    {state.media.map((asset) => (
                      <div key={asset.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[#121212]">{asset.title}</p>
                          <p className="mt-1 text-sm text-[#6a6a6a]">{asset.caption}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => editMedia(asset)} className="rounded-full border border-black/5 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#5a5a5a]">Edit</button>
                          <button onClick={() => deleteMedia(asset.id)} className="rounded-full border border-[#C5A059]/20 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </section>
            )}

            {activeModule === 'story' && (
              <Panel>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Brand Story CMS</p>
                    <h2 className="mt-2 text-xl font-light text-[#121212]">Edit editorial narrative</h2>
                  </div>
                  <Newspaper className="h-5 w-5 text-[#C5A059]" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <textarea className="min-h-[100px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" value={state.brandStory.mission} onChange={(event) => setState((current) => ({ ...current, brandStory: { ...current.brandStory, mission: event.target.value } }))} placeholder="Mission" />
                  <textarea className="min-h-[100px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" value={state.brandStory.vision} onChange={(event) => setState((current) => ({ ...current, brandStory: { ...current.brandStory, vision: event.target.value } }))} placeholder="Vision" />
                  <textarea className="min-h-[100px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" value={state.brandStory.story} onChange={(event) => setState((current) => ({ ...current, brandStory: { ...current.brandStory, story: event.target.value } }))} placeholder="Story" />
                  <textarea className="min-h-[100px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" value={state.brandStory.craftsmanship} onChange={(event) => setState((current) => ({ ...current, brandStory: { ...current.brandStory, craftsmanship: event.target.value } }))} placeholder="Craftsmanship" />
                  <textarea className="min-h-[100px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" value={state.brandStory.quality} onChange={(event) => setState((current) => ({ ...current, brandStory: { ...current.brandStory, quality: event.target.value } }))} placeholder="Quality" />
                </div>
              </Panel>
            )}

            {activeModule === 'testimonials' && (
              <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Testimonials CMS</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">{editingTestimonialId ? 'Edit testimonial' : 'Create review'}</h2>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <form onSubmit={saveTestimonial} className="grid gap-4">
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Customer name" value={testimonialForm.name} onChange={(event) => setTestimonialForm({ ...testimonialForm, name: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Location" value={testimonialForm.location} onChange={(event) => setTestimonialForm({ ...testimonialForm, location: event.target.value })} />
                    <textarea className="min-h-[90px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Review" value={testimonialForm.review} onChange={(event) => setTestimonialForm({ ...testimonialForm, review: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" type="number" placeholder="Rating" value={testimonialForm.rating} onChange={(event) => setTestimonialForm({ ...testimonialForm, rating: Number(event.target.value) })} />
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={testimonialForm.visible} onChange={(event) => setTestimonialForm({ ...testimonialForm, visible: event.target.checked })} />
                      Visible on site
                    </label>
                    <button type="submit" className="rounded-[2px] bg-[#C5A059] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black">{editingTestimonialId ? 'Update review' : 'Publish review'}</button>
                  </form>
                </Panel>
                <Panel>
                  <div className="divide-y divide-black/5">
                    {state.testimonials.map((item) => (
                      <div key={item.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[#121212]">{item.name}</p>
                          <p className="mt-1 text-sm text-[#6a6a6a]">{item.review}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => editTestimonial(item)} className="rounded-full border border-black/5 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#5a5a5a]">Edit</button>
                          <button onClick={() => deleteTestimonial(item.id)} className="rounded-full border border-[#C5A059]/20 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </section>
            )}

            {activeModule === 'gallery' && (
              <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Gallery CMS</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">{editingGalleryId ? 'Edit gallery item' : 'Create gallery item'}</h2>
                    </div>
                    <FileImage className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <form onSubmit={saveGallery} className="grid gap-4">
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Title" value={galleryForm.title} onChange={(event) => setGalleryForm({ ...galleryForm, title: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Image URL" value={galleryForm.src} onChange={(event) => setGalleryForm({ ...galleryForm, src: event.target.value })} />
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={galleryForm.featured} onChange={(event) => setGalleryForm({ ...galleryForm, featured: event.target.checked })} />
                      Featured
                    </label>
                    <button type="submit" className="rounded-[2px] bg-[#C5A059] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black">{editingGalleryId ? 'Update item' : 'Add item'}</button>
                  </form>
                </Panel>
                <Panel>
                  <div className="divide-y divide-black/5">
                    {state.gallery.map((item) => (
                      <div key={item.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[#121212]">{item.title}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => editGallery(item)} className="rounded-full border border-black/5 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#5a5a5a]">Edit</button>
                          <button onClick={() => deleteGallery(item.id)} className="rounded-full border border-[#C5A059]/20 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </section>
            )}

            {activeModule === 'newsletter' && (
              <Panel>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Newsletter CMS</p>
                    <h2 className="mt-2 text-xl font-light text-[#121212]">Edit subscription experience</h2>
                  </div>
                  <Bell className="h-5 w-5 text-[#C5A059]" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[2px] border border-black/5 bg-[#faf7f0] p-4">
                    <label className="mb-2 block text-sm text-[#6a6a6a]">Heading</label>
                    <input className="w-full rounded-[2px] border border-black/5 bg-white px-4 py-3 text-sm outline-none" value={state.newsletter.heading} onChange={(event) => setState((current) => ({ ...current, newsletter: { ...current.newsletter, heading: event.target.value } }))} />
                  </div>
                  <div className="rounded-[2px] border border-black/5 bg-[#faf7f0] p-4">
                    <label className="mb-2 block text-sm text-[#6a6a6a]">CTA</label>
                    <input className="w-full rounded-[2px] border border-black/5 bg-white px-4 py-3 text-sm outline-none" value={state.newsletter.cta} onChange={(event) => setState((current) => ({ ...current, newsletter: { ...current.newsletter, cta: event.target.value } }))} />
                  </div>
                  <textarea className="min-h-[100px] rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" value={state.newsletter.description} onChange={(event) => setState((current) => ({ ...current, newsletter: { ...current.newsletter, description: event.target.value } }))} placeholder="Description" />
                  <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" type="number" value={state.newsletter.subscribers} onChange={(event) => setState((current) => ({ ...current, newsletter: { ...current.newsletter, subscribers: Number(event.target.value) } }))} />
                </div>
              </Panel>
            )}

            {activeModule === 'footer' && (
              <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Footer CMS</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">{editingFooterId ? 'Edit link' : 'Create footer link'}</h2>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <form onSubmit={saveFooterLink} className="grid gap-4">
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Label" value={footerForm.label} onChange={(event) => setFooterForm({ ...footerForm, label: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="URL" value={footerForm.href} onChange={(event) => setFooterForm({ ...footerForm, href: event.target.value })} />
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={footerForm.visible} onChange={(event) => setFooterForm({ ...footerForm, visible: event.target.checked })} />
                      Visible
                    </label>
                    <button type="submit" className="rounded-[2px] bg-[#C5A059] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black">{editingFooterId ? 'Update link' : 'Add link'}</button>
                  </form>
                </Panel>
                <Panel>
                  <div className="divide-y divide-black/5">
                    {state.footerLinks.map((link) => (
                      <div key={link.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[#121212]">{link.label}</p>
                          <p className="mt-1 text-sm text-[#6a6a6a]">{link.href}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => editFooterLink(link)} className="rounded-full border border-black/5 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#5a5a5a]">Edit</button>
                          <button onClick={() => deleteFooterLink(link.id)} className="rounded-full border border-[#C5A059]/20 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </section>
            )}

            {activeModule === 'customers' && (
              <Panel>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Customer CMS</p>
                    <h2 className="mt-2 text-xl font-light text-[#121212]">Manage customer profiles</h2>
                  </div>
                  <UserCircle2 className="h-5 w-5 text-[#C5A059]" />
                </div>
                <div className="divide-y divide-black/5">
                  {state.customers.map((customer) => (
                    <div key={customer.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-[#121212]">{customer.name}</p>
                        <p className="mt-1 text-sm text-[#6a6a6a]">{customer.email} • {customer.tier}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b54]">{customer.status}</span>
                        <button className="rounded-full border border-black/5 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#5a5a5a]">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {activeModule === 'orders' && (
              <Panel>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Order lifecycle</p>
                    <h2 className="mt-2 text-xl font-light text-[#121212]">Manage order states</h2>
                  </div>
                  <ShoppingBag className="h-5 w-5 text-[#C5A059]" />
                </div>
                <div className="divide-y divide-black/5">
                  {state.orders.map((order) => (
                    <div key={order.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-[#121212]">{order.customer}</p>
                        <p className="mt-1 text-sm text-[#6a6a6a]">{order.item} • {order.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-[#121212]">Rs. {order.amount.toLocaleString()}</p>
                        <select className="rounded-full border border-black/5 bg-[#faf7f0] px-3 py-2 text-sm text-[#121212]" value={order.status} onChange={(event) => setState((current) => ({ ...current, orders: current.orders.map((item) => item.id === order.id ? { ...item, status: event.target.value as AdminOrder['status'] } : item) }))}>
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {activeModule === 'inventory' && (
              <Panel>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Inventory CMS</p>
                    <h2 className="mt-2 text-xl font-light text-[#121212]">Track stock health</h2>
                  </div>
                  <Warehouse className="h-5 w-5 text-[#C5A059]" />
                </div>
                <div className="divide-y divide-black/5">
                  {state.inventory.map((item) => (
                    <div key={item.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-[#121212]">{item.name}</p>
                        <p className="mt-1 text-sm text-[#6a6a6a]">{item.sku}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-[#121212]">{item.stock} units</p>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b54]">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {activeModule === 'discounts' && (
              <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Discount CMS</p>
                      <h2 className="mt-2 text-xl font-light text-[#121212]">{editingDiscountId ? 'Edit offer' : 'Create offer'}</h2>
                    </div>
                    <Ticket className="h-5 w-5 text-[#C5A059]" />
                  </div>
                  <form onSubmit={saveDiscount} className="grid gap-4">
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Code" value={discountForm.code} onChange={(event) => setDiscountForm({ ...discountForm, code: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" placeholder="Type" value={discountForm.type} onChange={(event) => setDiscountForm({ ...discountForm, type: event.target.value })} />
                    <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" type="number" placeholder="Value" value={discountForm.value} onChange={(event) => setDiscountForm({ ...discountForm, value: Number(event.target.value) })} />
                    <label className="flex items-center gap-2 text-sm text-[#5f5f5f]">
                      <input type="checkbox" checked={discountForm.active} onChange={(event) => setDiscountForm({ ...discountForm, active: event.target.checked })} />
                      Active
                    </label>
                    <button type="submit" className="rounded-[2px] bg-[#C5A059] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black">{editingDiscountId ? 'Update offer' : 'Create offer'}</button>
                  </form>
                </Panel>
                <Panel>
                  <div className="divide-y divide-black/5">
                    {state.discounts.map((discount) => (
                      <div key={discount.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[#121212]">{discount.code}</p>
                          <p className="mt-1 text-sm text-[#6a6a6a]">{discount.type} • {discount.value}%</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => editDiscount(discount)} className="rounded-full border border-black/5 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#5a5a5a]">Edit</button>
                          <button onClick={() => deleteDiscount(discount.id)} className="rounded-full border border-[#C5A059]/20 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </section>
            )}

            {activeModule === 'analytics' && (
              <Panel>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Analytics CMS</p>
                    <h2 className="mt-2 text-xl font-light text-[#121212]">Performance overview</h2>
                  </div>
                  <TrendingUp className="h-5 w-5 text-[#C5A059]" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {state.analytics.map((metric) => (
                    <div key={metric.id} className="rounded-[2px] border border-black/5 bg-[#faf7f0] p-4">
                      <p className="text-sm text-[#6a6a6a]">{metric.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-[#121212]">{metric.value}</p>
                      <p className="mt-2 text-sm text-[#C5A059]">{metric.change}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {activeModule === 'assets' && (
              <Panel>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Asset Manager</p>
                    <h2 className="mt-2 text-xl font-light text-[#121212]">Centralized brand files</h2>
                  </div>
                  <FileImage className="h-5 w-5 text-[#C5A059]" />
                </div>
                <div className="rounded-[2px] border border-dashed border-black/10 bg-[#faf7f0] p-8 text-center text-sm text-[#6a6a6a]">
                  Drag and drop campaign files, logos, posters, and product photography into the media library for instant publishing.
                </div>
              </Panel>
            )}

            {activeModule === 'settings' && (
              <Panel>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">Settings</p>
                    <h2 className="mt-2 text-xl font-light text-[#121212]">Brand system controls</h2>
                  </div>
                  <Settings className="h-5 w-5 text-[#C5A059]" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" value={state.settings.brandName} onChange={(event) => setState((current) => ({ ...current, settings: { ...current.settings, brandName: event.target.value } }))} placeholder="Brand name" />
                  <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" value={state.settings.logo} onChange={(event) => setState((current) => ({ ...current, settings: { ...current.settings, logo: event.target.value } }))} placeholder="Logo path" />
                  <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" value={state.settings.seoTitle} onChange={(event) => setState((current) => ({ ...current, settings: { ...current.settings, seoTitle: event.target.value } }))} placeholder="SEO title" />
                  <input className="rounded-[2px] border border-black/5 bg-[#faf7f0] px-4 py-3 text-sm outline-none" value={state.settings.social} onChange={(event) => setState((current) => ({ ...current, settings: { ...current.settings, social: event.target.value } }))} placeholder="Social handle" />
                </div>
              </Panel>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
