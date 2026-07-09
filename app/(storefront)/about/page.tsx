'use client';

import { useCmsData } from '@/components/admin/AdminContext';
import DynamicSectionRenderer from '@/components/home/DynamicSectionRenderer';

export default function AboutPage() {
  const { cmsData } = useCmsData();
  const layout = cmsData.pageLayouts?.['/about'] || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {layout
        .filter((section) => section.visible)
        .map((section) => (
          <DynamicSectionRenderer key={section.id} type={section.type} />
        ))}
    </div>
  );
}
