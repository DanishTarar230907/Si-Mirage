'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Image as ImageIcon, Megaphone,
  Layers, FolderOpen, Camera, Video, Star, Grid3X3,
  ShoppingCart, Users, Tag, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const navGroups = [
  {
    label: 'Dashboard',
    items: [
      { key: 'overview', label: 'Overview', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { key: 'hero', label: 'Hero Slides', href: '/admin/hero', icon: ImageIcon },
      { key: 'announcements', label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
      { key: 'categories', label: 'Categories', href: '/admin/categories', icon: FolderOpen },
      { key: 'collections', label: 'Collections', href: '/admin/collections', icon: Layers },
      { key: 'creatives', label: 'Creative Showcase', href: '/admin/creatives', icon: Camera },
      { key: 'media', label: 'Media Showcase', href: '/admin/media', icon: Video },
      { key: 'testimonials', label: 'Testimonials', href: '/admin/testimonials', icon: Star },
      { key: 'gallery', label: 'Gallery', href: '/admin/gallery', icon: Grid3X3 },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { key: 'products', label: 'Products', href: '/admin/products', icon: Package },
      { key: 'orders', label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { key: 'customers', label: 'Customers', href: '/admin/customers', icon: Users },
      { key: 'discounts', label: 'Discounts', href: '/admin/discounts', icon: Tag },
    ],
  },
  {
    label: 'System',
    items: [
      { key: 'settings', label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-white border-r border-black/5 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-black/5 px-4 shrink-0">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Si Mirage" width={collapsed ? 32 : 120} height={32} className="object-contain" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-black/40 mb-2 px-3">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-200 group ${
                      active
                        ? 'bg-black text-white'
                        : 'text-black/60 hover:bg-black/5 hover:text-black'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0 stroke-[1.5]" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="h-12 flex items-center justify-center border-t border-black/5 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md text-black/40 hover:text-black hover:bg-black/5 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
