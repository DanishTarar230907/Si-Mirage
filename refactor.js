const fs = require('fs');
let content = fs.readFileSync('components/admin/AdminContext.tsx', 'utf8');

// 1. Add imports at the top
content = content.replace('import { supabase } from \'@/lib/supabase\';', 'import { supabase } from \'@/lib/supabase\';\nimport { fetchCmsData } from \'@/lib/cms\';\nimport { initialCmsData } from \'@/lib/initialCmsData\';\nimport { CmsDataState, HeroSlide, CategoryGridItem, BrandStoryData, VideoHeroData, TestimonialItem, TeamMember, SectionLayout } from \'@/types/cms\';');

// 2. Remove local interfaces
content = content.replace(/export interface HeroSlide \{[\s\S]*?export interface CmsDataState \{[\s\S]*?export interface SectionLayout \{[\s\S]*?\}/, '');

// 3. Remove initialCmsData
content = content.replace(/const initialCmsData: CmsDataState = \{[\s\S]*?\n};\n\nconst AdminContext/, 'const AdminContext');

// 4. Update AdminProvider signature
content = content.replace('export function AdminProvider({ children }: { children: React.ReactNode }) {', 'export function AdminProvider({ children, initialData }: { children: React.ReactNode, initialData?: CmsDataState }) {');

// 5. Update useState
content = content.replace('const [cmsData, setCmsData] = useState<CmsDataState>(initialCmsData);', 'const [cmsData, setCmsData] = useState<CmsDataState>(initialData || initialCmsData);');

// 6. Update fetchFromSupabase
const fetchOld = /const fetchFromSupabase = useCallback\(async \(\) => \{[\s\S]*?setIsLoading\(false\);\n  \}, \[\]\);/;
const fetchNew = `const fetchFromSupabase = useCallback(async () => {
    setIsLoading(true);
    const updatedData = await fetchCmsData(initialData || initialCmsData);
    setCmsData(updatedData);
    setIsLoading(false);
  }, [initialData]);`;
content = content.replace(fetchOld, fetchNew);

// Fix initial render loading state
content = content.replace('const [isLoading, setIsLoading] = useState(true);', 'const [isLoading, setIsLoading] = useState(false);');

fs.writeFileSync('components/admin/AdminContext.tsx', content);
console.log('AdminContext refactored successfully.');
