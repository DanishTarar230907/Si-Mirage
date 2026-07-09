'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAdminContext } from './AdminContext';
import { Edit3, Check, X, Upload, Link, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminEditableProps {
  section: string;
  field?: string; // Optional if editing a flat array of strings
  index?: number; // Optional for array elements
  type?: 'text' | 'textarea' | 'image' | 'video';
  children: React.ReactNode;
  className?: string;
}

export default function AdminEditable({
  section,
  field,
  index,
  type = 'text',
  children,
  className
}: AdminEditableProps) {
  const { isAdmin, isEditMode, cmsData, updateCmsData, reorderCmsItem, deleteCmsItem } = useAdminContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [value, setValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // If not in admin/edit mode, bypass editing overlays
  if (!isAdmin || !isEditMode) {
    return <>{children}</>;
  }

  // Resolve current value from cmsData
  const getCmsValue = (): string => {
    try {
      const sectionData = cmsData[section as keyof typeof cmsData];
      if (Array.isArray(sectionData) && index !== undefined) {
        if (field) {
          return sectionData[index]?.[field] || '';
        }
        return sectionData[index] || '';
      } else if (sectionData && typeof sectionData === 'object') {
        if (field) {
          return (sectionData as any)[field] || '';
        }
      }
    } catch (e) {
      console.warn('Error resolving editable value:', e);
    }
    return '';
  };

  const handleSave = (newValue: string) => {
    try {
      const sectionData = cmsData[section as keyof typeof cmsData];
      if (Array.isArray(sectionData) && index !== undefined) {
        const newArray = [...sectionData];
        if (field) {
          newArray[index] = {
            ...newArray[index],
            [field]: newValue
          };
        } else {
          newArray[index] = newValue;
        }
        updateCmsData(section as any, newArray);
      } else {
        if (field) {
          updateCmsData(section as any, field, newValue);
        } else {
          updateCmsData(section as any, newValue);
        }
      }
    } catch (e) {
      console.error('Error saving editable value:', e);
    }
    setIsEditing(false);
  };

  const startEditing = () => {
    setValue(getCmsValue());
    setIsEditing(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cms-media')
        .getPublicUrl(filePath);

      setValue(publicUrl);
      handleSave(publicUrl);
      alert('Asset uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Upload failed. Applying a local preview instead.');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setValue(base64Url);
        handleSave(base64Url);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative transition-all duration-300 ${
        isHovered ? 'ring-1 ring-[#C5A059] ring-dashed' : ''
      } ${className || ''}`}
    >
      {/* Element Hover Badge */}
      {isHovered && !isEditing && (
        <div className="absolute top-2 right-2 z-50 flex items-center gap-0.5 bg-black/95 border border-[#C5A059]/60 p-1 shadow-lg">
          <button
            onClick={startEditing}
            title="Edit Content"
            className="flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-widest text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all"
          >
            <Edit3 className="w-2.5 h-2.5" /> Edit {type}
          </button>
          
          {index !== undefined && Array.isArray(cmsData[section as keyof typeof cmsData]) && (
            <>
              <div className="w-[1px] h-3 bg-white/20 mx-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const arr = cmsData[section as keyof typeof cmsData] as any[];
                  if (index > 0) reorderCmsItem(section as any, index, index - 1);
                }}
                title="Move Up"
                disabled={index === 0}
                className="p-1 text-[#C5A059] hover:bg-white/10 transition-colors disabled:opacity-30"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const arr = cmsData[section as keyof typeof cmsData] as any[];
                  if (index < arr.length - 1) reorderCmsItem(section as any, index, index + 1);
                }}
                title="Move Down"
                disabled={index === (cmsData[section as keyof typeof cmsData] as any[]).length - 1}
                className="p-1 text-[#C5A059] hover:bg-white/10 transition-colors disabled:opacity-30"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
              <div className="w-[1px] h-3 bg-white/20 mx-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCmsItem(section as any, index);
                }}
                title="Delete"
                className="p-1 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Inline Editors */}
      {isEditing ? (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#121212] border border-[#C5A059] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Edit Content</span>
              <button onClick={() => setIsEditing(false)} className="text-white/60 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {type === 'text' && (
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/20 focus:border-[#C5A059] text-white text-sm px-4 py-3 outline-none font-sans transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave(value);
                  if (e.key === 'Escape') setIsEditing(false);
                }}
              />
            )}

            {type === 'textarea' && (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={5}
                className="w-full bg-[#1c1c1c] border border-white/20 focus:border-[#C5A059] text-white text-sm px-4 py-3 outline-none font-sans resize-none transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsEditing(false);
                }}
              />
            )}

            {(type === 'image' || type === 'video') && (
              <div className="w-full bg-[#1c1c1c] border border-white/10 p-4 space-y-4 font-sans text-left">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-2">Asset URL</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-black border border-white/20 focus:border-[#C5A059] text-white text-sm px-4 py-3 outline-none transition-colors"
                  />
                </div>
                <div className="border-t border-white/10 pt-4">
                  <span className="block text-[10px] uppercase tracking-wider text-white/60 mb-2">Or Upload File</span>
                  <label className="flex items-center justify-center gap-2 border border-dashed border-white/30 hover:border-[#C5A059] py-4 cursor-pointer transition-colors bg-white/5">
                    <Upload className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[10px] uppercase tracking-wider text-white/80">
                      {isUploading ? 'Uploading...' : 'Choose File'}
                    </span>
                    <input type="file" onChange={handleFileUpload} className="hidden" accept={type === 'image' ? 'image/*' : 'video/*'} />
                  </label>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-4 w-full justify-end font-sans">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center justify-center bg-black border border-white/20 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(value)}
                className="flex items-center justify-center gap-2 bg-[#C5A059] text-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#b08b47] transition-all"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
