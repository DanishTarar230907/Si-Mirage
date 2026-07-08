import Image from 'next/image';
import Link from 'next/link';

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-light mb-12 uppercase tracking-widest text-center">Our <span className="font-bold">Collections</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Collection 1 */}
        <Link href="/shop?category=aviator" className="group relative h-[60vh] bg-surface overflow-hidden flex items-center justify-center">
          <Image
            src="https://placehold.co/1000x1200/111111/C0A062?text=Aviator+Collection+[Drive]"
            alt="Aviator Collection"
            fill
            className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <h2 className="relative z-10 text-4xl font-bold tracking-widest uppercase border border-white/20 px-10 py-6 backdrop-blur-sm group-hover:border-primary group-hover:text-primary transition-colors text-white">
            Aviator
          </h2>
        </Link>
        
        {/* Collection 2 */}
        <Link href="/shop?category=wayfarer" className="group relative h-[60vh] bg-surface overflow-hidden flex items-center justify-center">
          <Image
            src="https://placehold.co/1000x1200/111111/C0A062?text=Wayfarer+Collection+[Drive]"
            alt="Wayfarer Collection"
            fill
            className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <h2 className="relative z-10 text-4xl font-bold tracking-widest uppercase border border-white/20 px-10 py-6 backdrop-blur-sm group-hover:border-primary group-hover:text-primary transition-colors text-white">
            Wayfarer
          </h2>
        </Link>

        {/* Collection 3 */}
        <Link href="/shop?category=round" className="group relative h-[60vh] bg-surface overflow-hidden flex items-center justify-center md:col-span-2">
          <Image
            src="https://placehold.co/1920x800/111111/C0A062?text=Round+Collection+[Drive]"
            alt="Round Collection"
            fill
            className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <h2 className="relative z-10 text-4xl font-bold tracking-widest uppercase border border-white/20 px-10 py-6 backdrop-blur-sm group-hover:border-primary group-hover:text-primary transition-colors text-white">
            Round
          </h2>
        </Link>
      </div>
    </div>
  );
}
