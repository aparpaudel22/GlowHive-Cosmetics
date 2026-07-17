'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';
import { IoIosCash } from 'react-icons/io';
import { useAuth } from '@/context/AuthContext';

// COD orders not yet delivered or cancelled
const TO_PAY_STATUSES = ['placed', 'confirmed', 'shipped', 'out_for_delivery'];

const STATUS_LABEL = {
  placed:           'Order Placed',
  confirmed:        'Confirmed',
  shipped:          'Shipped',
  out_for_delivery: 'Out for Delivery',
};

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,10,15,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '360px', width: '100%', boxShadow: '0 20px 60px rgba(244,63,104,0.15)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={20} color="#f43f68" />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a0a0f' }}>Delete Order?</h3>
        </div>
        <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, marginBottom: '22px' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '11px', background: '#fdf8f4', border: '1.5px solid #f9e4ea', borderRadius: '12px', fontWeight: 700, color: '#888', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg,#f43f68,#e11d50)', border: 'none', borderRadius: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontSize: '14px' }}>Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ToPayPage() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();
  const [orders,  setOrders]  = useState([]);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) { router.replace('/account'); return; }
    try {
      const all = JSON.parse(localStorage.getItem('glowhive_orders') || '[]');
      setOrders(all.filter(o => o.paymentMethod === 'cod' && TO_PAY_STATUSES.includes(o.status)));
    } catch (_) { setOrders([]); }
  }, [hydrated, isAuthenticated]);

  const deleteOrder = (id) => {
    // Remove from full orders list in localStorage, then update view
    const all     = JSON.parse(localStorage.getItem('glowhive_orders') || '[]');
    const updated = all.filter(o => o.id !== id);
    localStorage.setItem('glowhive_orders', JSON.stringify(updated));
    setOrders(prev => prev.filter(o => o.id !== id));
    setConfirm(null);
  };

  if (!hydrated) return (
    <div style={{ minHeight: '100vh', background: '#fdf8f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#f43f68', fontWeight: 600 }}>Loading…</p>
    </div>
  );

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#fdf8f4', fontFamily: "'Inter', sans-serif" }}>

        {/* Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f9e4ea', padding: '24px 28px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#f43f68', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginBottom: '14px' }}>
              <ArrowLeft size={15} /> Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fdf8ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IoIosCash size={24} color="#c9a87c" />
              </div>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a0a0f', fontFamily: "'Playfair Display', Georgia, serif" }}>To Pay</h1>
                <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Cash on delivery — pay when your order arrives</p>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '28px 20px' }}>
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: '#fff', borderRadius: '24px', border: '1px solid #f9e4ea', padding: '64px 40px', textAlign: 'center' }}
            >
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#fdf8ef', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <IoIosCash size={36} color="#c9a87c" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a0a0f', marginBottom: '8px', fontFamily: "'Playfair Display', Georgia, serif" }}>No pending payments</h2>
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '28px' }}>Cash on delivery orders waiting to be paid will appear here.</p>
              <button
                onClick={() => router.push('/products')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f43f68', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '9999px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
              >
                <ShoppingBag size={15} /> Shop Now
              </button>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <AnimatePresence mode="popLayout">
                {orders.map((order, i) => (
                  <motion.div
                    key={order.id} layout
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -60, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ background: '#fff', borderRadius: '20px', border: '1px solid #f9e4ea', overflow: 'hidden' }}
                  >
                    {/* Card header */}
                    <div style={{ background: 'linear-gradient(135deg,#fdf8ef,#fdf8f4)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f9e4ea' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Order ID</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a0a0f' }}>{order.id}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, background: '#fef9ec', color: '#92400e', padding: '3px 12px', borderRadius: '50px' }}>
                          {STATUS_LABEL[order.status] || order.status}
                        </span>
                        <button
                          onClick={() => setConfirm({ id: order.id })}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff0f0', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} color="#dc2626" />
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: '16px 20px' }}>
                      {/* Items */}
                      {(order.items || []).slice(0, 2).map((item, j) => (
                        <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                          <span style={{ color: '#555' }}>{item.name} <span style={{ fontWeight: 700 }}>× {item.quantity}</span></span>
                          <span style={{ fontWeight: 700, color: '#1a0a0f' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      {(order.items || []).length > 2 && (
                        <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>+{order.items.length - 2} more items</div>
                      )}

                      {/* Amount due */}
                      <div style={{ background: '#fef9ec', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <IoIosCash size={18} color="#92400e" />
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>Amount due on delivery</span>
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#92400e' }}>Rs. {(order.total || 0).toLocaleString()}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                        <span>{new Date(order.date).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {order.estimatedDelivery && <span>Est. {order.estimatedDelivery}</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            message="This order will be removed from your history permanently."
            onConfirm={() => deleteOrder(confirm.id)}
            onCancel={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
