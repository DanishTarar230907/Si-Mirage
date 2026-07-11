'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Users, Ticket, Plus, CheckCircle, Clock, Truck, Package, Loader2 } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState<'orders' | 'customers' | 'discounts'>('orders');
  const [newCode, setNewCode] = useState('');
  const [newValue, setNewValue] = useState(15);
  const [newType, setNewType] = useState('percentage');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [{ data: ord }, { data: cust }, { data: disc }] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*'),
        supabase.from('discounts').select('*'),
      ]);
      setOrders(ord || []);
      setCustomers(cust || []);
      setDiscounts(disc || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    const { data } = await supabase.from('discounts').insert([{
      code: newCode.toUpperCase(), type: newType, value: Number(newValue),
      is_active: true, start_date: new Date().toISOString()
    }]).select().single();
    if (data) { setDiscounts(prev => [...prev, data]); setNewCode(''); }
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  const statusStyle: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border border-blue-200',
    shipped: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    delivered: 'bg-green-50 text-green-700 border border-green-200',
    cancelled: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#121212] font-sans pb-24">
      <section className="bg-[#121212] text-white py-16 px-8 border-b border-[#C5A059]/20">
        <div className="container mx-auto max-w-6xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Workspace Operations</span>
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-[0.1em] mt-3">STORE MANAGEMENT</h1>
          <p className="text-white/60 font-light mt-2 text-xs uppercase tracking-widest">Manage transactions, clientele, and promotional assets.</p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-6 mt-12">
        {/* Tabs */}
        <div className="flex border-b border-black/10 gap-8 mb-8">
          {(['orders', 'customers', 'discounts'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-[#C5A059] text-black' : 'border-transparent text-black/40 hover:text-black'}`}
            >
              {tab === 'orders' && <ShoppingBag className="w-4 h-4" />}
              {tab === 'customers' && <Users className="w-4 h-4" />}
              {tab === 'discounts' && <Ticket className="w-4 h-4" />}
              {tab} {tab === 'orders' && `(${orders.length})`} {tab === 'customers' && `(${customers.length})`} {tab === 'discounts' && `(${discounts.length})`}
            </button>
          ))}
        </div>

        {loading && <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C5A059]" /></div>}

        {/* ORDERS */}
        {!loading && activeTab === 'orders' && (
          <div>
            {/* Status filter */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {['all', ...STATUS_OPTIONS].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-colors ${filterStatus === s ? 'bg-[#121212] text-white border-[#121212]' : 'border-black/15 text-black/50 hover:text-black'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F5F5F3] border-b border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/60">
                    <th className="py-4 px-5">Order #</th>
                    <th className="py-4 px-5">Customer</th>
                    <th className="py-4 px-5">Total</th>
                    <th className="py-4 px-5">Payment</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-xs">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-[#FBFBFA] transition-colors">
                      <td className="py-4 px-5 font-mono font-medium">#{order.id?.slice(0, 8).toUpperCase()}</td>
                      <td className="py-4 px-5">
                        <div className="font-medium">{order.shipping_address?.name || '—'}</div>
                        <div className="text-[10px] text-black/40">{order.shipping_address?.phone || order.shipping_address?.email || ''}</div>
                      </td>
                      <td className="py-4 px-5 font-semibold">Rs. {Number(order.total_amount).toLocaleString()}</td>
                      <td className="py-4 px-5 uppercase text-black/50">{order.payment_method || 'cod'}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusStyle[order.status] || statusStyle.pending}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-black/40">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-5 text-right">
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value)}
                          className="text-[10px] border border-black/15 px-2 py-1 focus:outline-none focus:border-[#C5A059] bg-white"
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && <p className="text-center py-12 text-sm text-black/40">No orders found.</p>}
            </div>
          </div>
        )}

        {/* CUSTOMERS */}
        {!loading && activeTab === 'customers' && (
          <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F5F5F3] border-b border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/60">
                  <th className="py-4 px-5">Name</th>
                  <th className="py-4 px-5">Email</th>
                  <th className="py-4 px-5">Phone</th>
                  <th className="py-4 px-5">Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-[#FBFBFA]">
                    <td className="py-4 px-5 font-medium">{c.name}</td>
                    <td className="py-4 px-5 text-black/60">{c.email}</td>
                    <td className="py-4 px-5 text-black/50">{c.phone || '—'}</td>
                    <td className="py-4 px-5 text-black/40">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {customers.length === 0 && <p className="text-center py-12 text-sm text-black/40">No customers yet.</p>}
          </div>
        )}

        {/* DISCOUNTS */}
        {!loading && activeTab === 'discounts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white border border-black/5 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F5F5F3] border-b border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/60">
                    <th className="py-4 px-5">Code</th>
                    <th className="py-4 px-5">Value</th>
                    <th className="py-4 px-5">Type</th>
                    <th className="py-4 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-xs">
                  {discounts.map(d => (
                    <tr key={d.id} className="hover:bg-[#FBFBFA]">
                      <td className="py-4 px-5 font-mono font-bold tracking-widest">{d.code}</td>
                      <td className="py-4 px-5">{d.value}{d.type === 'percentage' ? '%' : ' Rs.'} OFF</td>
                      <td className="py-4 px-5 capitalize text-black/50">{d.type}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${d.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                          {d.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {discounts.length === 0 && <p className="text-center py-8 text-sm text-black/40">No codes yet.</p>}
            </div>
            <form onSubmit={handleAddDiscount} className="bg-white border border-black/5 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Ticket className="w-4 h-4 text-[#C5A059]" />Create Code</h3>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-black/60 mb-1.5 font-bold">Code</label>
                <input value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="SUMMER26" className="w-full border border-black/10 px-3 py-2.5 text-xs focus:outline-none focus:border-[#C5A059] font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-black/60 mb-1.5 font-bold">Value</label>
                  <input type="number" value={newValue} onChange={e => setNewValue(Number(e.target.value))} className="w-full border border-black/10 px-3 py-2.5 text-xs focus:outline-none focus:border-[#C5A059]" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-black/60 mb-1.5 font-bold">Type</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full border border-black/10 px-3 py-2.5 text-xs focus:outline-none focus:border-[#C5A059]">
                    <option value="percentage">Percentage %</option>
                    <option value="flat">Flat Rs.</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#121212] text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors">
                Generate Code
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
