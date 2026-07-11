import { supabase } from '@/lib/supabase';
import { CmsDataState } from '@/types/cms';
import { brandAssets } from '@/config/brandAssets';

export async function fetchCmsData(fallbackData: CmsDataState): Promise<CmsDataState> {
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

  const updated = { ...fallbackData };

  if (dbProducts) {
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
        category: (p.category || 'luxury').toUpperCase(),
        price: Number(p.price),
        discountPrice: p.discount_price ? Number(p.discount_price) : undefined,
        image: p.image_url || p.images?.[0] || "/images/20250201_233239.jpg",
        hoverImage: p.hover_image_url || p.images?.[1] || p.images?.[0] || "/images/20250201_233239.jpg",
        isNew: p.is_new || false
      }));
    } else {
      updated.trendingProducts = [];
    }
  }

  if (dbHeroSlides) {
    updated.hero = dbHeroSlides.map((h: any) => ({
      id: h.id,
      image: h.image_url,
      title: h.title,
      subtitle: h.subtitle,
      cta1: h.cta1_text,
      cta2: h.cta2_text
    }));
  }

  if (dbAnnouncements) {
    const active = dbAnnouncements.find((a: any) => a.is_active);
    if (active) {
      updated.announcement = {
        text: active.message,
        background: "#121212",
        textColor: "#f7f4ee",
        visible: true
      };
    } else {
      updated.announcement = { ...updated.announcement, visible: false };
    }
  }

  if (dbCategories) {
    updated.categories = dbCategories.map((c: any) => ({
      name: c.name,
      image: c.image_url || "/images/20250201_233730.jpg",
      count: 18
    }));
  }

  if (dbCollections) {
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

  if (dbTestimonials) {
    updated.testimonials = dbTestimonials.map((t: any) => ({
      id: t.id,
      name: t.name,
      location: t.location || "",
      review: t.review,
      rating: t.rating || 5,
      avatar: t.avatar_url || brandAssets.reviews[0].avatar
    }));
  }

  if (dbGallery) {
    updated.gallery = dbGallery.map((g: any) => g.image_url);
  }

  if (dbTeam) {
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
    if (s.brand_story) {
      updated.brandStory = typeof s.brand_story === 'string'
        ? JSON.parse(s.brand_story)
        : s.brand_story;
    }
  }

  if (dbOrders) {
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

  if (dbCustomers) {
    updated.customers = dbCustomers.map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      tier: c.phone ? 'VIP' : 'New',
      orders: 1,
      status: 'Active'
    }));
  }

  if (dbDiscounts) {
    updated.discounts = dbDiscounts.map((d: any) => ({
      id: d.id,
      code: d.code,
      type: d.type === 'percentage' ? 'Percentage' : 'Flat',
      value: Number(d.value),
      active: d.is_active
    }));
  }

  if (dbCreative) {
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

  if (dbMedia) {
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
}
