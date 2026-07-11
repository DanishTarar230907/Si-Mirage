import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, name, rating, title, comment } = body;

    if (!productId || !name || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert the review with 'pending' status using the Admin client to bypass RLS policies
    const { error } = await supabaseAdmin
      .from('product_reviews')
      .insert([
        {
          product_id: productId,
          customer_name: name,
          rating: Number(rating),
          title: title || null,
          comment: comment || null,
          status: 'pending',
          is_verified_purchase: false // In a real app, you'd check order history here
        }
      ]);

    if (error) {
      console.error('Error inserting review:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
