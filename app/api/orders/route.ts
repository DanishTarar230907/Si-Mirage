// app/api/orders/route.ts
// Production order creation endpoint
// Architecture: COD-first with extensibility for future payment providers

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { OrderItem, ShippingAddress, PaymentMethod } from '@/types/orders';

interface CreateOrderBody {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  discountApplied: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  transactionId?: string;
}

export async function POST(request: Request) {
  try {
    const body: CreateOrderBody = await request.json();
    const {
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      discountApplied,
      totalAmount,
      paymentMethod,
      notes,
    } = body;

    // Validate required fields
    if (!items?.length || !shippingAddress || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required order fields' },
        { status: 400 }
      );
    }

    // 1. Insert the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          items: items,
          shipping_address: shippingAddress,
          total_amount: totalAmount,
          shipping_cost: shippingCost,
          discount_applied: discountApplied,
          subtotal: subtotal,
          status: 'pending',
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
          notes: notes || null,
        },
      ])
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('Order insert error:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const orderId = order.id;

    // 2. Decrement stock for each item
    // We do this sequentially to avoid race conditions.
    // In production with high traffic, this should be a Postgres transaction / RPC.
    const stockErrors: string[] = [];

    for (const item of items) {
      if (item.variantId) {
        // Decrement variant stock
        const { error } = await supabaseAdmin.rpc('decrement_variant_stock', {
          variant_id: item.variantId,
          qty: item.quantity,
        });
        if (error) stockErrors.push(`variant ${item.variantId}: ${error.message}`);
      } else {
        // Decrement product stock
        const { error } = await supabaseAdmin.rpc('decrement_product_stock', {
          product_id: item.productId,
          qty: item.quantity,
        });
        if (error) stockErrors.push(`product ${item.productId}: ${error.message}`);
      }
    }

    if (stockErrors.length > 0) {
      // Log but don't fail — order was created. Admin can reconcile manually.
      console.warn('Stock decrement errors (order still created):', stockErrors);
    }

    return NextResponse.json({ orderId, success: true }, { status: 201 });
  } catch (err) {
    console.error('API /api/orders error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Admin-only: list all orders
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ orders: data });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
