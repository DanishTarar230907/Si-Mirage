import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Updating Hero Slides...');
  const { error: heroErr } = await supabase.from('hero_slides').update({
    title: 'WHERE VISION BECOMES MIRAGE.',
    cta1_text: 'EXPLORE COLLECTION'
  }).eq('display_order', 0);
  if (heroErr) console.error(heroErr);

  console.log('Updating Collections (Everyday Banner)...');
  const { error: colErr } = await supabase.from('collections').update({
    name: 'WEAR THE SILENCE'
  }).eq('slug', 'everyday');
  if (colErr) console.error(colErr);

  console.log('Database text synchronized with mockup!');
}

run();
