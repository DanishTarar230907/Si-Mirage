/**
 * CMS Mock Data for Showcases & Products
 * V6 Standard: Absolute Deduplication (0 repeats)
 */

export interface CreativeShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  category: string;
  displayOrder: number;
  featured: boolean;
  publishStatus: 'Draft' | 'Published' | 'Archived';
  tags: string[];
  createdAt: string;
  size: 'small' | 'medium' | 'large' | 'tall' | 'wide';
}

export interface MediaShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  videoUrl?: string;
  type: string;
  displayOrder: number;
  featured: boolean;
  publishStatus: 'Draft' | 'Published' | 'Archived';
  tags: string[];
  createdAt: string;
  layout: '9:16' | '16:9' | '1:1';
}

export interface MockProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  image: string;
  hoverImage: string;
  isNew?: boolean;
}

export const mockProducts: MockProduct[] = [
  {
    id: "p_1",
    name: "The Onyx Wayfarer",
    category: "LUXURY",
    price: 55000,
    image: "/images/20250201_234929.jpg",
    hoverImage: "/images/20250201_235609.jpg",
    isNew: true,
  },
  {
    id: "p_2",
    name: "Amber Aviator",
    category: "CLASSIC",
    price: 42000,
    discountPrice: 35000,
    image: "/images/20250201_235348.jpg",
    hoverImage: "/images/20250201_235735.jpg",
  },
  {
    id: "p_3",
    name: "Midnight Square",
    category: "SQUARE",
    price: 38000,
    image: "/images/20250201_235432.jpg",
    hoverImage: "/images/20250201_235812.jpg",
  },
  {
    id: "p_4",
    name: "Crimson Round",
    category: "VINTAGE",
    price: 29000,
    image: "/images/20250201_235445.jpg",
    hoverImage: "/images/20250201_235927.jpg",
    isNew: true,
  }
];

export const mockCreativeShowcase: CreativeShowcaseItem[] = [
  {
    id: "c_1",
    title: "Summer Solstice Campaign",
    subtitle: "SS26 Collection Launch",
    description: "Our flagship campaign celebrating the endless summer.",
    coverImage: "/images/20250201_235941.jpg",
    category: "Brand Poster",
    displayOrder: 1,
    featured: true,
    publishStatus: "Published",
    tags: ["Summer"],
    createdAt: "2026-06-01T00:00:00Z",
    size: "large" // col-span-2 row-span-2
  },
  {
    id: "c_2",
    title: "The Aviator Refined",
    subtitle: "Product Spotlight",
    description: "Close-up macro photography.",
    coverImage: "/images/20250201_235944.jpg",
    category: "Product Campaign",
    displayOrder: 2,
    featured: false,
    publishStatus: "Published",
    tags: ["Aviator"],
    createdAt: "2026-06-02T00:00:00Z",
    size: "tall" // col-span-1 row-span-2 (Rows 1 & 2 filled perfectly)
  },
  {
    id: "c_3",
    title: "Midnight Monochrome",
    subtitle: "Editorial Story",
    description: "A dark, moody editorial.",
    coverImage: "/images/20250202_000025.jpg",
    category: "Editorial Photography",
    displayOrder: 3,
    featured: true,
    publishStatus: "Published",
    tags: ["Editorial"],
    createdAt: "2026-06-03T00:00:00Z",
    size: "wide" // col-span-2 row-span-1
  },
  {
    id: "c_4",
    title: "Times Square Takeover",
    subtitle: "NYC Billboard",
    description: "Mockup of the OOH campaign launched in New York.",
    coverImage: "/images/20250202_000118.jpg",
    category: "Billboard Design",
    displayOrder: 4,
    featured: false,
    publishStatus: "Published",
    tags: ["OOH"],
    createdAt: "2026-06-04T00:00:00Z",
    size: "medium" // col-span-1 row-span-1 (Row 3 filled perfectly)
  },
  {
    id: "c_5",
    title: "Sustainable Packaging",
    subtitle: "Eco-Friendly Unboxing",
    description: "Showcasing our new recycled cases.",
    coverImage: "/images/20250202_000208.jpg",
    category: "Packaging Design",
    displayOrder: 5,
    featured: false,
    publishStatus: "Published",
    tags: ["Packaging"],
    createdAt: "2026-06-05T00:00:00Z",
    size: "wide" // col-span-2 row-span-1
  },
  {
    id: "c_6",
    title: "Urban Explorer",
    subtitle: "Social Creative",
    description: "Street-style photography for our IG grid.",
    coverImage: "/images/20250202_000553.jpg",
    category: "Social Media Creative",
    displayOrder: 6,
    featured: false,
    publishStatus: "Published",
    tags: ["Social"],
    createdAt: "2026-06-06T00:00:00Z",
    size: "small" // col-span-1 row-span-1 (Row 4 filled perfectly)
  }
];

export const mockMediaShowcase: MediaShowcaseItem[] = [
  {
    id: "m_1",
    title: "DEFY CONVENTION",
    subtitle: "The Director's Cut",
    coverImage: "/images/20250202_000611.jpg",
    type: "Brand Film",
    displayOrder: 1,
    featured: true,
    publishStatus: "Published",
    tags: ["Cinematic"],
    createdAt: "2026-06-10T00:00:00Z",
    layout: "16:9" // col-span-2 row-span-1
  },
  {
    id: "m_2",
    title: "Crafting The Wayfarer",
    subtitle: "Behind The Scenes",
    coverImage: "/images/20250202_000707.jpg",
    type: "Reel",
    displayOrder: 2,
    featured: false,
    publishStatus: "Published",
    tags: ["BTS"],
    createdAt: "2026-06-11T00:00:00Z",
    layout: "9:16" // col-span-1 row-span-2 (Rows 1 & 2 mapped to right side)
  },
  {
    id: "m_3",
    title: "Sunset Boulevard",
    subtitle: "Influencer Campaign",
    coverImage: "/images/20250202_000810.jpg",
    type: "Reel",
    displayOrder: 3,
    featured: false,
    publishStatus: "Published",
    tags: ["Influencer"],
    createdAt: "2026-06-12T00:00:00Z",
    layout: "1:1" // col-span-1 row-span-1 (Row 2, Col 1)
  },
  {
    id: "m_4",
    title: "The Mirror Lens",
    subtitle: "Product Detail",
    coverImage: "/images/20250202_000818.jpg",
    type: "Square",
    displayOrder: 4,
    featured: false,
    publishStatus: "Published",
    tags: ["Product"],
    createdAt: "2026-06-13T00:00:00Z",
    layout: "1:1" // col-span-1 row-span-1 (Row 2, Col 2 - Fills the entire grid!)
  }
];
