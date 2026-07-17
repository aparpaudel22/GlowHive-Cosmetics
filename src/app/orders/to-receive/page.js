'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Package, Truck, MapPin, Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const TO_RECEIVE_STATUSES = ['shipped', 'out_for_delivery'];

// 5-step tracker
const STEPS = [
  { key: 'placed',           label: 'Placed'     },
  { key: 'confirmed',        label: 'Confirmed'  },
  { key: 'shipped',          label: 'Shipped'    },
  { key: 'out_for_delivery', label: 'On the Way' },
  { key: 'delivered',        label: 'Delivered'  },
];

function ProgressTracker({ status }) {
  const cur = STEPS.findIndex(s => s.key === status);
  const pct = Math.min((cur / (STEPS.length - 1)) * 100, 100);

  return (
    <div style={{ padding: '14px 0 6px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
        {/* Track */}
        <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', height: '2px', background: '#f9e4ea', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '14px', left: '14px', height: '2px', background: 'linear-gradient(90deg,#f43f68,#e11d50)', width: `calc(${pct}% * (100% - 28px) / 100%)`, zIndex: 1, transition: 'width 0.4s' }} />

        {STEPS.map((step, i) => {
          const done   = i <= cur;
          const active = i === cur;
          return (
            <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: i === 0 ? 'flex-start' : i === STEPS.length - 1 ? 'flex-end' : 'center', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: done ? 'linear-gradient(135deg,#f43f68,#e11d50)' : '#fff',
                border: `2px solid ${done ? '#f43f68' : '#f9e4ea'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: active ? '0 0 0 4px rgba(244,63,104,0.15)' : 'none',
                transition: 'all 0.3s',
              }}>
                {done
                  ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>✓</span>
                  : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f9e4ea' }} />}
              </div>
              <span style={{
                fontSize: '10px', fontWeight: active ? 800 : 600, marginTop: '6px', textAlign: 'center',
                color: active ? '#f43f68' : done ? '#1a0a0f' : '#ccc',
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

export default function ToReceivePage() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();
  const [orders,  setOrders]  = useState([]);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) { router.replace('/account'); return; }
    try {
      const all = JSON.parse(localStorage.getItem('glowhive_orders') || '[]');
      setOrders(all.filter(o => TO_RECEIVE_STATUSES.includes(o.status)));
    } catch (_) { setOrders([]); }
  }, [hydrated, isAuthenticated]);

  const deleteOrder = (id) => {
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
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#eef3fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={20} color="#5b8dd9" />
              </div>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a0a0f', fontFamily: "'Playfair Display', Georgia, serif" }}>To Receive</h1>
                <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Orders on their way to you</p>
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
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#eef3fd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Truck size={32} color="#5b8dd9" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a0a0f', marginBottom: '8px', fontFamily: "'Playfair Display', Georgia, serif" }}>Nothing on the way yet</h2>
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '28px' }}>Shipped orders will appear here so you can track them.</p>
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
                    <div style={{ background: 'linear-gradient(135deg,#eef3fd,#f5f8fe)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #dbeafe' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Order ID</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a0a0f' }}>{order.id}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 700, padding: '3px 12px', borderRadius: '50px',
                          background: order.status === 'out_for_delivery' ? '#d1fae5' : '#dbeafe',
                          color:      order.status === 'out_for_delivery' ? '#065f46' : '#1d4ed8',
                        }}>
                          {order.status === 'out_for_delivery' ? '🚚 Out for Delivery' : '📦 Shipped'}
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
                      {/* Progress tracker */}
                      <ProgressTracker status={order.status} />

                      <div style={{ height: '1px', background: '#f9e4ea', margin: '14px 0' }} />

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

                      {/* Delivery address */}
                      {order.address && (
                        <div style={{ background: '#fdf8f4', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '10px 0' }}>
                          <MapPin size={14} color="#f43f68" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '12px', color: '#555', lineHeight: 1.5 }}>
                            {order.address.address}, {order.address.city}, {order.address.province}
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                        <span>{new Date(order.date).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {order.estimatedDelivery && (
                          <span style={{ fontWeight: 600, color: '#5b8dd9' }}>Est. {order.estimatedDelivery}</span>
                        )}
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
