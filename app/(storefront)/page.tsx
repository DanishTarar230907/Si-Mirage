'use client';

import HeroSlider from '@/components/home/HeroSlider';
import PremiumServices from '@/components/home/PremiumServices';
import CategoryCircleGrid from '@/components/home/CategoryCircleGrid';
import TrendingCarousel from '@/components/home/TrendingCarousel';
import LuxuryCollectionBanner from '@/components/home/LuxuryCollectionBanner';
import EverydayCollectionBanner from '@/components/home/EverydayCollectionBanner';
import CreativeShowcase from '@/components/home/CreativeShowcase';
import MediaShowcase from '@/components/home/MediaShowcase';
import BrandVideoHero from '@/components/home/BrandVideoHero';
import BrandStoryEditorial from '@/components/home/BrandStoryEditorial';
import ReviewCarousel from '@/components/home/ReviewCarousel';
import MasonryGallery from '@/components/home/MasonryGallery';
import NewsletterMinimal from '@/components/home/NewsletterMinimal';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Image Heavy: Hero */}
      <HeroSlider />

      {/* Light: Services */}
      <PremiumServices />

      {/* Editorial: Creative Showcase */}
      <CreativeShowcase />

      {/* Product: Categories */}
      <CategoryCircleGrid />

      {/* Image Heavy: Luxury Collection */}
      <LuxuryCollectionBanner />

      {/* Product: Trending */}
      <TrendingCarousel />

      {/* Light: Everyday Collection */}
      <EverydayCollectionBanner />

      {/* Image/Video Heavy: Media Showcase */}
      <MediaShowcase />

      {/* Editorial: Brand Story */}
      <BrandStoryEditorial />

      {/* Video: Brand Video Loop */}
      <BrandVideoHero />

      {/* Testimonials */}
      <ReviewCarousel />

      {/* Gallery */}
      <MasonryGallery />

      {/* Light: Newsletter */}
      <NewsletterMinimal />
    </div>
  );
}

