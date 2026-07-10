'use client';

const announcements = [
  'FREE SHIPPING ABOVE PKR 10,000',
  'SUMMER SALE UP TO 40% OFF',
  'AUTHENTIC PREMIUM EYEWEAR',
  'COMPLIMENTARY GIFT WRAPPING',
  'CRAFTED IN LIMITED BATCHES',
];

export default function AnnouncementBar() {
  // Duplicate the list so the marquee can loop seamlessly (-50% translate).
  const track = [...announcements, ...announcements];

  return (
    <div className="relative z-50 flex h-8 items-center overflow-hidden bg-foreground text-background">
      <div className="marquee-mask flex w-full overflow-hidden">
        <div
          className="animate-marquee flex shrink-0 items-center whitespace-nowrap"
          style={{ ['--marquee-duration' as string]: '38s' }}
        >
          {track.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="px-6 text-[10px] font-bold uppercase tracking-[0.25em] sm:text-[11px]">
                {item}
              </span>
              <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
