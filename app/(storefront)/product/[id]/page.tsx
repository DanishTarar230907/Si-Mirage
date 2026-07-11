import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductDetailClient from '@/components/product/ProductDetailClient';

export const revalidate = 60; // ISR revalidate every 60s

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  
  const { data: product } = await supabase
    .from('products')
    .select('name, short_description, image_url')
    .eq('id', id)
    .single();

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | Si Mirage`,
    description: product.short_description || `Purchase the premium ${product.name} at Si Mirage.`,
    openGraph: {
      images: [product.image_url],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch product along with variants, images, and reviews
  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_variants(*), product_images(*), product_reviews(*)')
    .eq('id', id)
    .single();

  if (error || !product) {
    console.error('Error fetching product:', error);
    notFound();
  }

  // Also fetch related products (same category, different ID)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('id, name, price, discount_price, image_url, hover_image_url, category, is_new')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(4);

  return (
    <div className="w-full">
      <ProductDetailClient product={product} />
      
      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-20 border-t border-white/10 bg-surface">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-light uppercase tracking-widest text-center mb-12">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div key={p.id} className="group flex flex-col relative bg-white border border-black/5 pb-4">
                  <div className="relative w-full aspect-[4/5] bg-white overflow-hidden mb-4">
                    <a href={`/product/${p.id}`} className="absolute inset-0 z-0 block">
                      <img src={p.image_url || '/images/20250201_233239.jpg'} alt={p.name} className="object-cover w-full h-full transition-opacity duration-700 opacity-100 group-hover:opacity-0" />
                      {p.hover_image_url && <img src={p.hover_image_url} alt={p.name} className="absolute inset-0 object-cover w-full h-full transition-all duration-700 opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105" />}
                    </a>
                  </div>
                  <div className="px-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C5A059] mb-1">{p.category}</p>
                    <h3 className="text-sm font-medium text-black mb-2">{p.name}</h3>
                    <div className="flex gap-2">
                      <span className="text-black font-medium">Rs. {p.discount_price || p.price}</span>
                      {p.discount_price && <span className="text-black/40 line-through text-sm">Rs. {p.price}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
