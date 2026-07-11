'use client';

// components/layout/CartDrawer.tsx
// Premium slide-in cart drawer — primary shopping interaction

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '@/types/orders';
import { LUXURY_EASE } from '@/lib/animations';

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  const subtotal = getTotalPrice();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const itemCount = getTotalItems();

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isCartOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            key="cart-drawer"
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: LUXURY_EASE }}
            className="fixed right-0 top-0 z-[80] h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/8">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#121212]">
                  Your Bag
                </h2>
                {itemCount > 0 && (
                  <span className="bg-[#121212] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-black/40 hover:text-black transition-colors rounded-sm hover:bg-black/5"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-black/30" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#121212] mb-2">
                      Your bag is empty
                    </p>
                    <p className="text-sm text-black/50 leading-relaxed">
                      Discover our curated collection of premium eyewear.
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="px-8 py-3 bg-[#121212] text-white text-[11px] font-semibold uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  <ul className="divide-y divide-black/6 px-4">
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="flex gap-4 py-5"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-24 flex-shrink-0 bg-[#F5F4F0] overflow-hidden">
                          <Image
                            src={item.image || '/images/20250201_233239.jpg'}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover object-center"
                          />
                        </div>

                        {/* Item Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#121212] truncate pr-2">
                                {item.name}
                              </p>
                              {item.variantName && (
                                <p className="text-[11px] text-black/50 mt-0.5 truncate">
                                  {item.variantName}
                                </p>
                              )}
                              {item.sku && (
                                <p className="text-[10px] text-black/30 font-mono mt-0.5">
                                  SKU: {item.sku}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-black/30 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-black/15 bg-white">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-black/50 hover:text-black hover:bg-black/5 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-[#121212]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-black/50 hover:text-black hover:bg-black/5 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Line Price */}
                            <p className="text-sm font-semibold text-[#121212]">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </AnimatePresence>
              )}
            </div>

            {/* Footer — only show when items exist */}
            {items.length > 0 && (
              <div className="border-t border-black/8 px-6 py-5 space-y-4 bg-white">
                {/* Shipping notice */}
                {shipping === 0 ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 text-xs font-medium">
                    <Truck className="w-3.5 h-3.5" />
                    You qualify for complimentary shipping!
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-black/50 text-xs">
                    <Truck className="w-3.5 h-3.5" />
                    Add Rs. {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-black/60">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-black/60">
                    <span>Estimated Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[#121212] pt-2 border-t border-black/8">
                    <span className="uppercase tracking-wider text-xs font-bold">Total</span>
                    <span className="text-[#C5A059]">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-1">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full flex items-center justify-center gap-2 bg-[#121212] text-white h-12 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-colors"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={closeCart}
                    className="w-full h-10 text-[11px] font-medium uppercase tracking-wider text-black/50 hover:text-black transition-colors border border-black/10 hover:border-black/30"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
