'use client';

// app/(storefront)/order-confirmation/[id]/OrderConfirmationClient.tsx

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Package, Truck, MapPin, Phone, Mail } from 'lucide-react';
import { LUXURY_EASE } from '@/lib/animations';

export default function OrderConfirmationClient({ order }: { order: any }) {
  const addr = order.shipping_address || {};
  const items = order.items || [];
  const orderNumber = order.id?.slice(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-2xl">
        {/* Success animation */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-[#C5A059]/15 border-2 border-[#C5A059]/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-[#C5A059]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: LUXURY_EASE, delay: 0.3 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#C5A059] mb-3">
              Order Confirmed
            </p>
            <h1 className="text-3xl md:text-4xl font-light text-[#121212] mb-3">
              Thank you, {addr.name?.split(' ')[0] || 'Friend'}.
            </h1>
            <p className="text-black/50 text-sm leading-relaxed max-w-md mx-auto">
              Your Si Mirage order has been received and is being prepared. You will receive updates via email and phone.
            </p>
          </motion.div>
        </div>

        {/* Order number */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white border border-black/8 rounded-sm px-6 py-5 mb-6 flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-black/40 mb-1">Order Number</p>
            <p className="text-xl font-mono font-bold text-[#121212]">#{orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-black/40 mb-1">Total</p>
            <p className="text-xl font-bold text-[#C5A059]">Rs. {Number(order.total_amount).toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: LUXURY_EASE }}
          className="bg-white border border-black/8 mb-6"
        >
          <div className="px-6 py-4 border-b border-black/6">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#121212]">
              <Package className="w-4 h-4 text-[#C5A059]" />
              Items Ordered
            </div>
          </div>
          <ul className="divide-y divide-black/5">
            {items.map((item: any, i: number) => (
              <li key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="relative w-14 h-16 flex-shrink-0 bg-[#F0EDE6]">
                  <Image
                    src={item.image || '/images/20250201_233239.jpg'}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#121212] truncate">{item.name}</p>
                  {item.variantName && <p className="text-xs text-black/40">{item.variantName}</p>}
                  <p className="text-xs text-black/40 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-[#121212] flex-shrink-0">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
          <div className="px-6 py-4 border-t border-black/6 space-y-1.5">
            <div className="flex justify-between text-xs text-black/40">
              <span>Subtotal</span>
              <span>Rs. {Number(order.subtotal || order.total_amount - (order.shipping_cost || 0)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-black/40">
              <span>Shipping</span>
              <span>{Number(order.shipping_cost) === 0 ? 'Complimentary' : `Rs. ${order.shipping_cost}`}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#121212] pt-1.5 border-t border-black/6">
              <span>Total</span>
              <span className="text-[#C5A059]">Rs. {Number(order.total_amount).toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Shipping Address */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: LUXURY_EASE }}
          className="bg-white border border-black/8 mb-6 px-6 py-5"
        >
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#121212] mb-4">
            <Truck className="w-4 h-4 text-[#C5A059]" />
            Shipping Details
          </div>
          <div className="space-y-2 text-sm text-black/60">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-black/30 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#121212]">{addr.name}</p>
                <p>{addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}</p>
                <p>{addr.city}{addr.province ? `, ${addr.province}` : ''}{addr.postalCode ? ` ${addr.postalCode}` : ''}</p>
                <p>{addr.country || 'Pakistan'}</p>
              </div>
            </div>
            {addr.phone && (
              <div className="flex items-center gap-2 text-black/50">
                <Phone className="w-3.5 h-3.5" />
                <span>{addr.phone}</span>
              </div>
            )}
            {addr.email && (
              <div className="flex items-center gap-2 text-black/50">
                <Mail className="w-3.5 h-3.5" />
                <span>{addr.email}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: LUXURY_EASE }}
          className="bg-[#C5A059]/8 border border-[#C5A059]/20 px-6 py-4 mb-8 text-sm text-[#7a6435]"
        >
          <p className="font-semibold uppercase tracking-wider text-xs mb-1">
            Payment: {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
          </p>
          {order.payment_method === 'cod' && (
            <p className="text-xs leading-relaxed opacity-80">
              Please keep the exact amount ready at the time of delivery. Our courier will collect payment upon handoff.
            </p>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center h-12 bg-[#121212] text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="flex-1 flex items-center justify-center h-12 border border-black/15 text-[#121212] text-[11px] font-semibold uppercase tracking-[0.2em] hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
          >
            My Account
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
