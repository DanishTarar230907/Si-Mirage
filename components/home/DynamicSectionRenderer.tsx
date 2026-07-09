'use client';

import React from 'react';
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
import PromotionalInterstitial from '@/components/best-sellers/PromotionalInterstitial';
import AboutContent from '@/components/about/AboutContent';
import TeamContent from '@/components/team/TeamContent';

interface DynamicSectionRendererProps {
  type: string;
}

export default function DynamicSectionRenderer({ type }: DynamicSectionRendererProps) {
  switch (type) {
    case 'about':
      return <AboutContent />;
    case 'team':
      return <TeamContent />;
    case 'hero':
      return <HeroSlider />;
    case 'services':
      return <PremiumServices />;
    case 'creativeShowcase':
      return <CreativeShowcase />;
    case 'categories':
      return <CategoryCircleGrid />;
    case 'luxuryBanner':
      return <LuxuryCollectionBanner />;
    case 'trendingProducts':
      return <TrendingCarousel />;
    case 'everydayBanner':
      return <EverydayCollectionBanner />;
    case 'mediaShowcase':
      return <MediaShowcase />;
    case 'brandStory':
      return <BrandStoryEditorial />;
    case 'videoHero':
    case 'customVideo':
      return <BrandVideoHero />;
    case 'testimonials':
      return <ReviewCarousel />;
    case 'gallery':
      return <MasonryGallery />;
    case 'newsletter':
      return <NewsletterMinimal />;
    case 'advertisement':
      return <PromotionalInterstitial />;
    default:
      return null;
  }
}
