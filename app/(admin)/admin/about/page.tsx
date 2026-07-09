'use client';

import React, { useState } from 'react';
import { useAdminContext } from '@/components/admin/AdminContext';
import AdminSectionWrapper from '@/components/admin/AdminSectionWrapper';
import DynamicSectionRenderer from '@/components/home/DynamicSectionRenderer';
import { Plus, Video, Play, Award, Image as ImageIcon, Star } from 'lucide-react';

const SECTION_TEMPLATES = [
  { type: 'about', name: 'About Editorial Story', icon: ImageIcon },
  { type: 'hero', name: 'Hero Slider Campaigns', icon: ImageIcon },
  { type: 'services', name: 'Premium Brand Services', icon: Award },
  { type: 'trendingProducts', name: 'Trending Carousel', icon: Star },
  { type: 'mediaShowcase', name: 'Media Campaigns Showcase', icon: Video },
  { type: 'customVideo', name: 'Cinematic Video Hero', icon: Play },
  { type: 'testimonials', name: 'Customer Reviews', icon: Star },
  { type: 'newsletter', name: 'Newsletter Minimal Form', icon: ImageIcon },
  { type: 'advertisement', name: 'Dynamic Promo Banner', icon: Award }
];

export default function AdminAboutPage() {
  const { cmsData, addSection } = useAdminContext();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const layout = cmsData.pageLayouts?.['/about'] || [];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Dynamic Sections */}
      {layout.map((section) => (
        <AdminSectionWrapper
          key={section.id}
          sectionId={section.type}
          sectionName={section.name}
        >
          <DynamicSectionRenderer type={section.type} />
        </AdminSectionWrapper>
      ))}

      {/* Add Section Controls */}
      <div className="mt-12 px-6 max-w-4xl mx-auto w-full text-center">
        {!showAddMenu ? (
          <button
            onClick={() => setShowAddMenu(true)}
            className="group inline-flex items-center gap-3 border border-dashed border-[#C5A059]/40 hover:border-[#C5A059] bg-black/40 hover:bg-[#C5A059]/5 px-10 py-6 transition-all duration-300 rounded-none w-full justify-center"
          >
            <Plus className="w-5 h-5 text-[#C5A059] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#FAFAFA] group-hover:text-[#C5A059]">
              Add Section Template
            </span>
          </button>
        ) : (
          <div className="border border-[#C5A059]/30 bg-[#121212] p-8 text-left space-y-6 animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-lg text-[#C5A059] tracking-wider uppercase">Section Templates Library</h3>
                <p className="text-[10px] text-white/50 tracking-wider uppercase mt-1">Select a template to insert into the About page layout</p>
              </div>
              <button
                onClick={() => setShowAddMenu(false)}
                className="text-[10px] uppercase tracking-wider text-white/60 hover:text-white hover:underline transition-colors"
              >
                Close Library
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {SECTION_TEMPLATES.map((tmpl) => {
                const IconComponent = tmpl.icon;
                return (
                  <button
                    key={tmpl.type}
                    onClick={() => {
                      addSection('/about', tmpl.type, tmpl.name);
                      setShowAddMenu(false);
                      alert(`Added "${tmpl.name}" to your About page! Save and publish to push live.`);
                    }}
                    className="flex items-center gap-3 border border-white/10 hover:border-[#C5A059] bg-black/20 hover:bg-black/80 p-4 transition-all duration-300 text-left group"
                  >
                    <div className="p-2 border border-white/10 group-hover:border-[#C5A059]/45 bg-white/5 transition-colors">
                      <IconComponent className="w-4 h-4 text-[#C5A059]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-medium tracking-wider text-white group-hover:text-[#C5A059] uppercase transition-colors">
                        {tmpl.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
