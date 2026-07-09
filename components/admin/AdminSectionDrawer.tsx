'use client';

import { useAdminContext, CmsDataState } from './AdminContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Upload, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { brandAssets } from '@/config/brandAssets';


export default function AdminSectionDrawer() {
  const {
    activeSection,
    setActiveSection,
    cmsData,
    updateCmsData,
    reorderCmsItem,
    deleteCmsItem,
    addCmsItem
  } = useAdminContext();

  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [uploadingImageField, setUploadingImageField] = useState<string | null>(null);

  if (!activeSection) return null;

  const handleClose = () => {
    setActiveSection(null);
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'announcement': return 'Announcement Bar';
      case 'hero': return 'Hero Slider Campaigns';
      case 'services': return 'Premium Brand Services';
      case 'categories': return 'Silhouettes / Categories';
      case 'trendingProducts': return 'Trending Carousel';
      case 'creativeShowcase': return 'Creative Showcases Grid';
      case 'mediaShowcase': return 'Media Campaigns Showcase';
      case 'luxuryBanner': return 'Luxury Banner Campaign';
      case 'everydayBanner': return 'Everyday Essentials Banner';
      case 'brandStory': return 'Brand Editorial Story';
      case 'customVideo':
      case 'videoHero': return 'Cinematic Video Loop';
      case 'testimonials': return 'Customer Testimonials';
      case 'gallery': return 'Instagram Masonry Gallery';
      case 'newsletter': return 'Newsletter Sign-up';
      case 'about': return 'About Page Editorial';
      case 'team': return 'Creative Crew Members';
      default: return 'Section Content';
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number | null, fieldName: string | null) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImageIndex(index);
    setUploadingImageField(fieldName);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('cms-media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cms-media')
        .getPublicUrl(filePath);

      // Update CMS Data state
      if (index === null && fieldName) {
        // Simple object field update
        updateCmsData(activeSection as keyof CmsDataState, fieldName, publicUrl);
      } else if (index !== null && fieldName === 'array_image') {
        // Array item update where the item is a string (e.g. gallery)
        const arr = [...(cmsData[activeSection as keyof CmsDataState] as any)];
        arr[index] = publicUrl;
        updateCmsData(activeSection as keyof CmsDataState, arr);
      } else if (index !== null && fieldName) {
        // Array of objects field update
        const arr = [...(cmsData[activeSection as keyof CmsDataState] as any)];
        arr[index] = {
          ...arr[index],
          [fieldName]: publicUrl
        };
        updateCmsData(activeSection as keyof CmsDataState, arr);
      }

      alert('Image uploaded successfully and applied to preview!');
    } catch (err: any) {
      console.error(err);
      alert('Failed to upload image. Applying a local preview instead.');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        if (index === null && fieldName) {
          updateCmsData(activeSection as keyof CmsDataState, fieldName, base64Url);
        } else if (index !== null && fieldName === 'array_image') {
          const arr = [...(cmsData[activeSection as keyof CmsDataState] as any)];
          arr[index] = base64Url;
          updateCmsData(activeSection as keyof CmsDataState, arr);
        } else if (index !== null && fieldName) {
          const arr = [...(cmsData[activeSection as keyof CmsDataState] as any)];
          arr[index] = {
            ...arr[index],
            [fieldName]: base64Url
          };
          updateCmsData(activeSection as keyof CmsDataState, arr);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImageIndex(null);
      setUploadingImageField(null);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 right-0 z-[90] h-full w-[450px] max-w-[90vw] bg-[#121212] border-l border-[#C5A059]/20 text-[#FAFAFA] shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-y-auto font-sans"
      >
        {/* Drawer Header */}
        <div className="sticky top-0 bg-[#121212] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#C5A059]">Visual Editor</span>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white mt-1">{getSectionTitle()}</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Form fields container */}
        <div className="p-6 space-y-6">
          {activeSection === 'announcement' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Message</label>
                <textarea
                  value={cmsData.announcement.text}
                  onChange={(e) => updateCmsData('announcement', 'text', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white rounded-none outline-none min-h-[80px]"
                />
              </div>
            </div>
          )}

          {activeSection === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Services List</span>
                <button
                  onClick={() => addCmsItem('services', {
                    title: 'New Service',
                    desc: 'Service description goes here.',
                    icon: 'Award'
                  })}
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/30 px-2.5 py-1 hover:bg-[#C5A059] hover:text-black transition-all"
                >
                  <Plus className="w-3 h-3" /> Add Service
                </button>
              </div>
              {cmsData.services?.map((service, idx) => (
                <div key={idx} className="p-4 bg-[#1A1A1A] border border-white/5 space-y-3 relative group animate-fade-in">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => idx > 0 && reorderCmsItem('services', idx, idx - 1)} disabled={idx === 0} className="p-1 hover:bg-white/10 text-white disabled:opacity-30">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => idx < cmsData.services.length - 1 && reorderCmsItem('services', idx, idx + 1)} disabled={idx === cmsData.services.length - 1} className="p-1 hover:bg-white/10 text-white disabled:opacity-30">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button onClick={() => cmsData.services.length > 1 && deleteCmsItem('services', idx)} disabled={cmsData.services.length === 1} className="p-1 hover:bg-red-500/10 text-red-400 disabled:opacity-30">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-white/50">Service #{idx + 1}</span>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Service Title</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => {
                        const arr = [...cmsData.services];
                        arr[idx].title = e.target.value;
                        updateCmsData('services', arr);
                      }}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Service Description</label>
                    <textarea
                      value={service.desc}
                      onChange={(e) => {
                        const arr = [...cmsData.services];
                        arr[idx].desc = e.target.value;
                        updateCmsData('services', arr);
                      }}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none min-h-[60px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'hero' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Slides ({cmsData.hero.length})</span>
                <button
                  onClick={() => addCmsItem('hero', {
                    id: Date.now(),
                    image: '/images/20250201_233239.jpg',
                    title: 'NEW CAMPAIGN',
                    subtitle: 'Limited Edition Silhouette Drops',
                    cta1: 'Shop Now',
                    cta2: 'Explore'
                  })}
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/30 px-2.5 py-1 hover:bg-[#C5A059] hover:text-black transition-all"
                >
                  <Plus className="w-3 h-3" /> Add Slide
                </button>
              </div>

              {cmsData.hero.map((slide, idx) => (
                <div key={slide.id} className="p-4 bg-[#1A1A1A] border border-white/5 space-y-4 relative group">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => idx > 0 && reorderCmsItem('hero', idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1 hover:bg-white/10 text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => idx < cmsData.hero.length - 1 && reorderCmsItem('hero', idx, idx + 1)}
                      disabled={idx === cmsData.hero.length - 1}
                      className="p-1 hover:bg-white/10 text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => cmsData.hero.length > 1 && deleteCmsItem('hero', idx)}
                      disabled={cmsData.hero.length === 1}
                      className="p-1 hover:bg-red-500/10 text-red-400 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[9px] uppercase tracking-widest font-bold text-white/50">Slide #{idx + 1}</span>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Headline</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const arr = [...cmsData.hero];
                          arr[idx].title = e.target.value;
                          updateCmsData('hero', arr);
                        }}
                        className="w-full bg-black border border-white/10 focus:border-[#C5A059] px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Subheading</label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => {
                          const arr = [...cmsData.hero];
                          arr[idx].subtitle = e.target.value;
                          updateCmsData('hero', arr);
                        }}
                        className="w-full bg-black border border-white/10 focus:border-[#C5A059] px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">CTA 1 Text</label>
                        <input
                          type="text"
                          value={slide.cta1}
                          onChange={(e) => {
                            const arr = [...cmsData.hero];
                            arr[idx].cta1 = e.target.value;
                            updateCmsData('hero', arr);
                          }}
                          className="w-full bg-black border border-white/10 focus:border-[#C5A059] px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">CTA 2 Text</label>
                        <input
                          type="text"
                          value={slide.cta2}
                          onChange={(e) => {
                            const arr = [...cmsData.hero];
                            arr[idx].cta2 = e.target.value;
                            updateCmsData('hero', arr);
                          }}
                          className="w-full bg-black border border-white/10 focus:border-[#C5A059] px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Image Link</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={slide.image}
                          onChange={(e) => {
                            const arr = [...cmsData.hero];
                            arr[idx].image = e.target.value;
                            updateCmsData('hero', arr);
                          }}
                          className="flex-grow bg-black border border-white/10 focus:border-[#C5A059] px-3 py-2 text-xs text-white outline-none"
                        />
                        <label className="flex items-center justify-center p-2 bg-white/5 border border-white/10 hover:border-[#C5A059] cursor-pointer transition-colors">
                          <Upload className="w-4 h-4 text-white/60" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, idx, 'image')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(activeSection === 'luxuryBanner' || activeSection === 'everydayBanner') && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Campaign Title</label>
                <input
                  type="text"
                  value={cmsData[activeSection].title}
                  onChange={(e) => updateCmsData(activeSection, 'title', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white rounded-none outline-none"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Campaign Subtitle / Body</label>
                <textarea
                  value={cmsData[activeSection].subtitle}
                  onChange={(e) => updateCmsData(activeSection, 'subtitle', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white rounded-none outline-none min-h-[90px]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">CTA Button Text</label>
                <input
                  type="text"
                  value={cmsData[activeSection].cta}
                  onChange={(e) => updateCmsData(activeSection, 'cta', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white rounded-none outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Campaign Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cmsData[activeSection].image}
                    onChange={(e) => updateCmsData(activeSection, 'image', e.target.value)}
                    className="flex-grow bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white rounded-none outline-none"
                  />
                  <label className="flex items-center justify-center p-3 bg-white/5 border border-white/10 hover:border-[#C5A059] cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-white/60" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, null, 'image')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'creativeShowcase' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Creative Showcase Items ({cmsData.creativeShowcase?.length || 0})</span>
                <button
                  onClick={() => addCmsItem('creativeShowcase', {
                    id: Date.now(),
                    title: 'New Showcase',
                    category: 'Editorial',
                    description: 'Description here',
                    coverImage: '/images/20250201_233511.jpg',
                    size: 'small'
                  })}
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/30 px-2.5 py-1 hover:bg-[#C5A059] hover:text-black transition-all"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>
              {cmsData.creativeShowcase?.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#1A1A1A] border border-white/5 space-y-4 relative group animate-fade-in">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => idx > 0 && reorderCmsItem('creativeShowcase', idx, idx - 1)} disabled={idx === 0} className="p-1 hover:bg-white/10 text-white disabled:opacity-30">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => idx < cmsData.creativeShowcase.length - 1 && reorderCmsItem('creativeShowcase', idx, idx + 1)} disabled={idx === cmsData.creativeShowcase.length - 1} className="p-1 hover:bg-white/10 text-white disabled:opacity-30">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button onClick={() => cmsData.creativeShowcase.length > 1 && deleteCmsItem('creativeShowcase', idx)} disabled={cmsData.creativeShowcase.length === 1} className="p-1 hover:bg-red-500/10 text-red-400 disabled:opacity-30">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-white/50">Item #{idx + 1}</span>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const arr = [...cmsData.creativeShowcase];
                        arr[idx].title = e.target.value;
                        updateCmsData('creativeShowcase', arr);
                      }}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Category</label>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => {
                        const arr = [...cmsData.creativeShowcase];
                        arr[idx].category = e.target.value;
                        updateCmsData('creativeShowcase', arr);
                      }}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const arr = [...cmsData.creativeShowcase];
                        arr[idx].description = e.target.value;
                        updateCmsData('creativeShowcase', arr);
                      }}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none min-h-[60px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Cover Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.coverImage}
                        onChange={(e) => {
                          const arr = [...cmsData.creativeShowcase];
                          arr[idx].coverImage = e.target.value;
                          updateCmsData('creativeShowcase', arr);
                        }}
                        className="flex-grow bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none"
                      />
                      <label className="flex items-center justify-center p-2 bg-white/5 border border-white/10 hover:border-[#C5A059] cursor-pointer">
                        <Upload className="w-4 h-4 text-white/60" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, idx, 'coverImage')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'mediaShowcase' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Media Campaign Items ({cmsData.mediaShowcase?.length || 0})</span>
                <button
                  onClick={() => addCmsItem('mediaShowcase', {
                    id: Date.now(),
                    title: 'New Campaign',
                    type: 'Cinematic',
                    subtitle: 'New Subtitle',
                    coverImage: '/images/20250201_233511.jpg',
                    videoUrl: '',
                    layout: 'standard'
                  })}
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/30 px-2.5 py-1 hover:bg-[#C5A059] hover:text-black transition-all"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>
              {cmsData.mediaShowcase?.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#1A1A1A] border border-white/5 space-y-4 relative group animate-fade-in">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => idx > 0 && reorderCmsItem('mediaShowcase', idx, idx - 1)} disabled={idx === 0} className="p-1 hover:bg-white/10 text-white disabled:opacity-30">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => idx < cmsData.mediaShowcase.length - 1 && reorderCmsItem('mediaShowcase', idx, idx + 1)} disabled={idx === cmsData.mediaShowcase.length - 1} className="p-1 hover:bg-white/10 text-white disabled:opacity-30">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button onClick={() => cmsData.mediaShowcase.length > 1 && deleteCmsItem('mediaShowcase', idx)} disabled={cmsData.mediaShowcase.length === 1} className="p-1 hover:bg-red-500/10 text-red-400 disabled:opacity-30">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-white/50">Item #{idx + 1}</span>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const arr = [...cmsData.mediaShowcase];
                        arr[idx].title = e.target.value;
                        updateCmsData('mediaShowcase', arr);
                      }}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Type/Category</label>
                    <input
                      type="text"
                      value={item.type}
                      onChange={(e) => {
                        const arr = [...cmsData.mediaShowcase];
                        arr[idx].type = e.target.value;
                        updateCmsData('mediaShowcase', arr);
                      }}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Subtitle</label>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => {
                        const arr = [...cmsData.mediaShowcase];
                        arr[idx].subtitle = e.target.value;
                        updateCmsData('mediaShowcase', arr);
                      }}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Cover Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.coverImage}
                        onChange={(e) => {
                          const arr = [...cmsData.mediaShowcase];
                          arr[idx].coverImage = e.target.value;
                          updateCmsData('mediaShowcase', arr);
                        }}
                        className="flex-grow bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none"
                      />
                      <label className="flex items-center justify-center p-2 bg-white/5 border border-white/10 hover:border-[#C5A059] cursor-pointer">
                        <Upload className="w-4 h-4 text-white/60" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, idx, 'coverImage')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'brandStory' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Section Headline</label>
                <input
                  type="text"
                  value={cmsData.brandStory.title || ''}
                  onChange={(e) => updateCmsData('brandStory', 'title', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Section Subheadline</label>
                <input
                  type="text"
                  value={cmsData.brandStory.subtitle || ''}
                  onChange={(e) => updateCmsData('brandStory', 'subtitle', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Main Paragraph</label>
                <textarea
                  value={cmsData.brandStory.description || ''}
                  onChange={(e) => updateCmsData('brandStory', 'description', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none min-h-[140px]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Brand Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cmsData.brandStory.image || ''}
                    onChange={(e) => updateCmsData('brandStory', 'image', e.target.value)}
                    className="flex-grow bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                  />
                  <label className="flex items-center justify-center p-3 bg-white/5 border border-white/10 hover:border-[#C5A059] cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-white/60" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, null, 'image')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Stat 1 Number</label>
                  <input
                    type="text"
                    value={cmsData.brandStory.stat1_number || ''}
                    onChange={(e) => updateCmsData('brandStory', 'stat1_number', e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Stat 1 Label</label>
                  <input
                    type="text"
                    value={cmsData.brandStory.stat1_label || ''}
                    onChange={(e) => updateCmsData('brandStory', 'stat1_label', e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Stat 2 Number</label>
                  <input
                    type="text"
                    value={cmsData.brandStory.stat2_number || ''}
                    onChange={(e) => updateCmsData('brandStory', 'stat2_number', e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Stat 2 Label</label>
                  <input
                    type="text"
                    value={cmsData.brandStory.stat2_label || ''}
                    onChange={(e) => updateCmsData('brandStory', 'stat2_label', e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {(activeSection === 'videoHero' || activeSection === 'customVideo') && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Video Loop Source</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cmsData.videoHero.src}
                    onChange={(e) => updateCmsData('videoHero', 'src', e.target.value)}
                    className="flex-grow bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                  />
                  <label className="flex items-center justify-center p-3 bg-white/5 border border-white/10 hover:border-[#C5A059] cursor-pointer">
                    <Upload className="w-4 h-4 text-white/60" />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleImageUpload(e, null, 'src')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Video Poster / Cover</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cmsData.videoHero.poster}
                    onChange={(e) => updateCmsData('videoHero', 'poster', e.target.value)}
                    className="flex-grow bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                  />
                  <label className="flex items-center justify-center p-3 bg-white/5 border border-white/10 hover:border-[#C5A059] cursor-pointer">
                    <Upload className="w-4 h-4 text-white/60" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, null, 'poster')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'trendingProducts' && (
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Trending Carousel Products</span>
              <p className="text-xs text-white/60">This section automatically displays all products marked as best sellers. Go to the products page to manage individual product properties.</p>
            </div>
          )}

          {activeSection === 'advertisement' && (
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Dynamic Promo Banner</span>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5 font-bold">Heading</label>
                <input
                  type="text"
                  value={cmsData.announcement?.text || ''}
                  onChange={(e) => updateCmsData('announcement', 'text', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                />
              </div>
            </div>
          )}

          {activeSection === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Reviews ({cmsData.testimonials.length})</span>
                <button
                  onClick={() => addCmsItem('testimonials', {
                    id: Date.now(),
                    name: 'Guest Connoisseur',
                    location: 'London',
                    review: 'Extremely detailed styling and exquisite comfort.',
                    rating: 5,
                    avatar: brandAssets.reviews[0].avatar
                  })}
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/30 px-2.5 py-1 hover:bg-[#C5A059] hover:text-black transition-all"
                >
                  <Plus className="w-3 h-3" /> Add Review
                </button>
              </div>

              {cmsData.testimonials.map((test, idx) => (
                <div key={test.id} className="p-4 bg-[#1A1A1A] border border-white/5 space-y-4 relative group animate-fade-in">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => idx > 0 && reorderCmsItem('testimonials', idx, idx - 1)} disabled={idx === 0} className="p-1 hover:bg-white/10 text-white disabled:opacity-30">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => idx < cmsData.testimonials.length - 1 && reorderCmsItem('testimonials', idx, idx + 1)} disabled={idx === cmsData.testimonials.length - 1} className="p-1 hover:bg-white/10 text-white disabled:opacity-30">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => cmsData.testimonials.length > 1 && deleteCmsItem('testimonials', idx)}
                      disabled={cmsData.testimonials.length === 1}
                      className="p-1 hover:bg-red-500/10 text-red-400 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[9px] uppercase tracking-widest font-bold text-white/50">Reviewer #{idx + 1}</span>

                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Name</label>
                        <input
                          type="text"
                          value={test.name}
                          onChange={(e) => {
                            const arr = [...cmsData.testimonials];
                            arr[idx].name = e.target.value;
                            updateCmsData('testimonials', arr);
                          }}
                          className="w-full bg-black border border-white/10 focus:border-[#C5A059] px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Location</label>
                        <input
                          type="text"
                          value={test.location}
                          onChange={(e) => {
                            const arr = [...cmsData.testimonials];
                            arr[idx].location = e.target.value;
                            updateCmsData('testimonials', arr);
                          }}
                          className="w-full bg-black border border-white/10 focus:border-[#C5A059] px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Review Text</label>
                      <textarea
                        value={test.review}
                        onChange={(e) => {
                          const arr = [...cmsData.testimonials];
                          arr[idx].review = e.target.value;
                          updateCmsData('testimonials', arr);
                        }}
                        className="w-full bg-black border border-white/10 focus:border-[#C5A059] px-3 py-2 text-xs text-white outline-none min-h-[70px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Instagram Masonry Items</span>
                <button
                  onClick={() => addCmsItem('gallery', '/images/20250202_001115.jpg')}
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/30 px-2.5 py-1 hover:bg-[#C5A059] hover:text-black transition-all"
                >
                  <Plus className="w-3 h-3" /> Add Image
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {cmsData.gallery.map((img, idx) => (
                  <div key={idx} className="bg-[#1A1A1A] p-2 border border-white/5 relative group flex flex-col gap-2">
                    <div className="relative aspect-square w-full bg-black">
                      <img src={img} alt="Instagram Grid Item" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <button onClick={() => idx > 0 && reorderCmsItem('gallery', idx, idx - 1)} disabled={idx === 0} className="p-1.5 bg-black/80 hover:bg-white/20 text-white rounded-sm disabled:opacity-30">
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button onClick={() => idx < cmsData.gallery.length - 1 && reorderCmsItem('gallery', idx, idx + 1)} disabled={idx === cmsData.gallery.length - 1} className="p-1.5 bg-black/80 hover:bg-white/20 text-white rounded-sm disabled:opacity-30">
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => cmsData.gallery.length > 1 && deleteCmsItem('gallery', idx)}
                          disabled={cmsData.gallery.length === 1}
                          className="p-1.5 bg-black/80 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-sm disabled:opacity-30"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => {
                          const arr = [...cmsData.gallery];
                          arr[idx] = e.target.value;
                          updateCmsData('gallery', arr);
                        }}
                        className="flex-grow bg-black border border-white/10 px-2 py-1 text-[10px] text-white outline-none min-w-0"
                      />
                      <label className="flex items-center justify-center p-1 bg-white/5 border border-white/10 hover:border-[#C5A059] cursor-pointer">
                        <Upload className="w-3 h-3 text-white/60" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, idx, 'array_image')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'newsletter' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Newsletter Heading</label>
                <input
                  type="text"
                  value={cmsData.newsletter.heading}
                  onChange={(e) => updateCmsData('newsletter', 'heading', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Description Text</label>
                <textarea
                  value={cmsData.newsletter.description}
                  onChange={(e) => updateCmsData('newsletter', 'description', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none min-h-[85px]"
                />
              </div>
            </div>
          )}

          {activeSection === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Categories ({cmsData.categories.length})</span>
                <button
                  onClick={() => addCmsItem('categories', {
                    name: 'New Category',
                    image: '/images/20250201_233511.jpg',
                    count: 0
                  })}
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/30 px-2.5 py-1 hover:bg-[#C5A059] hover:text-black transition-all"
                >
                  <Plus className="w-3 h-3" /> Add Category
                </button>
              </div>
              {cmsData.categories.map((cat, idx) => (
                <div key={idx} className="p-4 bg-[#1A1A1A] border border-white/5 space-y-3 relative group animate-fade-in">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => idx > 0 && reorderCmsItem('categories', idx, idx - 1)} disabled={idx === 0} className="p-1 hover:bg-white/10 text-white disabled:opacity-30">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => idx < cmsData.categories.length - 1 && reorderCmsItem('categories', idx, idx + 1)} disabled={idx === cmsData.categories.length - 1} className="p-1 hover:bg-white/10 text-white disabled:opacity-30">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button onClick={() => cmsData.categories.length > 1 && deleteCmsItem('categories', idx)} disabled={cmsData.categories.length === 1} className="p-1 hover:bg-red-500/10 text-red-400 disabled:opacity-30">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold pt-2">{cat.name} Category</span>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Category Name</label>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => {
                        const arr = [...cmsData.categories];
                        arr[idx].name = e.target.value;
                        updateCmsData('categories', arr);
                      }}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Cover Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cat.image}
                        onChange={(e) => {
                          const arr = [...cmsData.categories];
                          arr[idx].image = e.target.value;
                          updateCmsData('categories', arr);
                        }}
                        className="flex-grow bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none"
                      />
                      <label className="flex items-center justify-center p-2 bg-white/5 border border-white/10 hover:border-[#C5A059] cursor-pointer">
                        <Upload className="w-4 h-4 text-white/60" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, idx, 'image')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeSection === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Crew Members ({cmsData.team.length})</span>
                <button
                  onClick={() => addCmsItem('team', {
                    name: 'New Member',
                    role: 'Design Assistant',
                    image: 'Team+Member+1'
                  })}
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/30 px-2.5 py-1 hover:bg-[#C5A059] hover:text-black transition-all"
                >
                  <Plus className="w-3 h-3" /> Add Member
                </button>
              </div>

              {cmsData.team.map((member, idx) => (
                <div key={idx} className="p-4 bg-[#1A1A1A] border border-white/5 space-y-4 relative group">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => idx > 0 && reorderCmsItem('team', idx, idx - 1)} disabled={idx === 0} className="p-1 hover:bg-white/10 text-white disabled:opacity-30">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => idx < cmsData.team.length - 1 && reorderCmsItem('team', idx, idx + 1)} disabled={idx === cmsData.team.length - 1} className="p-1 hover:bg-white/10 text-white disabled:opacity-30">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => cmsData.team.length > 1 && deleteCmsItem('team', idx)}
                      disabled={cmsData.team.length === 1}
                      className="p-1 hover:bg-red-500/10 text-red-400 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[9px] uppercase tracking-widest font-bold text-white/50">Crew Member #{idx + 1}</span>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => {
                          const arr = [...cmsData.team];
                          arr[idx].name = e.target.value;
                          updateCmsData('team', arr);
                        }}
                        className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-white/60 mb-1.5">Role</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => {
                          const arr = [...cmsData.team];
                          arr[idx].role = e.target.value;
                          updateCmsData('team', arr);
                        }}
                        className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'about' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Headline</label>
                <input
                  type="text"
                  value={cmsData.about.title}
                  onChange={(e) => updateCmsData('about', 'title', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Subheadline</label>
                <input
                  type="text"
                  value={cmsData.about.subtitle}
                  onChange={(e) => updateCmsData('about', 'subtitle', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Story Paragraph</label>
                <textarea
                  value={cmsData.about.story}
                  onChange={(e) => updateCmsData('about', 'story', e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none min-h-[140px]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Editorial Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cmsData.about.image}
                    onChange={(e) => updateCmsData('about', 'image', e.target.value)}
                    className="flex-grow bg-[#1A1A1A] border border-[#C5A059]/20 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                  />
                  <label className="flex items-center justify-center p-3 bg-white/5 border border-white/10 hover:border-[#C5A059] cursor-pointer">
                    <Upload className="w-4 h-4 text-white/60" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, null, 'image')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
