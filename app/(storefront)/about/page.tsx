import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      
      {/* Hero */}
      <div className="relative h-[50vh] bg-surface mb-20 overflow-hidden flex items-center justify-center">
        <Image
          src="https://placehold.co/1920x1080/050505/C0A062?text=Brand+Story+Hero+[Drive]"
          alt="Our Story"
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-bold tracking-widest text-white uppercase text-center">
          Our <span className="text-primary italic font-light">Story</span>
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-light mb-6 uppercase tracking-widest">The <span className="font-bold">Vision</span></h2>
            <p className="text-foreground/80 font-light leading-relaxed mb-4">
              Si Mirage was born out of a desire to break the monotony of conventional eyewear. We don't just design sunglasses; we craft cinematic experiences that you wear.
            </p>
            <p className="text-foreground/80 font-light leading-relaxed">
              Every frame is meticulously engineered with premium materials, ensuring that when you step into the light, you command the spotlight.
            </p>
          </div>
          <div className="relative aspect-square bg-surface">
            <Image
              src="https://placehold.co/800x800/111111/C0A062?text=Vision+Image+[Drive]"
              alt="Vision"
              fill
              className="object-cover opacity-80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-col-reverse md:flex-row-reverse">
          <div className="relative aspect-square bg-surface md:order-last">
            <Image
              src="https://placehold.co/800x800/111111/C0A062?text=Craftsmanship+Image+[Drive]"
              alt="Craftsmanship"
              fill
              className="object-cover opacity-80"
            />
          </div>
          <div className="md:order-first text-right">
            <h2 className="text-3xl font-light mb-6 uppercase tracking-widest">The <span className="font-bold">Craft</span></h2>
            <p className="text-foreground/80 font-light leading-relaxed mb-4">
              Quality is our signature. From aerospace-grade titanium hinges to polarized, scratch-resistant lenses, we obsess over every detail.
            </p>
            <p className="text-foreground/80 font-light leading-relaxed">
              Our frames undergo a rigorous 40-step manufacturing process before they ever reach your hands, guaranteeing unparalleled durability and style.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
