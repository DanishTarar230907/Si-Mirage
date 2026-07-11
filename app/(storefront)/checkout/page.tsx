'use client';

// app/(storefront)/checkout/page.tsx
// Production checkout — COD-first with payment provider abstraction

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, ChevronDown, Truck, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import {
  CheckoutFormData,
  PAYMENT_PROVIDERS,
  SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
} from '@/types/orders';
import { LUXURY_EASE } from '@/lib/animations';

const inputClass =
  'w-full bg-white border border-black/15 px-4 py-3.5 text-sm text-[#121212] placeholder-black/30 focus:outline-none focus:border-[#C5A059] transition-colors duration-200';
const labelClass = 'block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/60 mb-1.5';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const subtotal = getTotalPrice();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const [form, setForm] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
    paymentMethod: 'cod',
    transactionId: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [summaryOpen, setSummaryOpen] = useState(false);

  const update = (field: keyof CheckoutFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Required';
    if (!form.lastName.trim()) newErrors.lastName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.length < 10) newErrors.phone = 'Valid phone required';
    if (!form.address1.trim()) newErrors.address1 = 'Required';
    if (!form.city.trim()) newErrors.city = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) return;

    setIsProcessing(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          variantName: i.variantName,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          sku: i.sku,
        })),
        shippingAddress: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          address1: form.address1,
          address2: form.address2,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
          country: 'Pakistan',
        },
        subtotal,
        shippingCost: shipping,
        discountApplied: 0,
        totalAmount: total,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error('Order failed');
      const { orderId } = await res.json();

      clearCart();
      router.push(`/order-confirmation/${orderId}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setIsProcessing(false);
      alert('There was an issue placing your order. Please try again.');
    }
  };

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-6 bg-[#FAF9F6]">
        <p className="text-xl font-light text-[#121212]">Your cart is empty.</p>
        <Link href="/shop" className="bg-[#121212] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Breadcrumb */}
      <div className="border-b border-black/6 bg-white">
        <div className="container mx-auto px-6 py-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-black/40">
          <Link href="/cart" className="hover:text-[#C5A059] transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-[#121212]">Checkout</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16 md:px-6">
        {/* Mobile order summary toggle */}
        <button
          onClick={() => setSummaryOpen((v) => !v)}
          className="flex items-center justify-between w-full bg-[#F0EDE6] border border-black/10 px-5 py-4 mb-6 md:hidden"
        >
          <div className="flex items-center gap-3 text-[#C5A059] text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            {summaryOpen ? 'Hide' : 'Show'} order summary
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#121212]">Rs. {total.toLocaleString()}</span>
            <motion.div animate={{ rotate: summaryOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-4 h-4 text-black/40" />
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {summaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden md:hidden mb-6"
            >
              <MobileOrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
          {/* LEFT: Form */}
          <div className="space-y-10">
            {/* Contact */}
            <section>
              <SectionHeader number={1} title="Contact Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="First name" className={`${inputClass} ${errors.firstName ? 'border-red-400' : ''}`} />
                  {errors.firstName && <FieldError>{errors.firstName}</FieldError>}
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Last name" className={`${inputClass} ${errors.lastName ? 'border-red-400' : ''}`} />
                  {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" className={`${inputClass} ${errors.email ? 'border-red-400' : ''}`} />
                  {errors.email && <FieldError>{errors.email}</FieldError>}
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="03XX-XXXXXXX" className={`${inputClass} ${errors.phone ? 'border-red-400' : ''}`} />
                  {errors.phone && <FieldError>{errors.phone}</FieldError>}
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <SectionHeader number={2} title="Shipping Address" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Address Line 1</label>
                  <input value={form.address1} onChange={e => update('address1', e.target.value)} placeholder="Street address, house number" className={`${inputClass} ${errors.address1 ? 'border-red-400' : ''}`} />
                  {errors.address1 && <FieldError>{errors.address1}</FieldError>}
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Address Line 2 <span className="text-black/30 normal-case font-normal">(optional)</span></label>
                  <input value={form.address2} onChange={e => update('address2', e.target.value)} placeholder="Apartment, suite, floor" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input value={form.city} onChange={e => update('city', e.target.value)} placeholder="City" className={`${inputClass} ${errors.city ? 'border-red-400' : ''}`} />
                  {errors.city && <FieldError>{errors.city}</FieldError>}
                </div>
                <div>
                  <label className={labelClass}>Province</label>
                  <input value={form.province} onChange={e => update('province', e.target.value)} placeholder="Province" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Postal Code <span className="text-black/30 normal-case font-normal">(optional)</span></label>
                  <input value={form.postalCode} onChange={e => update('postalCode', e.target.value)} placeholder="Postal code" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input value="Pakistan" readOnly className={`${inputClass} bg-black/5 cursor-not-allowed text-black/50`} />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <SectionHeader number={3} title="Payment Method" />
              <div className="space-y-3">
                {PAYMENT_PROVIDERS.map((provider) => (
                  <label
                    key={provider.id}
                    className={`flex items-start gap-4 border p-5 cursor-pointer transition-all duration-200 ${
                      form.paymentMethod === provider.id
                        ? 'border-[#C5A059] bg-[#C5A059]/4'
                        : provider.isAvailable
                        ? 'border-black/10 hover:border-black/25 bg-white'
                        : 'border-black/6 bg-black/2 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={provider.id}
                      checked={form.paymentMethod === provider.id}
                      onChange={() => provider.isAvailable && update('paymentMethod', provider.id)}
                      className="mt-0.5 accent-[#C5A059]"
                      disabled={!provider.isAvailable}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-[#121212]">{provider.name}</span>
                        {provider.badge && (
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                            provider.badgeColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                            provider.badgeColor === 'red' ? 'bg-red-100 text-red-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {provider.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-black/50 leading-relaxed">{provider.description}</p>
                    </div>
                    {form.paymentMethod === provider.id && (
                      <div className="w-5 h-5 rounded-full bg-[#C5A059] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </section>

            {/* Order Notes */}
            <section>
              <SectionHeader number={4} title="Order Notes" optional />
              <textarea
                value={form.notes}
                onChange={e => update('notes', e.target.value)}
                rows={3}
                placeholder="Special instructions for your order (optional)"
                className={`${inputClass} resize-none`}
              />
            </section>
          </div>

          {/* RIGHT: Order Summary (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <DesktopOrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />
              <SubmitButton isProcessing={isProcessing} total={total} />
              <TrustBadges />
            </div>
          </div>

          {/* Mobile Submit */}
          <div className="lg:hidden">
            <SubmitButton isProcessing={isProcessing} total={total} />
            <TrustBadges />
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function SectionHeader({ number, title, optional }: { number: number; title: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-7 h-7 rounded-full bg-[#121212] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {number}
      </span>
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#121212]">
        {title}
        {optional && <span className="ml-2 text-black/30 normal-case font-normal text-xs tracking-normal">(optional)</span>}
      </h2>
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="text-red-500 text-xs mt-1">{children}</p>;
}

function OrderItemRow({ item }: { item: any }) {
  return (
    <div className="flex gap-3 items-center">
      <div className="relative w-14 h-16 flex-shrink-0 bg-[#F0EDE6] border border-black/8">
        <Image src={item.image || '/images/20250201_233239.jpg'} alt={item.name} fill sizes="56px" className="object-cover" />
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#121212] text-white text-[9px] font-bold flex items-center justify-center">
          {item.quantity}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#121212] truncate">{item.name}</p>
        {item.variantName && <p className="text-[10px] text-black/40 truncate">{item.variantName}</p>}
      </div>
      <span className="text-xs font-semibold text-[#121212] flex-shrink-0">
        Rs. {(item.price * item.quantity).toLocaleString()}
      </span>
    </div>
  );
}

function DesktopOrderSummary({ items, subtotal, shipping, total }: any) {
  return (
    <div className="bg-white border border-black/8 p-6 mb-4">
      <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#121212] mb-5 pb-4 border-b border-black/6">
        Order Summary
      </h3>
      <div className="space-y-4 mb-5">
        {items.map((item: any) => <OrderItemRow key={item.id} item={item} />)}
      </div>
      <div className="border-t border-black/6 pt-4 space-y-2">
        <div className="flex justify-between text-xs text-black/50">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-black/50">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
            {shipping === 0 ? 'Complimentary' : `Rs. ${shipping}`}
          </span>
        </div>
        <div className="flex justify-between text-sm font-bold text-[#121212] pt-2 border-t border-black/6 mt-2">
          <span className="uppercase tracking-wider text-xs">Total</span>
          <span className="text-[#C5A059] text-base">Rs. {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function MobileOrderSummary({ items, subtotal, shipping, total }: any) {
  return (
    <div className="bg-white border border-black/8 p-5">
      <div className="space-y-3 mb-4">
        {items.map((item: any) => <OrderItemRow key={item.id} item={item} />)}
      </div>
      <div className="border-t border-black/6 pt-3 space-y-2 text-xs">
        <div className="flex justify-between text-black/50"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between text-black/50"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</span></div>
        <div className="flex justify-between font-bold text-[#121212] pt-2 border-t border-black/6"><span>Total</span><span className="text-[#C5A059]">Rs. {total.toLocaleString()}</span></div>
      </div>
    </div>
  );
}

function SubmitButton({ isProcessing, total }: { isProcessing: boolean; total: number }) {
  return (
    <button
      type="submit"
      disabled={isProcessing}
      className="w-full flex items-center justify-center gap-2 bg-[#121212] text-white h-14 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isProcessing ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
          Placing Order...
        </>
      ) : (
        <>
          <Lock className="w-4 h-4" />
          Place Order — Rs. {total.toLocaleString()}
        </>
      )}
    </button>
  );
}

function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-black/40 font-medium uppercase tracking-wider">
      <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Secure</div>
      <div className="w-px h-3 bg-black/10" />
      <div className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Nationwide Delivery</div>
      <div className="w-px h-3 bg-black/10" />
      <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> 30-Day Returns</div>
    </div>
  );
}
