'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { brandAssets } from '@/config/brandAssets';
import { mockProducts, mockCreativeShowcase, mockMediaShowcase } from '@/config/cmsMockData';
import { shopProducts } from '@/data/shopData';
import { bestSellerProducts } from '@/data/bestSellersData';
import { supabase } from '@/lib/supabase';


// Define schemas
export interface HeroSlide {
  id: string | number;
  image: string;
  title: string;
  subtitle: string;
  cta1: string;
  cta2: string;
}

export interface CategoryGridItem {
  name: string;
  image: string;
  count: number;
}

export interface BrandStoryData {
  title?: string;
  subtitle?: string;
  description?: string;
  mission?: string;
  vision?: string;
  image?: string;
  stat1_number?: string;
  stat1_label?: string;
  stat2_number?: string;
  stat2_label?: string;
}


export interface VideoHeroData {
  src: string;
  poster: string;
  title?: string;
  cta?: string;
}

export interface TestimonialItem {
  id: string | number;
  name: string;
  location?: string;
  review: string;
  rating: number;
  avatar: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface CmsDataState {
  announcement: {
    text: string;
    background?: string;
    textColor?: string;
    visible?: boolean;
  };
  hero: HeroSlide[];
  categories: CategoryGridItem[];
  trendingProducts: any[];
  luxuryBanner: {
    title: string;
    subtitle: string;
    image: string;
    cta: string;
    href: string;
  };
  everydayBanner: {
    title: string;
    subtitle: string;
    image: string;
    cta: string;
    href: string;
  };
  creativeShowcase: any[];
  mediaShowcase: any[];
  brandStory: BrandStoryData;
  videoHero: VideoHeroData;
  testimonials: TestimonialItem[];
  gallery: string[];
  newsletter: {
    heading: string;
    description: string;
    cta: string;
  };
  shopProducts: any[];
  team: TeamMember[];
  services: { title: string; desc: string; }[];
  about: {
    title: string;
    subtitle: string;
    story: string;
    image: string;
  };
  orders: any[];
  customers: any[];
  discounts: any[];
  pageLayouts: {
    [page: string]: SectionLayout[];
  };
}

export interface SectionLayout {
  id: string;
  name: string;
  type: string;
  visible: boolean;
}

interface AdminContextProps {
  isAdmin: boolean;
  isEditMode: boolean;
  setEditMode: (val: boolean) => void;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  activeItemIndex: number | null;
  setActiveItemIndex: (idx: number | null) => void;
  activeItemType: string | null;
  setActiveItemType: (type: string | null) => void;
  cmsData: CmsDataState;
  updateCmsData: (section: keyof CmsDataState, fieldOrValue: any, value?: any) => void;
  reorderCmsItem: (section: keyof CmsDataState, fromIndex: number, toIndex: number) => void;
  deleteCmsItem: (section: keyof CmsDataState, index: number) => void;
  addCmsItem: (section: keyof CmsDataState, item: any) => void;
  moveSection: (pagePath: string, index: number, direction: 'up' | 'down') => void;
  toggleSectionVisibility: (pagePath: string, index: number) => void;
  deleteSection: (pagePath: string, index: number) => void;
  addSection: (pagePath: string, sectionType: string, customName?: string) => void;
  saveDraft: () => void;
  publishChanges: () => Promise<void>;
  discardChanges: () => void;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  user: any;
  isAdminUser: boolean;
  isLoadingAuth: boolean;
}

const initialCmsData: CmsDataState = {
  announcement: {
    text: "Complimentary shipping on all orders over Rs. 15,000",
    background: "#121212",
    textColor: "#f7f4ee",
    visible: true,
  },
  hero: [
    {
      id: 1,
      image: brandAssets.hero[0].image,
      title: "THE ECLIPSE SERIES",
      subtitle: "Geometric Precision Meets Raw Acetate",
      cta1: "Shop Eclipse",
      cta2: "Atelier Vision",
    },
    {
      id: 2,
      image: brandAssets.hero[1].image,
      title: "STRUCTURAL LINEARITY",
      subtitle: "Handcrafted Frames for the Discerning",
      cta1: "Shop Collection",
      cta2: "Heritage Story",
    }
  ],
  categories: [
    { name: 'Luxury', image: brandAssets.categories.luxury, count: 24 },
    { name: 'Everyday', image: brandAssets.categories.everyday, count: 42 },
    { name: 'Aviator', image: brandAssets.categories.aviator, count: 12 },
    { name: 'Wayfarer', image: brandAssets.categories.wayfarer, count: 31 },
    { name: 'Round', image: brandAssets.categories.round, count: 9 },
    { name: 'Square', image: brandAssets.categories.square, count: 15 },
  ],
  trendingProducts: bestSellerProducts,
  luxuryBanner: {
    title: "THE LUXURY CAPSULE",
    subtitle: "Shorn of excessive detail, focusing entirely on structural weight and clean angles. Designed for architectural symmetry.",
    image: brandAssets.collections.luxury,
    cta: "Explore Atelier",
    href: "/best-sellers"
  },
  everydayBanner: {
    title: "EVERYDAY ESSENTIALS",
    subtitle: "Comfort-engineered fits utilizing hyper-light titanium hinges and double-polished raw organic acetates.",
    image: brandAssets.collections.everyday,
    cta: "Shop Essentials",
    href: "/shop"
  },
  creativeShowcase: mockCreativeShowcase,
  mediaShowcase: mockMediaShowcase,
  brandStory: {
    title: "OUR HERITAGE",
    subtitle: "THE ARCHITECTURE OF EYEWEAR",
    description: "Si Mirage was born from the desire to treat eyewear as a structural object. Every frame is designed with a specific geometric weight, architectural stability, and cinematic personality.",
    mission: "To eliminate the noise of mass-produced fashion and return to the discipline of craft.",
    vision: "A world where objects are bought to be kept, cherished, and styled with intellectual confidence.",
    image: "/images/20250201_233639.jpg",
    stat1_number: "24",
    stat1_label: "STEPS IN HAND-POLISHING",
    stat2_number: "100%",
    stat2_label: "JAPANESE TITANIUM HINGES",
  },
  videoHero: {
    src: brandAssets.video.src,
    poster: brandAssets.video.poster,
    title: "THE ESCAPE",
    cta: "WATCH OUR STORY",
  },
  testimonials: [
    {
      id: 1,
      name: "Sarah Jenkins",
      location: "New York, USA",
      review: "The build quality is phenomenal. I've owned glasses from Prada and Ray-Ban, and these feel far more substantial and architecturally sound. True studio art.",
      rating: 5,
      avatar: brandAssets.reviews[0].avatar,
    },
    {
      id: 2,
      name: "Noor Ali",
      location: "Karachi, PK",
      review: "Clean design and absolute premium materials. The service was as polished as the product itself.",
      rating: 5,
      avatar: brandAssets.reviews[1].avatar,
    },
    {
      id: 3,
      name: "Mina Shah",
      location: "Lahore, PK",
      review: "The lens quality is pristine. Beautiful glare filtering with zero distortion. My daily essential.",
      rating: 5,
      avatar: brandAssets.reviews[2].avatar,
    }
  ],
  gallery: brandAssets.instagram,
  newsletter: {
    heading: "JOIN THE MIRAGE",
    description: "Subscribe for early access to new collections, limited-edition designs, and invitation-only atelier launches.",
    cta: "Subscribe",
  },
  shopProducts: shopProducts,
  team: [
    { name: 'Zayn', role: 'Lead Designer', image: 'Team+Member+1' },
    { name: 'Sarah', role: 'Creative Director', image: 'Team+Member+2' },
    { name: 'Omar', role: 'Head of Marketing', image: 'Team+Member+3' },
    { name: 'Ayesha', role: 'Brand Ambassador', image: 'Team+Member+4' },
  ],
  services: [
    { title: "Premium Materials", desc: "Handcrafted Mazzucchelli acetate." },
    { title: "Polarized Clarity", desc: "Advanced UV400 lenses with anti-reflection." },
    { title: "Complimentary Delivery", desc: "Free express shipping nationwide." },
    { title: "Lifetime Warranty", desc: "Guaranteed craftsmanship on all frames." },
  ],
  about: {
    title: "Si Mirage",
    subtitle: "Atelier of Precision Eyewear",
    story: "Founded on the principles of architectural restraint, raw craftsmanship, and cinematic design, Si Mirage is a flagship studio dedicated to premium eyewear. We reject mass production in favor of small-batch capsule drops, utilizing the finest Italian acetates, Japanese hardware, and impact-resistant lenses.",
    image: "/images/20250201_233639.jpg"
  },
  orders: [],
  customers: [],
  discounts: [
    { id: 1, code: 'MIRAGE10', type: 'Percentage', value: 10, active: true },
    { id: 2, code: 'VIP20', type: 'Percentage', value: 20, active: false },
  ],
  pageLayouts: {
    '/': [
      { id: 'section-hero', name: 'Hero Slider Campaigns', type: 'hero', visible: true },
      { id: 'section-services', name: 'Premium Brand Services', type: 'services', visible: true },
      { id: 'section-creativeShowcase', name: 'Creative Showcases', type: 'creativeShowcase', visible: true },
      { id: 'section-categories', name: 'Silhouette Categories', type: 'categories', visible: true },
      { id: 'section-luxuryBanner', name: 'Luxury Capsule Banner', type: 'luxuryBanner', visible: true },
      { id: 'section-trendingProducts', name: 'Trending Carousel', type: 'trendingProducts', visible: true },
      { id: 'section-everydayBanner', name: 'Everyday Essentials Banner', type: 'everydayBanner', visible: true },
      { id: 'section-mediaShowcase', name: 'Media Campaigns Showcase', type: 'mediaShowcase', visible: true },
      { id: 'section-brandStory', name: 'Brand Editorial Story', type: 'brandStory', visible: true },
      { id: 'section-videoHero', name: 'Cinematic Video Hero', type: 'videoHero', visible: true },
      { id: 'section-testimonials', name: 'Customer Reviews', type: 'testimonials', visible: true },
      { id: 'section-gallery', name: 'Instagram Gallery Masonry', type: 'gallery', visible: true },
      { id: 'section-newsletter', name: 'Newsletter Minimal Form', type: 'newsletter', visible: true }
    ],
    '/about': [
      { id: 'section-about', name: 'About Editorial Story', type: 'about', visible: true }
    ],
    '/team': [
      { id: 'section-team', name: 'Atelier Team Grid', type: 'team', visible: true }
    ]
  }
};

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isLoginRoute = pathname === '/admin/login';
  
  const [isEditMode, setEditMode] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [activeItemType, setActiveItemType] = useState<string | null>(null);
  
  const [cmsData, setCmsData] = useState<CmsDataState>(initialCmsData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication State
  const [user, setUser] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Listen to Auth State Changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleAuthChange(session: any) {
    if (!session) {
      setUser(null);
      setIsAdminUser(false);
      setIsLoadingAuth(false);
      return;
    }

    setUser(session.user);

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data && !error) {
        setIsAdminUser(true);
      } else {
        setIsAdminUser(false);
      }
    } catch (e) {
      console.error('Error verifying admin user:', e);
      setIsAdminUser(false);
    } finally {
      setIsLoadingAuth(false);
    }
  }

  // Redirect visitors based on credentials
  useEffect(() => {
    if (isAdminRoute && !isLoginRoute && !isLoadingAuth && !user) {
      router.push('/admin/login');
    }
  }, [isAdminRoute, isLoginRoute, isLoadingAuth, user, router]);

  useEffect(() => {
    if (isLoginRoute && !isLoadingAuth && user && isAdminUser) {
      router.push('/admin');
    }
  }, [isLoginRoute, isLoadingAuth, user, isAdminUser, router]);

  const fetchFromSupabase = useCallback(async () => {
    setIsLoading(true);

    const safeFetch = async (tableName: string, queryBuilder: any) => {
      try {
        const { data, error } = await queryBuilder;
        if (error) {
          console.warn(`Error querying table "${tableName}":`, error.message);
          return null;
        }
        return data;
      } catch (e: any) {
        console.warn(`Exception querying table "${tableName}":`, e.message);
        return null;
      }
    };

    const dbProducts = await safeFetch('products', supabase.from('products').select('*'));
    const dbHeroSlides = await safeFetch('hero_slides', supabase.from('hero_slides').select('*').order('display_order', { ascending: true }));
    const dbAnnouncements = await safeFetch('announcements', supabase.from('announcements').select('*').order('display_order', { ascending: true }));
    const dbCategories = await safeFetch('categories', supabase.from('categories').select('*').order('display_order', { ascending: true }));
    const dbCollections = await safeFetch('collections', supabase.from('collections').select('*').order('display_order', { ascending: true }));
    const dbTestimonials = await safeFetch('testimonials', supabase.from('testimonials').select('*'));
    const dbGallery = await safeFetch('gallery_items', supabase.from('gallery_items').select('*').order('display_order', { ascending: true }));
    const dbTeam = await safeFetch('team_members', supabase.from('team_members').select('*'));
    const dbSettings = await safeFetch('site_settings', supabase.from('site_settings').select('*').limit(1));
    const dbOrders = await safeFetch('orders', supabase.from('orders').select('*'));
    const dbCustomers = await safeFetch('customers', supabase.from('customers').select('*'));
    const dbDiscounts = await safeFetch('discounts', supabase.from('discounts').select('*'));
    const dbCreative = await safeFetch('creative_showcases', supabase.from('creative_showcases').select('*').order('display_order', { ascending: true }));
    const dbMedia = await safeFetch('media_showcases', supabase.from('media_showcases').select('*').order('display_order', { ascending: true }));

    setCmsData(prev => {
      const updated = { ...prev };
      
      if (dbProducts && dbProducts.length > 0) {
        updated.shopProducts = dbProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category.toUpperCase(),
          price: Number(p.price),
          discountPrice: p.discount_price ? Number(p.discount_price) : undefined,
          image: p.image_url || p.images?.[0] || "/images/20250201_233239.jpg",
          hoverImage: p.hover_image_url || p.images?.[1] || p.images?.[0] || "/images/20250201_233239.jpg",
          isNew: p.is_new || false,
          stock: p.stock_quantity || 0,
          description: p.description || ''
        }));
        const featured = dbProducts.filter((p: any) => p.is_featured);
        if (featured.length > 0) {
          updated.trendingProducts = featured.slice(0, 4).map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category.toUpperCase(),
            price: Number(p.price),
            discountPrice: p.discount_price ? Number(p.discount_price) : undefined,
            image: p.image_url || p.images?.[0] || "/images/20250201_233239.jpg",
            hoverImage: p.hover_image_url || p.images?.[1] || p.images?.[0] || "/images/20250201_233239.jpg",
            isNew: p.is_new || false
          }));
        }
      }

      if (dbHeroSlides && dbHeroSlides.length > 0) {
        updated.hero = dbHeroSlides.map((h: any) => ({
          id: h.id,
          image: h.image_url,
          title: h.title,
          subtitle: h.subtitle,
          cta1: h.cta1_text,
          cta2: h.cta2_text
        }));
      }

      if (dbAnnouncements && dbAnnouncements.length > 0) {
        const active = dbAnnouncements.find((a: any) => a.is_active);
        if (active) {
          updated.announcement = {
            text: active.message,
            background: "#121212",
            textColor: "#f7f4ee",
            visible: true
          };
        }
      }

      if (dbCategories && dbCategories.length > 0) {
        updated.categories = dbCategories.map((c: any) => ({
          name: c.name,
          image: c.image_url || "/images/20250201_233730.jpg",
          count: 18
        }));
      }

      if (dbCollections && dbCollections.length > 0) {
        const lux = dbCollections.find((c: any) => c.slug === 'luxury');
        if (lux) {
          updated.luxuryBanner = {
            title: lux.name.toUpperCase(),
            subtitle: lux.description || "",
            image: lux.image_url || brandAssets.collections.luxury,
            cta: "Explore Atelier",
            href: "/best-sellers"
          };
        }
        const every = dbCollections.find((c: any) => c.slug === 'everyday');
        if (every) {
          updated.everydayBanner = {
            title: every.name.toUpperCase(),
            subtitle: every.description || "",
            image: every.image_url || brandAssets.collections.everyday,
            cta: "Shop Essentials",
            href: "/shop"
          };
        }
      }

      if (dbTestimonials && dbTestimonials.length > 0) {
        updated.testimonials = dbTestimonials.map((t: any) => ({
          id: t.id,
          name: t.name,
          location: t.location || "",
          review: t.review,
          rating: t.rating || 5,
          avatar: t.avatar_url || brandAssets.reviews[0].avatar
        }));
      }

      if (dbGallery && dbGallery.length > 0) {
        updated.gallery = dbGallery.map((g: any) => g.image_url);
      }

      if (dbTeam && dbTeam.length > 0) {
        updated.team = dbTeam.map((t: any) => ({
          name: t.name,
          role: t.role,
          image: t.photo_url || "Team+Member+1"
        }));
      }

      if (dbSettings && dbSettings[0]) {
        const s = dbSettings[0];
        updated.newsletter = {
          heading: s.newsletter_heading || "THE INSIDER",
          description: s.newsletter_description || "Subscribe to receive early access to new collections.",
          cta: "Subscribe"
        };
        if (s.page_layouts) {
          updated.pageLayouts = typeof s.page_layouts === 'string' 
            ? JSON.parse(s.page_layouts) 
            : s.page_layouts;
        }
      }

      if (dbOrders && dbOrders.length > 0) {
        updated.orders = dbOrders.map((o: any) => ({
          id: o.id.slice(0, 8),
          customer: o.shipping_address?.name || "Customer",
          email: o.shipping_address?.email || "customer@example.com",
          item: o.items?.[0]?.name || "Eyewear",
          amount: Number(o.total_amount),
          status: o.status === 'pending' ? 'Pending' : o.status === 'processing' ? 'Paid' : 'Shipped',
          date: new Date(o.created_at).toISOString().split('T')[0]
        }));
      }

      if (dbCustomers && dbCustomers.length > 0) {
        updated.customers = dbCustomers.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          tier: c.phone ? 'VIP' : 'New',
          orders: 1,
          status: 'Active'
        }));
      }

      if (dbDiscounts && dbDiscounts.length > 0) {
        updated.discounts = dbDiscounts.map((d: any) => ({
          id: d.id,
          code: d.code,
          type: d.type === 'percentage' ? 'Percentage' : 'Flat',
          value: Number(d.value),
          active: d.is_active
        }));
      }

      if (dbCreative && dbCreative.length > 0) {
        updated.creativeShowcase = dbCreative.map((c: any) => ({
          id: c.id,
          title: c.title,
          subtitle: c.subtitle,
          coverImage: c.cover_image,
          category: c.category,
          description: c.description,
          size: c.size
        }));
      }

      if (dbMedia && dbMedia.length > 0) {
        updated.mediaShowcase = dbMedia.map((m: any) => ({
          id: m.id,
          title: m.title,
          subtitle: m.subtitle,
          coverImage: m.cover_image,
          video: m.video_url,
          type: m.type,
          layout: m.layout
        }));
      }

      return updated;
    });
    setIsLoading(false);
  }, []);

  // Load from Supabase on init
  useEffect(() => {
    fetchFromSupabase();
  }, [fetchFromSupabase]);

  // Realtime Database synchronization to keep client storefront and admin view in sync instantly
  useEffect(() => {
    const channel = supabase
      .channel('realtime-cms-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Realtime change detected in database:', payload.table);
          fetchFromSupabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFromSupabase]);

  // Sync state to localStorage for unsaved drafts
  const saveDraft = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('si-mirage-cms-draft', JSON.stringify(cmsData));
      setHasUnsavedChanges(false);
      alert('Draft saved locally! Remember to click "Publish" to sync to the live database.');
    }
  };

  const discardChanges = () => {
    if (confirm('Are you sure you want to discard all unsaved edits?')) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('si-mirage-cms-draft');
      }
      window.location.reload();
    }
  };

  // Warn on leave if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved edits in the Visual CMS. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Update CMS data locally for instant live preview
  const updateCmsData = (section: keyof CmsDataState, fieldOrValue: any, value?: any) => {
    setHasUnsavedChanges(true);
    setCmsData(prev => {
      const next = { ...prev };
      
      if (value !== undefined) {
        // Nested field update (e.g. section='newsletter', fieldOrValue='heading', value='Hello')
        const currentSection = next[section] as any;
        if (typeof currentSection === 'object' && !Array.isArray(currentSection)) {
          next[section] = {
            ...currentSection,
            [fieldOrValue]: value
          };
        }
      } else {
        // Direct value update (e.g. section='hero', fieldOrValue=newHeroArray)
        next[section] = fieldOrValue;
      }
      
      return next;
    });
  };

  const reorderCmsItem = (section: keyof CmsDataState, fromIndex: number, toIndex: number) => {
    const arr = cmsData[section];
    if (!Array.isArray(arr)) return;
    
    setHasUnsavedChanges(true);
    const result = Array.from(arr);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    
    setCmsData(prev => ({
      ...prev,
      [section]: result
    }));
  };

  const deleteCmsItem = (section: keyof CmsDataState, index: number) => {
    const arr = cmsData[section];
    if (!Array.isArray(arr)) return;
    
    setHasUnsavedChanges(true);
    const result = Array.from(arr);
    result.splice(index, 1);
    
    setCmsData(prev => ({
      ...prev,
      [section]: result
    }));
  };

  const addCmsItem = (section: keyof CmsDataState, item: any) => {
    const arr = cmsData[section];
    if (!Array.isArray(arr)) return;
    
    setHasUnsavedChanges(true);
    setCmsData(prev => ({
      ...prev,
      [section]: [item, ...arr]
    }));
  };

  const moveSection = (pagePath: string, index: number, direction: 'up' | 'down') => {
    const layout = cmsData.pageLayouts?.[pagePath];
    if (!layout) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= layout.length) return;

    setHasUnsavedChanges(true);
    const newLayout = [...layout];
    const [moved] = newLayout.splice(index, 1);
    newLayout.splice(newIndex, 0, moved);

    setCmsData(prev => ({
      ...prev,
      pageLayouts: {
        ...prev.pageLayouts,
        [pagePath]: newLayout
      }
    }));
  };

  const toggleSectionVisibility = (pagePath: string, index: number) => {
    const layout = cmsData.pageLayouts?.[pagePath];
    if (!layout) return;

    setHasUnsavedChanges(true);
    const newLayout = layout.map((s, idx) => 
      idx === index ? { ...s, visible: !s.visible } : s
    );

    setCmsData(prev => ({
      ...prev,
      pageLayouts: {
        ...prev.pageLayouts,
        [pagePath]: newLayout
      }
    }));
  };

  const deleteSection = (pagePath: string, index: number) => {
    const layout = cmsData.pageLayouts?.[pagePath];
    if (!layout) return;

    if (!confirm('Are you sure you want to delete this section from the page?')) return;

    setHasUnsavedChanges(true);
    const newLayout = [...layout];
    newLayout.splice(index, 1);

    setCmsData(prev => ({
      ...prev,
      pageLayouts: {
        ...prev.pageLayouts,
        [pagePath]: newLayout
      }
    }));
  };

  const addSection = (pagePath: string, sectionType: string, customName?: string) => {
    const layout = cmsData.pageLayouts?.[pagePath] || [];
    
    setHasUnsavedChanges(true);
    const id = `section-${sectionType}-${Date.now()}`;
    const name = customName || sectionType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    
    const newSection = {
      id,
      name,
      type: sectionType,
      visible: true
    };

    setCmsData(prev => ({
      ...prev,
      pageLayouts: {
        ...prev.pageLayouts,
        [pagePath]: [...layout, newSection]
      }
    }));
  };

  // Publish live draft to Supabase database
  const publishChanges = async () => {
    setIsLoading(true);
    try {
      // 1. Publish Hero Slides
      await supabase.from('hero_slides').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // clear all
      const heroSlidesToInsert = cmsData.hero.map((h, idx) => ({
        title: h.title,
        subtitle: h.subtitle,
        image_url: h.image,
        cta1_text: h.cta1,
        cta2_text: h.cta2,
        display_order: idx,
        is_active: true
      }));
      await supabase.from('hero_slides').insert(heroSlidesToInsert);

      // 2. Publish Announcement Bar
      await supabase.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('announcements').insert([{
        message: cmsData.announcement.text,
        is_active: true,
        display_order: 1
      }]);

      // 3. Publish Testimonials
      await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const testimonialsToInsert = cmsData.testimonials.map(t => ({
        name: t.name,
        location: t.location,
        review: t.review,
        rating: t.rating,
        avatar_url: t.avatar,
        is_active: true,
        is_featured: true
      }));
      await supabase.from('testimonials').insert(testimonialsToInsert);

      // 4. Publish Categories
      await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const categoriesToInsert = cmsData.categories.map((c, idx) => ({
        name: c.name,
        slug: c.name.toLowerCase().replace(' ', '-'),
        image_url: c.image,
        display_order: idx,
        is_featured: idx < 3,
        is_active: true
      }));
      await supabase.from('categories').insert(categoriesToInsert);

      // 5. Publish Collections
      await supabase.from('collections').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('collections').insert([
        {
          name: cmsData.luxuryBanner.title,
          slug: 'luxury',
          description: cmsData.luxuryBanner.subtitle,
          image_url: cmsData.luxuryBanner.image,
          display_order: 1,
          is_featured: true,
          is_active: true
        },
        {
          name: cmsData.everydayBanner.title,
          slug: 'everyday',
          description: cmsData.everydayBanner.subtitle,
          image_url: cmsData.everydayBanner.image,
          display_order: 2,
          is_featured: true,
          is_active: true
        }
      ]);

      // 6. Publish Team members
      await supabase.from('team_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const teamToInsert = cmsData.team.map(t => ({
        name: t.name,
        role: t.role,
        photo_url: t.image,
        is_active: true
      }));
      await supabase.from('team_members').insert(teamToInsert);

      // 7. Publish Gallery Items
      await supabase.from('gallery_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const galleryToInsert = cmsData.gallery.map((g, idx) => ({
        image_url: g,
        display_order: idx,
        is_active: true
      }));
      await supabase.from('gallery_items').insert(galleryToInsert);

      // 8. Publish Site Settings
      await supabase.from('site_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('site_settings').insert([{
        newsletter_heading: cmsData.newsletter.heading,
        newsletter_description: cmsData.newsletter.description,
        page_layouts: cmsData.pageLayouts
      }]);

      // 9. Sync Products
      const currentIds = cmsData.shopProducts.map(p => p.id).filter(id => typeof id === 'string');
      if (currentIds.length > 0) {
        await supabase.from('products').delete().not('id', 'in', `(${currentIds.join(',')})`);
      } else {
        await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      }

      const productsToUpsert = cmsData.shopProducts.map(p => {
        const productObj: any = {
          name: p.name,
          description: p.description || '',
          price: Number(p.price) || 0,
          discount_price: p.discountPrice ? Number(p.discountPrice) : null,
          category: p.category.toLowerCase(),
          stock_quantity: Number(p.stock) || 0,
          images: [p.image, p.hoverImage].filter(Boolean),
          is_featured: cmsData.trendingProducts.some(tp => tp.id === p.id)
        };
        if (typeof p.id === 'string' && p.id.includes('-')) {
          productObj.id = p.id;
        }
        return productObj;
      });
      await supabase.from('products').upsert(productsToUpsert);

      // 10. Sync Creative Showcases
      await supabase.from('creative_showcases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const creativeToInsert = (cmsData.creativeShowcase || []).map((item, idx) => ({
        title: item.title || '',
        subtitle: item.subtitle || '',
        image_url: item.image || '',
        size: item.size || 'medium',
        display_order: idx,
        is_active: true
      }));
      await supabase.from('creative_showcases').insert(creativeToInsert);

      // 11. Sync Media Showcases
      await supabase.from('media_showcases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const mediaToInsert = (cmsData.mediaShowcase || []).map((item, idx) => ({
        title: item.title || '',
        subtitle: item.subtitle || '',
        video_url: item.video || '',
        layout: item.layout || 'split',
        display_order: idx,
        is_active: true
      }));
      await supabase.from('media_showcases').insert(mediaToInsert);

      setHasUnsavedChanges(false);
      alert('CMS changes published successfully to the live storefront database!');
    } catch (err) {
      console.error(err);
      alert('Failed to publish changes to Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auth/Admin Guard overlays inside render block
  if (isAdminRoute && !isLoginRoute) {
    if (isLoadingAuth) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0d] text-[#f7f4ee] font-sans">
          <div className="text-center space-y-4 animate-pulse">
            <h1 className="font-serif text-3xl tracking-[0.3em] text-[#C5A059] uppercase">Si Mirage</h1>
            <p className="text-[10px] tracking-[0.4em] text-[#f7f4ee]/40 uppercase">Loading Atelier Workspace</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0d] text-[#f7f4ee] font-sans">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-3xl tracking-[0.3em] text-[#C5A059] uppercase">Si Mirage</h1>
            <p className="text-[10px] tracking-[0.4em] text-[#f7f4ee]/40 uppercase animate-pulse">Redirecting to Login...</p>
          </div>
        </div>
      );
    }

    if (!isAdminUser) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0d] text-[#f7f4ee] font-sans px-6">
          <div className="text-center max-w-md space-y-6 border border-[#C5A059]/20 p-12 bg-[#121212]/80 backdrop-blur-md">
            <h1 className="font-serif text-3xl tracking-[0.2em] text-[#C5A059] uppercase">Access Denied</h1>
            <div className="h-[1px] w-12 bg-[#C5A059] mx-auto"></div>
            <p className="text-sm tracking-[0.1em] text-[#f7f4ee]/70 leading-relaxed">
              Your account <strong>{user.email}</strong> is not registered as an administrator.
              Please contact the atelier manager.
            </p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-4 px-8 py-3 bg-[#C5A059] text-[#0d0d0d] hover:bg-[#b08b47] transition-all duration-300 text-xs font-semibold tracking-[0.2em] uppercase"
            >
              Sign Out / Switch Account
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <AdminContext.Provider
      value={{
        isAdmin: isAdminRoute,
        isEditMode,
        setEditMode,
        activeSection,
        setActiveSection,
        activeItemIndex,
        setActiveItemIndex,
        activeItemType,
        setActiveItemType,
        cmsData,
        updateCmsData,
        reorderCmsItem,
        deleteCmsItem,
        addCmsItem,
        moveSection,
        toggleSectionVisibility,
        deleteSection,
        addSection,
        saveDraft,
        publishChanges,
        discardChanges,
        hasUnsavedChanges,
        isLoading,
        user,
        isAdminUser,
        isLoadingAuth
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}

export function useCmsData() {
  const context = useContext(AdminContext);
  if (!context) {
    return {
      isAdmin: false,
      isEditMode: false,
      cmsData: initialCmsData,
    };
  }
  return {
    isAdmin: context.isAdmin,
    isEditMode: context.isEditMode,
    cmsData: context.cmsData,
  };
}
