'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { brandAssets } from '@/config/brandAssets';
import { mockProducts, mockCreativeShowcase, mockMediaShowcase } from '@/config/cmsMockData';
import { shopProducts } from '@/data/shopData';
import { bestSellerProducts } from '@/data/bestSellersData';
import { supabase } from '@/lib/supabase';
import { fetchCmsData } from '@/lib/cms';
import { initialCmsData } from '@/lib/initialCmsData';
import { CmsDataState, HeroSlide, CategoryGridItem, BrandStoryData, VideoHeroData, TestimonialItem, TeamMember, SectionLayout } from '@/types/cms';


// Define schemas


interface AdminContextProps {
  isAdmin: boolean;
  isEditMode: boolean;
  setEditMode: (val: boolean) => void;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  activeItemIndex: number | null;
  setActiveItemIndex: (idx: number | null) => void;
  activeItemType: string | null;
  setActiveItemType: (type: string | null) => void;
  cmsData: CmsDataState;
  updateCmsData: (section: keyof CmsDataState, fieldOrValue: any, value?: any) => void;
  reorderCmsItem: (section: keyof CmsDataState, fromIndex: number, toIndex: number) => void;
  deleteCmsItem: (section: keyof CmsDataState, index: number) => void;
  addCmsItem: (section: keyof CmsDataState, item: any) => void;
  moveSection: (pagePath: string, index: number, direction: 'up' | 'down') => void;
  toggleSectionVisibility: (pagePath: string, index: number) => void;
  deleteSection: (pagePath: string, index: number) => void;
  addSection: (pagePath: string, sectionType: string, customName?: string) => void;
  saveDraft: () => void;
  publishChanges: () => Promise<void>;
  discardChanges: () => void;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  user: any;
  isAdminUser: boolean;
  isLoadingAuth: boolean;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export function AdminProvider({ children, initialData }: { children: React.ReactNode, initialData?: CmsDataState }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isLoginRoute = pathname === '/admin/login';
  
  const [isEditMode, setEditMode] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [activeItemType, setActiveItemType] = useState<string | null>(null);
  
  const [cmsData, setCmsData] = useState<CmsDataState>(initialData || initialCmsData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication State
  const [user, setUser] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Listen to Auth State Changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleAuthChange(session: any) {
    if (!session) {
      setUser(null);
      setIsAdminUser(false);
      setIsLoadingAuth(false);
      return;
    }

    setUser(session.user);

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data && !error) {
        setIsAdminUser(true);
      } else {
        setIsAdminUser(false);
      }
    } catch (e) {
      console.error('Error verifying admin user:', e);
      setIsAdminUser(false);
    } finally {
      setIsLoadingAuth(false);
    }
  }

  // Redirect visitors based on credentials
  useEffect(() => {
    if (isAdminRoute && !isLoginRoute && !isLoadingAuth && !user) {
      router.push('/admin/login');
    }
  }, [isAdminRoute, isLoginRoute, isLoadingAuth, user, router]);

  useEffect(() => {
    if (isLoginRoute && !isLoadingAuth && user && isAdminUser) {
      router.push('/admin');
    }
  }, [isLoginRoute, isLoadingAuth, user, isAdminUser, router]);

  const fetchFromSupabase = useCallback(async () => {
    setIsLoading(true);
    const updatedData = await fetchCmsData(initialData || initialCmsData);
    setCmsData(updatedData);
    setIsLoading(false);
  }, [initialData]);

  // Load from Supabase on init
  useEffect(() => {
    fetchFromSupabase();
  }, [fetchFromSupabase]);

  // Realtime Database synchronization to keep client storefront and admin view in sync instantly
  useEffect(() => {
    const channel = supabase
      .channel('realtime-cms-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Realtime change detected in database:', payload.table);
          fetchFromSupabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFromSupabase]);

  // Sync state to localStorage for unsaved drafts
  const saveDraft = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('si-mirage-cms-draft', JSON.stringify(cmsData));
      setHasUnsavedChanges(false);
      alert('Draft saved locally! Remember to click "Publish" to sync to the live database.');
    }
  };

  const discardChanges = () => {
    if (confirm('Are you sure you want to discard all unsaved edits?')) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('si-mirage-cms-draft');
      }
      window.location.reload();
    }
  };

  // Warn on leave if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved edits in the Visual CMS. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Update CMS data locally for instant live preview
  const updateCmsData = (section: keyof CmsDataState, fieldOrValue: any, value?: any) => {
    setHasUnsavedChanges(true);
    setCmsData(prev => {
      const next = { ...prev };
      
      if (value !== undefined) {
        // Nested field update (e.g. section='newsletter', fieldOrValue='heading', value='Hello')
        const currentSection = next[section] as any;
        if (typeof currentSection === 'object' && !Array.isArray(currentSection)) {
          next[section] = {
            ...currentSection,
            [fieldOrValue]: value
          };
        }
      } else {
        // Direct value update (e.g. section='hero', fieldOrValue=newHeroArray)
        next[section] = fieldOrValue;
      }
      
      return next;
    });
  };

  const reorderCmsItem = (section: keyof CmsDataState, fromIndex: number, toIndex: number) => {
    const arr = cmsData[section];
    if (!Array.isArray(arr)) return;
    
    setHasUnsavedChanges(true);
    const result = Array.from(arr);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    
    setCmsData(prev => ({
      ...prev,
      [section]: result
    }));
  };

  const deleteCmsItem = (section: keyof CmsDataState, index: number) => {
    const arr = cmsData[section];
    if (!Array.isArray(arr)) return;
    
    setHasUnsavedChanges(true);
    const result = Array.from(arr);
    result.splice(index, 1);
    
    setCmsData(prev => ({
      ...prev,
      [section]: result
    }));
  };

  const addCmsItem = (section: keyof CmsDataState, item: any) => {
    const arr = cmsData[section];
    if (!Array.isArray(arr)) return;
    
    setHasUnsavedChanges(true);
    setCmsData(prev => ({
      ...prev,
      [section]: [item, ...arr]
    }));
  };

  const moveSection = (pagePath: string, index: number, direction: 'up' | 'down') => {
    const layout = cmsData.pageLayouts?.[pagePath];
    if (!layout) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= layout.length) return;

    setHasUnsavedChanges(true);
    const newLayout = [...layout];
    const [moved] = newLayout.splice(index, 1);
    newLayout.splice(newIndex, 0, moved);

    setCmsData(prev => ({
      ...prev,
      pageLayouts: {
        ...prev.pageLayouts,
        [pagePath]: newLayout
      }
    }));
  };

  const toggleSectionVisibility = (pagePath: string, index: number) => {
    const layout = cmsData.pageLayouts?.[pagePath];
    if (!layout) return;

    setHasUnsavedChanges(true);
    const newLayout = layout.map((s, idx) => 
      idx === index ? { ...s, visible: !s.visible } : s
    );

    setCmsData(prev => ({
      ...prev,
      pageLayouts: {
        ...prev.pageLayouts,
        [pagePath]: newLayout
      }
    }));
  };

  const deleteSection = (pagePath: string, index: number) => {
    const layout = cmsData.pageLayouts?.[pagePath];
    if (!layout) return;

    if (!confirm('Are you sure you want to delete this section from the page?')) return;

    setHasUnsavedChanges(true);
    const newLayout = [...layout];
    newLayout.splice(index, 1);

    setCmsData(prev => ({
      ...prev,
      pageLayouts: {
        ...prev.pageLayouts,
        [pagePath]: newLayout
      }
    }));
  };

  const addSection = (pagePath: string, sectionType: string, customName?: string) => {
    const layout = cmsData.pageLayouts?.[pagePath] || [];
    
    setHasUnsavedChanges(true);
    const id = `section-${sectionType}-${Date.now()}`;
    const name = customName || sectionType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    
    const newSection = {
      id,
      name,
      type: sectionType,
      visible: true
    };

    setCmsData(prev => ({
      ...prev,
      pageLayouts: {
        ...prev.pageLayouts,
        [pagePath]: [...layout, newSection]
      }
    }));
  };

  // Publish live draft to Supabase database
  const publishChanges = async () => {
    setIsLoading(true);
    try {
      // 1. Publish Hero Slides
      await supabase.from('hero_slides').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError(); // clear all
      const heroSlidesToInsert = cmsData.hero.map((h, idx) => ({
        title: h.title || '',
        subtitle: h.subtitle || '',
        image_url: h.image || '',
        cta1_text: h.cta1 || '',
        cta2_text: h.cta2 || '',
        display_order: idx,
        is_active: true
      }));
      await supabase.from('hero_slides').insert(heroSlidesToInsert).throwOnError();

      // 2. Publish Announcement Bar
      await supabase.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError();
      await supabase.from('announcements').insert([{
        message: cmsData.announcement.text || '',
        is_active: true,
        display_order: 1
      }]).throwOnError();

      // 3. Publish Testimonials
      await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError();
      const testimonialsToInsert = cmsData.testimonials.map(t => ({
        name: t.name || '',
        location: t.location || '',
        review: t.review || '',
        rating: t.rating || 5,
        avatar_url: t.avatar || '',
        is_active: true,
        is_featured: true
      }));
      await supabase.from('testimonials').insert(testimonialsToInsert).throwOnError();

      // 4. Publish Categories
      await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError();
      const categoriesToInsert = cmsData.categories.map((c, idx) => ({
        name: c.name || '',
        slug: (c.name || '').toLowerCase().replace(' ', '-'),
        image_url: c.image || '',
        display_order: idx,
        is_featured: idx < 3,
        is_active: true
      }));
      await supabase.from('categories').insert(categoriesToInsert).throwOnError();

      // 5. Publish Collections
      await supabase.from('collections').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError();
      await supabase.from('collections').insert([
        {
          name: cmsData.luxuryBanner.title || 'Luxury',
          slug: 'luxury',
          description: cmsData.luxuryBanner.subtitle || '',
          image_url: cmsData.luxuryBanner.image || '',
          display_order: 1,
          is_featured: true,
          is_active: true
        },
        {
          name: cmsData.everydayBanner.title || 'Everyday',
          slug: 'everyday',
          description: cmsData.everydayBanner.subtitle || '',
          image_url: cmsData.everydayBanner.image || '',
          display_order: 2,
          is_featured: true,
          is_active: true
        }
      ]).throwOnError();

      // 6. Publish Team members
      await supabase.from('team_members').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError();
      const teamToInsert = cmsData.team.map(t => ({
        name: t.name || '',
        role: t.role || 'model',
        photo_url: t.image || '',
        is_active: true
      }));
      await supabase.from('team_members').insert(teamToInsert).throwOnError();

      // 7. Publish Gallery Items
      await supabase.from('gallery_items').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError();
      const galleryToInsert = cmsData.gallery.map((g, idx) => ({
        image_url: g || '',
        display_order: idx,
        is_active: true
      }));
      await supabase.from('gallery_items').insert(galleryToInsert).throwOnError();

      // 8. Publish Site Settings
      await supabase.from('site_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError();
      await supabase.from('site_settings').insert([{
        newsletter_heading: cmsData.newsletter.heading || '',
        newsletter_description: cmsData.newsletter.description || '',
        page_layouts: cmsData.pageLayouts || {},
        brand_story: cmsData.brandStory || {}
      }]).throwOnError();

      // 9. Sync Products
      const currentIds = cmsData.shopProducts.map(p => p.id).filter(id => typeof id === 'string');
      if (currentIds.length > 0) {
        await supabase.from('products').delete().not('id', 'in', `(${currentIds.join(',')})`).throwOnError();
      } else {
        await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError();
      }

      const productsToUpsert = cmsData.shopProducts.map(p => {
        const productObj: any = {
          name: p.name || 'Unnamed Product',
          description: p.description || '',
          price: Number(p.price) || 0,
          discount_price: p.discountPrice ? Number(p.discountPrice) : null,
          category: (p.category || 'luxury').toLowerCase(),
          stock_quantity: Number(p.stock) || 0,
          images: [p.image, p.hoverImage].filter(Boolean),
          is_featured: cmsData.trendingProducts.some(tp => tp.id === p.id)
        };
        if (typeof p.id === 'string' && p.id.includes('-')) {
          productObj.id = p.id;
        }
        return productObj;
      });
      await supabase.from('products').upsert(productsToUpsert).throwOnError();

      // 10. Sync Creative Showcases
      await supabase.from('creative_showcases').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError();
      const creativeToInsert = (cmsData.creativeShowcase || []).map((item, idx) => ({
        title: item.title || '',
        subtitle: item.subtitle || '',
        cover_image: item.coverImage || item.image || '',
        size: item.size || 'medium',
        display_order: idx,
        is_active: true
      }));
      await supabase.from('creative_showcases').insert(creativeToInsert).throwOnError();

      // 11. Sync Media Showcases
      await supabase.from('media_showcases').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError();
      const mediaToInsert = (cmsData.mediaShowcase || []).map((item, idx) => ({
        title: item.title || '',
        subtitle: item.subtitle || '',
        video_url: item.video || '',
        cover_image: item.coverImage || '',
        layout: item.layout || 'split',
        display_order: idx,
        is_active: true
      }));
      await supabase.from('media_showcases').insert(mediaToInsert).throwOnError();

      setHasUnsavedChanges(false);
      alert('CMS changes published successfully to the live storefront database!');
    } catch (err) {
      console.error(err);
      alert('Failed to publish changes to Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auth/Admin Guard overlays inside render block
  if (isAdminRoute && !isLoginRoute) {
    if (isLoadingAuth) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0d] text-[#f7f4ee] font-sans">
          <div className="text-center space-y-4 animate-pulse">
            <h1 className="font-serif text-3xl tracking-[0.3em] text-[#C5A059] uppercase">Si Mirage</h1>
            <p className="text-[10px] tracking-[0.4em] text-[#f7f4ee]/40 uppercase">Loading Atelier Workspace</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0d] text-[#f7f4ee] font-sans">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-3xl tracking-[0.3em] text-[#C5A059] uppercase">Si Mirage</h1>
            <p className="text-[10px] tracking-[0.4em] text-[#f7f4ee]/40 uppercase animate-pulse">Redirecting to Login...</p>
          </div>
        </div>
      );
    }

    if (!isAdminUser) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0d] text-[#f7f4ee] font-sans px-6">
          <div className="text-center max-w-md space-y-6 border border-[#C5A059]/20 p-12 bg-[#121212]/80 backdrop-blur-md">
            <h1 className="font-serif text-3xl tracking-[0.2em] text-[#C5A059] uppercase">Access Denied</h1>
            <div className="h-[1px] w-12 bg-[#C5A059] mx-auto"></div>
            <p className="text-sm tracking-[0.1em] text-[#f7f4ee]/70 leading-relaxed">
              Your account <strong>{user.email}</strong> is not registered as an administrator.
              Please contact the atelier manager.
            </p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-4 px-8 py-3 bg-[#C5A059] text-[#0d0d0d] hover:bg-[#b08b47] transition-all duration-300 text-xs font-semibold tracking-[0.2em] uppercase"
            >
              Sign Out / Switch Account
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <AdminContext.Provider
      value={{
        isAdmin: isAdminRoute,
        isEditMode,
        setEditMode,
        activeSection,
        setActiveSection,
        activeItemIndex,
        setActiveItemIndex,
        activeItemType,
        setActiveItemType,
        cmsData,
        updateCmsData,
        reorderCmsItem,
        deleteCmsItem,
        addCmsItem,
        moveSection,
        toggleSectionVisibility,
        deleteSection,
        addSection,
        saveDraft,
        publishChanges,
        discardChanges,
        hasUnsavedChanges,
        isLoading,
        user,
        isAdminUser,
        isLoadingAuth
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}

export function useCmsData() {
  const context = useContext(AdminContext);
  if (!context) {
    return {
      isAdmin: false,
      isEditMode: false,
      cmsData: initialCmsData,
    };
  }
  return {
    isAdmin: context.isAdmin,
    isEditMode: context.isEditMode,
    cmsData: context.cmsData,
  };
}
