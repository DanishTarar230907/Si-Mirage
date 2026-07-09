export type AdminProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  featured: boolean;
};

export type AdminSection = {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  video: string;
  active: boolean;
};

export type AdminMediaAsset = {
  id: number;
  title: string;
  type: 'image' | 'video';
  src: string;
  caption: string;
};

export type AdminOrder = {
  id: number;
  customer: string;
  item: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Packed' | 'Shipped';
  date: string;
};

export type AdminDashboardState = {
  products: AdminProduct[];
  sections: AdminSection[];
  media: AdminMediaAsset[];
  orders: AdminOrder[];
};

export const defaultAdminState: AdminDashboardState = {
  products: [
    {
      id: 1,
      name: 'Aurora Aviator',
      category: 'Aviator',
      price: 5790,
      stock: 18,
      description: '24k gold detailing with sculpted comfort.',
      image: '/images/20250201_233511.jpg',
      featured: true,
    },
    {
      id: 2,
      name: 'Midnight Round',
      category: 'Round',
      price: 6190,
      stock: 7,
      description: 'Shadow-toned acetate with a cinematic finish.',
      image: '/images/20250201_233523.jpg',
      featured: true,
    },
    {
      id: 3,
      name: 'Noir Wayfarer',
      category: 'Wayfarer',
      price: 5190,
      stock: 12,
      description: 'Polished profile and refined everyday elegance.',
      image: '/images/20250201_234207.jpg',
      featured: false,
    },
  ],
  sections: [
    {
      id: 1,
      name: 'Hero Slider',
      title: 'The New Standard in Luxury Eyewear',
      subtitle: 'Cinematic storytelling across hero slides.',
      image: '/images/20250201_233239.jpg',
      video: '',
      active: true,
    },
    {
      id: 2,
      name: 'Luxury Banner',
      title: 'The Luxury Edit',
      subtitle: 'Rare materials and sculptural silhouettes.',
      image: '/images/20250201_233639.jpg',
      video: '',
      active: true,
    },
    {
      id: 3,
      name: 'Brand Video',
      title: 'Watch Our Story',
      subtitle: 'Editorial video loop for immersion.',
      image: '/images/20250202_003807.jpg',
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      active: true,
    },
  ],
  media: [
    {
      id: 1,
      title: 'Hero Campaign Image',
      type: 'image',
      src: '/images/20250201_233239.jpg',
      caption: 'Primary hero editorial asset',
    },
    {
      id: 2,
      title: 'Luxury Collection Video',
      type: 'video',
      src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      caption: 'Used in the studio video hero',
    },
  ],
  orders: [
    { id: 1001, customer: 'Ava Khan', item: 'Aurora Aviator', amount: 5790, status: 'Paid', date: '2026-07-06' },
    { id: 1002, customer: 'Noor Ali', item: 'Midnight Round', amount: 6190, status: 'Packed', date: '2026-07-07' },
    { id: 1003, customer: 'Mina Shah', item: 'Noir Wayfarer', amount: 5190, status: 'Pending', date: '2026-07-08' },
  ],
};

export const adminStorageKey = 'si-mirage-admin-state';
