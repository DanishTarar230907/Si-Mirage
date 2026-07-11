export interface ProductImage {
  id: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  color?: string;
  size?: string;
  material?: string;
  lens_type?: string;
  price_adjustment: number;
  stock_quantity: number;
  image_url?: string;
}

export interface ProductReview {
  id: string;
  customer_name: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  category: string;
  brand?: string;
  frame_type?: string;
  tags?: string[];
  status?: 'active' | 'draft' | 'hidden';
  price: number;
  discount_price?: number;
  discountPrice?: number;
  discount_percentage?: number;
  image_url?: string;
  hover_image_url?: string;
  image?: string;
  hoverImage?: string;
  primaryImage?: string;
  badge?: string;
  is_new?: boolean;
  isNew?: boolean;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  stock_quantity?: number;
  stock?: number;
  description?: string;
  short_description?: string;
  long_description?: string;
  specifications?: Record<string, string> | any;
  features?: string[] | any;
  seo_title?: string;
  seo_description?: string;
  rating_avg?: number;
  review_count?: number;
  collection_id?: string;
  created_at?: string;
  updated_at?: string;
  // Relational (from joined queries)
  product_variants?: ProductVariant[];
  product_images?: ProductImage[];
  product_reviews?: ProductReview[];
}


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

export interface SectionLayout {
  id: string;
  name: string;
  type: string;
  visible: boolean;
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
  trendingProducts: Product[];
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
  shopProducts: Product[];
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
