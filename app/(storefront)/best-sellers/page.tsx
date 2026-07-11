import { supabase } from '@/lib/supabase';
import BestSellersClient from '@/components/best-sellers/BestSellersClient';

export const revalidate = 60;

export const metadata = {
  title: 'Best Sellers | Si Mirage',
  description: 'Shop the most popular luxury eyewear pieces from Si Mirage.',
};

export default async function BestSellersPage() {
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    // Ideally we would order by sales, but for now we fetch featured or order by display_order
    .order('display_order', { ascending: true });

  // Map to the format PremiumProductCard expects
  const products = (dbProducts || []).map((p) => ({
    id: p.id,
    name: p.name,
    price: `Rs. ${p.discount_price || p.price}`,
    primaryImage: p.image_url || "/images/20250201_233239.jpg",
    hoverImage: p.hover_image_url || "/images/20250201_233239.jpg",
    badge: p.badge || (p.is_featured ? 'Best Seller' : null),
    category: p.category,
  }));

  return <BestSellersClient products={products} />;
}
