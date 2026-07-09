'use client';

import { useState } from 'react';
import { useCmsData, useAdminContext } from '@/components/admin/AdminContext';
import { ShoppingBag, Users, Ticket, Plus, CheckCircle, Clock, Truck, ShieldAlert } from 'lucide-react';

export default function AdminOrdersPage() {
  const { cmsData } = useCmsData();
  const { updateCmsData, addCmsItem } = useAdminContext();
  const [activeTab, setActiveTab] = useState<'orders' | 'customers' | 'discounts'>('orders');

  // Local states for adding a discount code
  const [newCode, setNewCode] = useState('');
  const [newValue, setNewValue] = useState(15);
  const [newType, setNewType] = useState('Percentage');

  const handleUpdateOrderStatus = (orderId: any, newStatus: string) => {
    const idx = cmsData.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return;
    const arr = [...cmsData.orders];
    arr[idx] = { ...arr[idx], status: newStatus };
    updateCmsData('orders', arr);
  };

  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    const item = {
      id: Date.now(),
      code: newCode.toUpperCase(),
      type: newType,
      value: Number(newValue),
      active: true
    };
    addCmsItem('discounts', item);
    setNewCode('');
    alert(`Discount code ${newCode.toUpperCase()} added successfully!`);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#121212] font-sans pb-24">
      {/* Header Banner */}
      <section className="bg-[#121212] text-white py-16 px-8 border-b border-[#C5A059]/20">
        <div className="container mx-auto max-w-6xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Workspace Operations</span>
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-[0.1em] mt-3">STORE MANAGEMENT</h1>
          <p className="text-white/60 font-light mt-2 text-xs uppercase tracking-widest">Manage your transactions, clientele, and promotional assets.</p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="container mx-auto max-w-6xl px-6 mt-12">
        <div className="flex border-b border-black/10 gap-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeTab === 'orders' ? 'border-[#C5A059] text-black' : 'border-transparent text-black/40 hover:text-black'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Orders ({cmsData.orders.length})
          </button>
          
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeTab === 'customers' ? 'border-[#C5A059] text-black' : 'border-transparent text-black/40 hover:text-black'
            }`}
          >
            <Users className="w-4 h-4" /> Customers ({cmsData.customers.length})
          </button>
          
          <button
            onClick={() => setActiveTab('discounts')}
            className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeTab === 'discounts' ? 'border-[#C5A059] text-black' : 'border-transparent text-black/40 hover:text-black'
            }`}
          >
            <Ticket className="w-4 h-4" /> Promo Codes ({cmsData.discounts.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F3] border-b border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/60">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Item</th>
                    <th className="py-4 px-6">Total Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-light">
                  {cmsData.orders.map((order) => (
                    <tr key={order.id} className="border-b border-black/5 hover:bg-[#FBFBFA] transition-colors">
                      <td className="py-4 px-6 font-mono font-medium">#{order.id}</td>
                      <td className="py-4 px-6">
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-[10px] text-black/40 mt-0.5">{order.email}</div>
                      </td>
                      <td className="py-4 px-6">{order.item}</td>
                      <td className="py-4 px-6 font-medium">PKR {order.amount.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          order.status === 'Paid' ? 'bg-green-50 text-green-700 border border-green-200' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}>
                          {order.status === 'Paid' && <CheckCircle className="w-3 h-3" />}
                          {order.status === 'Shipped' && <Truck className="w-3 h-3" />}
                          {order.status === 'Pending' && <Clock className="w-3 h-3" />}
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-1.5">
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'Paid')}
                          className="px-2 py-1 text-[9px] uppercase tracking-wider font-bold bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}
                          className="px-2 py-1 text-[9px] uppercase tracking-wider font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                        >
                          Ship Item
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F3] border-b border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/60">
                    <th className="py-4 px-6">Client Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Tier</th>
                    <th className="py-4 px-6">Total Orders</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-light">
                  {cmsData.customers.map((c) => (
                    <tr key={c.id} className="border-b border-black/5 hover:bg-[#FBFBFA] transition-colors">
                      <td className="py-4 px-6 font-medium">{c.name}</td>
                      <td className="py-4 px-6 text-black/60">{c.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-widest uppercase ${
                          c.tier === 'VIP' ? 'bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059]' : 'bg-black/5 text-black/60'
                        }`}>
                          {c.tier}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium">{c.orders}</td>
                      <td className="py-4 px-6 text-green-600 font-medium">Active Client</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* DISCOUNTS TAB */}
          {activeTab === 'discounts' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Discount Codes Grid */}
              <div className="lg:col-span-2 bg-white border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F5F5F3] border-b border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/60">
                      <th className="py-4 px-6">Promo Code</th>
                      <th className="py-4 px-6">Discount Value</th>
                      <th className="py-4 px-6">Type</th>
                      <th className="py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-light">
                    {cmsData.discounts.map((d) => (
                      <tr key={d.id} className="border-b border-black/5 hover:bg-[#FBFBFA] transition-colors">
                        <td className="py-4 px-6 font-mono font-bold tracking-widest">{d.code}</td>
                        <td className="py-4 px-6 font-medium">
                          {d.value}{d.type === 'Percentage' ? '%' : ' PKR'} OFF
                        </td>
                        <td className="py-4 px-6 text-black/60">{d.type}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-widest uppercase ${
                            d.active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {d.active ? 'Active' : 'Expired'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Discount Form */}
              <div className="bg-white border border-black/5 shadow-sm p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4 flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-[#C5A059]" /> Create Promo Discount
                </h3>
                <form onSubmit={handleAddDiscount} className="space-y-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-black/60 mb-1.5 font-bold">Code String</label>
                    <input
                      type="text"
                      placeholder="E.G. SUMMER26"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="w-full bg-[#F9F9F9] border border-black/10 focus:border-[#C5A059] px-3.5 py-2.5 text-xs text-black outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-black/60 mb-1.5 font-bold">Discount Value</label>
                      <input
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(Number(e.target.value))}
                        className="w-full bg-[#F9F9F9] border border-black/10 focus:border-[#C5A059] px-3.5 py-2.5 text-xs text-black outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-black/60 mb-1.5 font-bold">Type</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full bg-[#F9F9F9] border border-black/10 focus:border-[#C5A059] px-3 py-2.5 text-xs text-black outline-none font-medium"
                      >
                        <option value="Percentage">Percentage %</option>
                        <option value="Flat">Flat PKR</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#121212] hover:bg-[#C5A059] text-white hover:text-black font-bold text-[10px] uppercase tracking-widest py-3 transition-colors"
                  >
                    Generate Discount Code
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
