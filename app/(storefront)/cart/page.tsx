'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
  const [items, setItems] = useState([
    { id: 1, name: 'Si Mirage Model 1', price: 4999, quantity: 1, image: '1' },
    { id: 2, name: 'Si Mirage Model 4', price: 5999, quantity: 2, image: '4' },
  ]);

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 250; // Standard shipping
  const total = subtotal + (items.length > 0 ? shipping : 0);

  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <h1 className="text-3xl md:text-5xl font-light mb-12 uppercase tracking-widest">Your <span className="font-bold">Cart</span></h1>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-white/10 bg-surface">
          <p className="text-foreground/60 mb-8 text-lg">Your cart is currently empty.</p>
          <Link href="/shop" className="bg-primary text-background px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50, height: 0 }}
                  className="flex gap-6 p-4 border border-white/10 bg-surface overflow-hidden"
                >
                  <div className="relative w-24 h-32 flex-shrink-0 bg-background">
                    <Image
                      src={`https://placehold.co/200x260/111111/C0A062?text=Item+${item.image}+[Drive]`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-col flex-grow justify-between py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        <p className="text-foreground/60 text-sm mt-1">Color: Midnight Black</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-foreground/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-white/20 px-2 h-10 w-28 justify-between">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-foreground/60 hover:text-primary transition-colors p-1">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-foreground/60 hover:text-primary transition-colors p-1">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-medium text-lg">Rs. {item.price * item.quantity}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-white/10 p-8 sticky top-28">
              <h2 className="text-xl font-medium mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Subtotal</span>
                  <span className="font-medium">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Shipping</span>
                  <span className="font-medium">Rs. {shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Discount</span>
                  <span className="font-medium text-primary">Rs. 0</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold uppercase tracking-wider">Total</span>
                  <span className="text-2xl font-bold text-primary">Rs. {total}</span>
                </div>
              </div>

              <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-primary text-background h-14 uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
