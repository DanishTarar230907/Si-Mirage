import { supabase } from '@/lib/supabase';
import NewArrivalsClient from '@/components/best-sellers/NewArrivalsClient';

export const revalidate = 60;

export const metadata = {
  title: 'New Arrivals | Si Mirage',
  description: 'Discover the latest premium eyewear collections from Si Mirage.',
};

export default async function NewArrivalsPage() {
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // Map to the format PremiumProductCard expects
  const products = (dbProducts || []).map((p) => ({
    id: p.id,
    name: p.name,
    price: `Rs. ${p.discount_price || p.price}`,
    primaryImage: p.image_url || "/images/20250201_233239.jpg",
    hoverImage: p.hover_image_url || "/images/20250201_233239.jpg",
    badge: p.badge || (p.is_new ? 'New' : null),
    category: p.category,
  }));

  return <NewArrivalsClient products={products} />;
}
