import { CmsDataState } from '@/types/cms';
import { brandAssets } from '@/config/brandAssets';
import { mockCreativeShowcase, mockMediaShowcase } from '@/config/cmsMockData';
import { shopProducts } from '@/data/shopData';
import { bestSellerProducts } from '@/data/bestSellersData';

export const initialCmsData: CmsDataState = {
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
      title: "WHERE VISION BECOMES MIRAGE.",
      subtitle: "Geometric Precision Meets Raw Acetate",
      cta1: "EXPLORE COLLECTION",
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
    title: "WEAR THE SILENCE",
    subtitle: "Comfort-engineered fits utilizing hyper-light titanium hinges and double-polished raw organic acetates.",
    image: brandAssets.collections.everyday,
    cta: "SHOP NOW",
    href: "/shop"
  },
  creativeShowcase: mockCreativeShowcase,
  mediaShowcase: mockMediaShowcase,
  brandStory: {
    title: "CRAFTSMANSHIP WITHOUT COMPROMISE",
    subtitle: "THE ARCHITECTURE OF EYEWEAR",
    description: "Si Mirage was born from the desire to treat eyewear as a structural object. Every frame is designed with a specific geometric weight, architectural stability, and cinematic personality.",
    mission: "To eliminate the noise of mass-produced fashion and return to the discipline of craft.",
    vision: "A world where objects are bought to be kept, cherished, and styled with intellectual confidence.",
    image: "/images/20250201_233639.jpg",
    stat1_number: "1987",
    stat1_label: "FOUNDED",
    stat2_number: "47",
    stat2_label: "AWARDS",
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
