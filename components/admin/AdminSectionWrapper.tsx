'use client';

import React from 'react';
import { useAdminContext } from './AdminContext';
import { Settings, Eye, EyeOff, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AdminSectionWrapperProps {
  sectionId: string;
  sectionName: string;
  children: React.ReactNode;
}

export default function AdminSectionWrapper({
  sectionId,
  sectionName,
  children
}: AdminSectionWrapperProps) {
  const {
    isAdmin,
    isEditMode,
    setActiveSection,
    activeSection,
    cmsData,
    moveSection,
    toggleSectionVisibility,
    deleteSection
  } = useAdminContext();

  const pathname = usePathname();
  // Derive page path: e.g. /admin -> /, /admin/about -> /about
  const pagePath = pathname === '/admin' ? '/' : pathname.replace(/^\/admin/, '') || '/';

  // If we are not on an admin route or Edit Mode is off, render normally
  if (!isAdmin || !isEditMode) {
    return <>{children}</>;
  }

  // Find this section in the page layout layout list
  const layout = cmsData.pageLayouts?.[pagePath] || [];
  const sectionIndex = layout.findIndex(s => 
    s.id === sectionId || 
    s.type === sectionId || 
    s.id === `section-${sectionId}`
  );
  
  const sectionObj = sectionIndex !== -1 ? layout[sectionIndex] : null;
  const isEditingThis = activeSection === sectionId;
  const isHidden = sectionObj && !sectionObj.visible;

  return (
    <div
      className={`relative transition-all duration-300 ${
        isEditingThis
          ? 'ring-2 ring-[#C5A059] ring-offset-2'
          : 'ring-1 ring-white/10 hover:ring-[#C5A059]/60'
      } ${isHidden ? 'opacity-65' : ''}`}
    >
      {/* Dynamic Page Section Controls */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2 bg-black/95 backdrop-blur-md border border-[#C5A059]/40 px-3 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A059]">
          {sectionName} {isHidden && <span className="text-red-400 font-medium ml-1 font-sans text-[9px]">(Hidden)</span>}
        </span>
        <div className="h-3.5 w-[1px] bg-white/20 mx-1" />
        
        {/* Edit Button */}
        <button
          onClick={() => setActiveSection(sectionId)}
          title="Edit Section Content"
          className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-[#FAFAFA] hover:text-[#C5A059] transition-colors px-1"
        >
          <Settings className="w-3 h-3 text-[#C5A059]" />
          <span className="hidden sm:inline">Edit Content</span>
        </button>

        {sectionObj && (
          <>
            <div className="h-3.5 w-[1px] bg-white/20 mx-1" />
            
            {/* Move Up */}
            <button
              onClick={() => moveSection(pagePath, sectionIndex, 'up')}
              disabled={sectionIndex === 0}
              title="Move Section Up"
              className="text-[#FAFAFA] hover:text-[#C5A059] disabled:opacity-30 disabled:hover:text-white transition-colors p-1"
            >
              <ArrowUp className="w-3 h-3" />
            </button>

            {/* Move Down */}
            <button
              onClick={() => moveSection(pagePath, sectionIndex, 'down')}
              disabled={sectionIndex === layout.length - 1}
              title="Move Section Down"
              className="text-[#FAFAFA] hover:text-[#C5A059] disabled:opacity-30 disabled:hover:text-white transition-colors p-1"
            >
              <ArrowDown className="w-3.5 h-3" />
            </button>

            {/* Toggle Visibility */}
            <button
              onClick={() => toggleSectionVisibility(pagePath, sectionIndex)}
              title={sectionObj.visible ? "Hide Section" : "Show Section"}
              className="text-[#FAFAFA] hover:text-[#C5A059] transition-colors p-1"
            >
              {sectionObj.visible ? <Eye className="w-3.5 h-3.5 text-[#C5A059]" /> : <EyeOff className="w-3.5 h-3.5 text-white/40" />}
            </button>

            {/* Delete Section */}
            <button
              onClick={() => deleteSection(pagePath, sectionIndex)}
              title="Delete Section"
              className="text-red-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </>
        )}
      </div>

      {/* Overlaid hidden message indicator */}
      {isHidden && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[1px] pointer-events-none">
          <div className="border border-[#C5A059]/20 px-6 py-3 bg-[#121212]/95 text-white tracking-[0.2em] text-[10px] uppercase font-bold shadow-xl">
            Section Hidden from Storefront
          </div>
        </div>
      )}

      {/* Actual Storefront Component */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
