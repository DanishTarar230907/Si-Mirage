'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<'easypaisa' | 'jazzcash' | 'cod'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-6 py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-8"
        >
          <ShieldCheck className="w-12 h-12 text-background" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-light mb-4 uppercase tracking-widest">Order <span className="font-bold">Confirmed</span></h1>
        <p className="text-foreground/60 max-w-md mx-auto mb-10">
          Thank you for choosing Si Mirage. Your cinematic eyewear is being prepared for dispatch. We have sent an email confirmation with your order details.
        </p>
        <Link href="/shop" className="bg-primary text-background px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-light mb-12 uppercase tracking-widest">Secure <span className="font-bold">Checkout</span></h1>
      
      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Checkout Form */}
        <div className="flex flex-col gap-10">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-medium tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-background flex items-center justify-center text-xs font-bold">1</span>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <input type="email" placeholder="Email Address" required className="bg-background border border-white/10 p-4 focus:outline-none focus:border-primary transition-colors" />
              <input type="tel" placeholder="Phone Number (03XXXXXXXXX)" required className="bg-background border border-white/10 p-4 focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h2 className="text-lg font-medium tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-background flex items-center justify-center text-xs font-bold">2</span>
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" required className="bg-background border border-white/10 p-4 focus:outline-none focus:border-primary transition-colors" />
              <input type="text" placeholder="Last Name" required className="bg-background border border-white/10 p-4 focus:outline-none focus:border-primary transition-colors" />
              <input type="text" placeholder="Address Line 1" required className="col-span-1 md:col-span-2 bg-background border border-white/10 p-4 focus:outline-none focus:border-primary transition-colors" />
              <input type="text" placeholder="City" required className="bg-background border border-white/10 p-4 focus:outline-none focus:border-primary transition-colors" />
              <input type="text" placeholder="Postal Code" className="bg-background border border-white/10 p-4 focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-lg font-medium tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-background flex items-center justify-center text-xs font-bold">3</span>
              Payment Method
            </h2>
            <div className="flex flex-col gap-4">
              {/* COD */}
              <label className={`cursor-pointer border p-6 flex flex-col gap-2 transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/30'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="font-medium tracking-wider uppercase">Cash on Delivery</span>
                  </div>
                </div>
                {paymentMethod === 'cod' && (
                  <p className="text-sm text-foreground/60 ml-7 mt-2">Pay in cash when your order is delivered to your doorstep.</p>
                )}
              </label>

              {/* Easypaisa */}
              <label className={`cursor-pointer border p-6 flex flex-col gap-2 transition-colors ${paymentMethod === 'easypaisa' ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/30'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'easypaisa'} 
                      onChange={() => setPaymentMethod('easypaisa')}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="font-medium tracking-wider uppercase">Easypaisa</span>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1">Supported</span>
                </div>
                {paymentMethod === 'easypaisa' && (
                  <div className="ml-7 mt-4 flex flex-col gap-3">
                    <p className="text-sm text-foreground/60">Please transfer the total amount to the following Easypaisa account and provide the transaction ID below.</p>
                    <p className="text-sm font-bold">Account: 0300-XXXXXXX (Si Mirage)</p>
                    <input type="text" placeholder="Transaction ID / TID" required={paymentMethod === 'easypaisa'} className="bg-background border border-white/10 p-3 mt-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                )}
              </label>

              {/* JazzCash */}
              <label className={`cursor-pointer border p-6 flex flex-col gap-2 transition-colors ${paymentMethod === 'jazzcash' ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/30'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'jazzcash'} 
                      onChange={() => setPaymentMethod('jazzcash')}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="font-medium tracking-wider uppercase">JazzCash</span>
                  </div>
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1">Supported</span>
                </div>
                {paymentMethod === 'jazzcash' && (
                  <div className="ml-7 mt-4 flex flex-col gap-3">
                    <p className="text-sm text-foreground/60">Please transfer the total amount to the following JazzCash account and provide the transaction ID below.</p>
                    <p className="text-sm font-bold">Account: 0300-XXXXXXX (Si Mirage)</p>
                    <input type="text" placeholder="Transaction ID / TID" required={paymentMethod === 'jazzcash'} className="bg-background border border-white/10 p-3 mt-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                )}
              </label>
            </div>
          </div>
          
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="bg-surface border border-white/10 p-8 sticky top-28">
            <h2 className="text-xl font-medium mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Your Order</h2>
            
            {/* Items */}
            <div className="flex flex-col gap-4 mb-8">
              {[1, 4].map((id) => (
                <div key={id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-20 bg-background flex-shrink-0">
                    <Image src={`https://placehold.co/100x120/111111/C0A062?text=Item+${id}`} alt={`Model ${id}`} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm">Si Mirage Model {id}</h4>
                    <p className="text-foreground/60 text-xs">Qty: 1</p>
                  </div>
                  <span className="font-medium text-sm">Rs. {id === 1 ? 4999 : 5999}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 mb-6 pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Subtotal</span>
                <span className="font-medium">Rs. 10998</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Shipping</span>
                <span className="font-medium">Rs. 250</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold uppercase tracking-wider">Total</span>
                <span className="text-2xl font-bold text-primary">Rs. 11248</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-primary text-background h-14 uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Place Order - Rs. 11248`}
              {!isProcessing && <Lock className="w-4 h-4 ml-2" />}
            </button>
            <p className="text-xs text-foreground/40 text-center mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Encrypted & Secure Checkout
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}
