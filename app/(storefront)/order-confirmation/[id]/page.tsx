// app/(storefront)/order-confirmation/[id]/page.tsx
// Order confirmation — server component that fetches order from Supabase

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import OrderConfirmationClient from './OrderConfirmationClient';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return {
    title: `Order Confirmed #${id.slice(0, 8).toUpperCase()} | Si Mirage`,
    description: 'Your Si Mirage order has been placed successfully.',
  };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

  return <OrderConfirmationClient order={order} />;
}
