const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error('Failed to read .env.local file from ' + envPath);
  process.exit(1);
}

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

const defaultProducts = [
  {
    name: 'Aurora Aviator',
    price: 35000,
    primary_image: '/images/20250201_233511.jpg',
    hover_image: '/images/20250201_234207.jpg',
    badge: 'Best Seller',
    category: 'Aviator',
    is_featured: true,
    is_new: false,
    description: 'Gold-rimmed premium aviator with polarized, impact-resistant lenses and lightweight frame structure.'
  },
  {
    name: 'Noir Wayfarer',
    price: 32000,
    primary_image: '/images/20250201_234207.jpg',
    hover_image: '/images/20250201_233511.jpg',
    badge: 'Best Seller',
    category: 'Wayfarer',
    is_featured: true,
    is_new: false,
    description: 'Polished black acetate frame with dark lenses, offering timeless aesthetic and comfortable everyday wear.'
  },
  {
    name: 'Midnight Round',
    price: 38000,
    primary_image: '/images/20250201_233523.jpg',
    hover_image: '/images/20250201_234223.jpg',
    badge: 'New',
    category: 'Round',
    is_featured: false,
    is_new: true,
    description: 'Shadow-toned round frame designed with architectural restraint and premium hinges.'
  },
  {
    name: 'Solstice Frame',
    price: 29000,
    primary_image: '/images/20250201_234223.jpg',
    hover_image: '/images/20250201_234249.jpg',
    badge: 'New',
    category: 'Square',
    is_featured: false,
    is_new: true,
    description: 'Geometric square sunglasses with gradient lenses, perfect for high-contrast summer outings.'
  },
  {
    name: 'Riviera Sport',
    price: 42000,
    primary_image: '/images/20250201_234249.jpg',
    hover_image: '/images/20250201_234547.jpg',
    badge: 'Best Seller',
    category: 'Sports',
    is_featured: true,
    is_new: false,
    description: 'Ergonomic sports shades with wrapped lenses, built for maximum peripheral coverage and wind protection.'
  },
  {
    name: 'Halo Blue-Light',
    price: 28000,
    primary_image: '/images/20250201_234547.jpg',
    hover_image: '/images/20250201_233639.jpg',
    badge: 'New',
    category: 'Blue-Light',
    is_featured: false,
    is_new: true,
    description: 'Transparent protective computer glasses filtering harmful high-energy blue rays to protect eyesight.'
  },
  {
    name: 'Eclipse Cat-Eye',
    price: 45000,
    primary_image: '/images/20250201_233639.jpg',
    hover_image: '/images/20250202_003807.jpg',
    badge: 'Limited',
    category: 'Cat-Eye',
    is_featured: false,
    is_new: false,
    description: 'Avant-garde cat-eye shape styled in hand-polished tortoise-shell acetate and metal temples.'
  },
  {
    name: 'Vintage Browline',
    price: 33000,
    primary_image: '/images/20250202_003807.jpg',
    hover_image: '/images/20250202_003823.jpg',
    badge: 'New',
    category: 'Browline',
    is_featured: false,
    is_new: true,
    description: 'Retro-classic semi-rimless frames, merging structural details with high-end luxury appeal.'
  },
  {
    name: 'Crystal Clear',
    price: 31000,
    primary_image: '/images/20250202_003823.jpg',
    hover_image: '/images/20250201_233723.jpg',
    badge: 'Best Seller',
    category: 'Clear',
    is_featured: true,
    is_new: false,
    description: 'Modern clear acetate frame with light-reflective polarization, crafted for understated luxury.'
  }
];

const defaultHeroSlides = [
  {
    title: 'THE ARCHITECTURAL FRAME',
    subtitle: 'Precise geometry meets cinematic expression.',
    image_url: '/images/20250201_233239.jpg',
    cta1_text: 'Shop Collection',
    cta1_link: '/shop',
    cta2_text: 'Explore Atelier',
    cta2_link: '/collections',
    display_order: 1,
    is_active: true
  },
  {
    title: 'SS26 CAMPAIGN',
    subtitle: 'Command the spotlight. Step into the light.',
    image_url: '/images/20250201_233639.jpg',
    cta1_text: 'New Arrivals',
    cta1_link: '/new-arrivals',
    cta2_text: 'Best Sellers',
    cta2_link: '/best-sellers',
    display_order: 2,
    is_active: true
  }
];

const defaultAnnouncements = [
  {
    message: 'FREE SHIPPING ABOVE PKR 10,000',
    is_active: true,
    display_order: 1
  }
];

const defaultCategories = [
  { name: 'Aviator', slug: 'aviator', image_url: '/images/20250201_233511.jpg', display_order: 1, is_featured: true, is_active: true },
  { name: 'Round', slug: 'round', image_url: '/images/20250201_233523.jpg', display_order: 2, is_featured: true, is_active: true },
  { name: 'Wayfarer', slug: 'wayfarer', image_url: '/images/20250201_234207.jpg', display_order: 3, is_featured: true, is_active: true },
  { name: 'Square', slug: 'square', image_url: '/images/20250201_234223.jpg', display_order: 4, is_featured: false, is_active: true },
  { name: 'Sports', slug: 'sports', image_url: '/images/20250201_234249.jpg', display_order: 5, is_featured: false, is_active: true },
  { name: 'Clear', slug: 'clear', image_url: '/images/20250202_003823.jpg', display_order: 6, is_featured: false, is_active: true }
];

const defaultCollections = [
  {
    name: 'THE LUXURY EDIT',
    slug: 'luxury',
    description: 'Sculptural forms and hand-polished custom acetates designed to command attention.',
    image_url: '/images/20250201_233639.jpg',
    display_order: 1,
    is_featured: true,
    is_active: true
  },
  {
    name: 'EVERYDAY ESSENTIALS',
    slug: 'everyday',
    description: 'Minimalist architecture engineered for weightless all-day wear.',
    image_url: '/images/20250202_003807.jpg',
    display_order: 2,
    is_featured: true,
    is_active: true
  }
];

const defaultTestimonials = [
  {
    name: 'Ava Khan',
    location: 'Islamabad',
    review: 'The weight distribution is perfect. They feel incredibly premium and the lens definition is top-tier.',
    rating: 5,
    avatar_url: '/images/20250201_233511.jpg',
    is_featured: true,
    is_active: true
  },
  {
    name: 'Noor Ali',
    location: 'Karachi',
    review: 'Clean design and absolute premium materials. The service was as polished as the product itself.',
    rating: 5,
    avatar_url: '/images/20250201_233523.jpg',
    is_featured: true,
    is_active: true
  },
  {
    name: 'Mina Shah',
    location: 'Lahore',
    review: 'The lens quality is pristine. Beautiful glare filtering with zero distortion. My daily essential.',
    rating: 5,
    avatar_url: '/images/20250201_234547.jpg',
    is_featured: true,
    is_active: true
  }
];

const defaultGalleryItems = [
  { image_url: '/images/20250201_234207.jpg', display_order: 1, is_active: true },
  { image_url: '/images/20250201_233511.jpg', display_order: 2, is_active: true },
  { image_url: '/images/20250201_233523.jpg', display_order: 3, is_active: true },
  { image_url: '/images/20250201_234223.jpg', display_order: 4, is_active: true },
  { image_url: '/images/20250201_234249.jpg', display_order: 5, is_active: true },
  { image_url: '/images/20250201_234547.jpg', display_order: 6, is_active: true },
  { image_url: '/images/20250201_233639.jpg', display_order: 7, is_active: true },
  { image_url: '/images/20250202_003807.jpg', display_order: 8, is_active: true }
];

const defaultTeamMembers = [
  { name: 'Zayn', role: 'digital_marketer', bio: 'Head of marketing and visual digital outreach.', photo_url: '/images/20250201_233511.jpg', is_active: true },
  { name: 'Sarah', role: 'graphic_designer', bio: 'Visual artist behind our typography and branding.', photo_url: '/images/20250201_233523.jpg', is_active: true },
  { name: 'Omar', role: 'content_creator', bio: 'Atelier videographer and narrative manager.', photo_url: '/images/20250201_234207.jpg', is_active: true },
  { name: 'Ayesha', role: 'model', bio: 'Face of Si Mirage campaign launches.', photo_url: '/images/20250201_234223.jpg', is_active: true }
];

const defaultCreativeShowcase = [
  {
    title: 'Summer Solstice Campaign',
    subtitle: 'SS26 Collection Launch',
    description: 'Our flagship campaign celebrating the endless summer.',
    cover_image: '/images/20250201_235941.jpg',
    category: 'Brand Poster',
    size: 'large',
    display_order: 1,
    is_featured: true,
    status: 'published'
  },
  {
    title: 'The Aviator Refined',
    subtitle: 'Product Spotlight',
    description: 'Close-up macro photography.',
    cover_image: '/images/20250201_235944.jpg',
    category: 'Product Campaign',
    size: 'tall',
    display_order: 2,
    is_featured: false,
    status: 'published'
  },
  {
    title: 'Midnight Monochrome',
    subtitle: 'Editorial Story',
    description: 'A dark, moody editorial.',
    cover_image: '/images/20250202_000025.jpg',
    category: 'Editorial Photography',
    size: 'wide',
    display_order: 3,
    is_featured: true,
    status: 'published'
  },
  {
    title: 'Times Square Takeover',
    subtitle: 'NYC Billboard',
    description: 'Mockup of the OOH campaign launched in New York.',
    cover_image: '/images/20250202_000118.jpg',
    category: 'Billboard Design',
    size: 'medium',
    display_order: 4,
    is_featured: false,
    status: 'published'
  },
  {
    title: 'Sustainable Packaging',
    subtitle: 'Eco-Friendly Unboxing',
    description: 'Showcasing our new recycled cases.',
    cover_image: '/images/20250202_000208.jpg',
    category: 'Packaging Design',
    size: 'wide',
    display_order: 5,
    is_featured: false,
    status: 'published'
  },
  {
    title: 'Urban Explorer',
    subtitle: 'Social Creative',
    description: 'Street-style photography for our IG grid.',
    cover_image: '/images/20250202_000553.jpg',
    category: 'Social Media Creative',
    size: 'small',
    display_order: 6,
    is_featured: false,
    status: 'published'
  }
];

const defaultMediaShowcase = [
  {
    title: 'DEFY CONVENTION',
    subtitle: "The Director's Cut",
    cover_image: '/images/20250202_000611.jpg',
    video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'reel',
    layout: '16:9',
    display_order: 1,
    is_featured: true,
    status: 'published'
  },
  {
    title: 'Crafting The Wayfarer',
    subtitle: 'Behind The Scenes',
    cover_image: '/images/20250202_000707.jpg',
    video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'reel',
    layout: '9:16',
    display_order: 2,
    is_featured: false,
    status: 'published'
  },
  {
    title: 'Sunset Boulevard',
    subtitle: 'Influencer Campaign',
    cover_image: '/images/20250202_000810.jpg',
    video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'reel',
    layout: '1:1',
    display_order: 3,
    is_featured: false,
    status: 'published'
  },
  {
    title: 'The Mirror Lens',
    subtitle: 'Product Detail',
    cover_image: '/images/20250202_000818.jpg',
    video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'reel',
    layout: '1:1',
    display_order: 4,
    is_featured: false,
    status: 'published'
  }
];

async function seedTable(tableName, dataArray, checkColumn = 'id') {
  try {
    // Check if table is empty
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error(`Error checking table "${tableName}":`, countError.message);
      return;
    }

    if (count > 0) {
      console.log(`Table "${tableName}" is not empty (${count} items found). Skipping seeding to prevent overwriting.`);
      return;
    }

    console.log(`Seeding table "${tableName}" with ${dataArray.length} items...`);
    const { error: insertError } = await supabase.from(tableName).insert(dataArray);

    if (insertError) {
      console.error(`❌ Error inserting into "${tableName}":`, insertError.message);
    } else {
      console.log(`✅ Successfully seeded table "${tableName}"!`);
    }
  } catch (e) {
    console.error(`Exception seeding table "${tableName}":`, e.message);
  }
}

async function runSeed() {
  console.log('--- Starting Idempotent Database Seeding ---');
  
  // 1. Site Settings
  await seedTable('site_settings', [{
    brand_name: 'Si Mirage',
    logo_url: '/logo.png',
    seo_title: 'Si Mirage – Premium Luxury Eyewear',
    seo_description: 'Cinematic sunglasses crafted with precision and style.',
    social_instagram: '@simirage.official',
    newsletter_heading: 'THE INSIDER',
    newsletter_description: 'Subscribe to receive early access to new collections.'
  }]);

  // 2. Announcements
  await seedTable('announcements', defaultAnnouncements);

  // 3. Hero Slides
  await seedTable('hero_slides', defaultHeroSlides);

  // 4. Categories
  await seedTable('categories', defaultCategories);

  // 5. Collections
  await seedTable('collections', defaultCollections);

  // 6. Testimonials
  await seedTable('testimonials', defaultTestimonials);

  // 7. Gallery Items
  await seedTable('gallery_items', defaultGalleryItems);

  // 8. Team Members
  await seedTable('team_members', defaultTeamMembers);

  // 9. Creative Showcases
  await seedTable('creative_showcases', defaultCreativeShowcase);

  // 10. Media Showcases
  await seedTable('media_showcases', defaultMediaShowcase);

  // 11. Products
  const productsToSeed = defaultProducts.map((p, idx) => ({
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    stock_quantity: 15,
    images: [p.primary_image, p.hover_image],
    image_url: p.primary_image,
    hover_image_url: p.hover_image,
    is_featured: p.is_featured,
    is_new: p.is_new,
    badge: p.badge,
    display_order: idx,
    status: 'published'
  }));
  await seedTable('products', productsToSeed);

  console.log('--- Database Seeding Complete ---');
}

runSeed();
