'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Package, Truck, MapPin, Trash2, ShoppingBag, AlertTriangle, RefreshCw, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const TO_RECEIVE_STATUSES = ['shipped', 'out_for_delivery'];

const STEPS = [
  { key: 'placed', label: 'Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'On the Way' },
  { key: 'delivered', label: 'Delivered' },
];

function ProgressTracker({ status }) {
  const cur = STEPS.findIndex(s => s.key === status);
  const pct = Math.min((cur / (STEPS.length - 1)) * 100, 100);

  return (
    <div style={{ padding: 'clamp(10px, 1.2vh, 14px) 0 6px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', height: '2px', background: '#f9e4ea', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '14px', left: '14px', height: '2px', background: 'linear-gradient(90deg,#f43f68,#e11d50)', width: `calc(${pct}% * (100% - 28px) / 100%)`, zIndex: 1, transition: 'width 0.4s' }} />

        {STEPS.map((step, i) => {
          const done = i <= cur;
          const active = i === cur;
          return (
            <div key={step.key} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: i === 0 ? 'flex-start' : i === STEPS.length - 1 ? 'flex-end' : 'center',
              position: 'relative',
              zIndex: 2,
            }}
            className="tracking-step"
            >
              <div style={{
                width: 'clamp(24px, 2.5vw, 28px)',
                height: 'clamp(24px, 2.5vw, 28px)',
                borderRadius: '50%',
                background: done ? 'linear-gradient(135deg,#f43f68,#e11d50)' : '#fff',
                border: `2px solid ${done ? '#f43f68' : '#f9e4ea'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: active ? '0 0 0 4px rgba(244,63,104,0.15)' : 'none',
                transition: 'all 0.3s',
              }}
              className="tracking-icon"
              >
                {done
                  ? <span style={{ color: '#fff', fontSize: 'clamp(10px, 1vw, 11px)', fontWeight: 800 }}>✓</span>
                  : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f9e4ea' }} />}
              </div>
              <span style={{
                fontSize: 'clamp(9px, 0.9vw, 10px)',
                fontWeight: active ? 800 : 600,
                marginTop: '6px',
                textAlign: 'center',
                color: active ? '#f43f68' : done ? '#1a0a0f' : '#ccc',
              }}
              className="tracking-label"
              >
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
        style={{
          background: '#fff',
          borderRadius: 'clamp(16px, 1.8vw, 20px)',
          padding: 'clamp(20px, 2vw, 28px)',
          maxWidth: 'clamp(320px, 80vw, 360px)',
          width: '100%',
          boxShadow: '0 20px 60px rgba(244,63,104,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ width: 'clamp(38px, 4vw, 44px)', height: 'clamp(38px, 4vw, 44px)', borderRadius: '50%', background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={18} color="#f43f68" />
          </div>
          <h3 style={{ fontSize: 'clamp(14px, 1.4vw, 16px)', fontWeight: 800, color: '#1a0a0f' }}>Delete Order?</h3>
        </div>
        <p style={{ fontSize: 'clamp(13px, 1.2vw, 14px)', color: '#666', lineHeight: 1.6, marginBottom: '22px' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: 'clamp(10px, 1vw, 11px)', background: '#fdf8f4', border: '1.5px solid #f9e4ea', borderRadius: '12px', fontWeight: 700, color: '#888', cursor: 'pointer', fontSize: 'clamp(13px, 1.2vw, 14px)' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: 'clamp(10px, 1vw, 11px)', background: 'linear-gradient(135deg,#f43f68,#e11d50)', border: 'none', borderRadius: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontSize: 'clamp(13px, 1.2vw, 14px)' }}>Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ToReceivePage() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [confirm, setConfirm] = useState(null);

  const loadOrders = () => {
    try {
      let allOrders = JSON.parse(localStorage.getItem('glowhive_orders') || '[]');
      
      try {
        const userData = JSON.parse(localStorage.getItem('glowhive_user') || 'null');
        if (userData?.email) {
          const scopedKey = `glowhive_${encodeURIComponent(userData.email)}_orders`;
          const scopedOrders = localStorage.getItem(scopedKey);
          if (scopedOrders) {
            const parsedScoped = JSON.parse(scopedOrders);
            if (parsedScoped.length > 0) {
              allOrders = parsedScoped;
            }
          }
        }
      } catch (e) {}
      
      setOrders(allOrders.filter(o => 
        TO_RECEIVE_STATUSES.includes(o.status) &&
        o.status !== 'cancelled'
      ));
    } catch (_) { setOrders([]); }
  };

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) { router.replace('/account'); return; }
    loadOrders();
  }, [hydrated, isAuthenticated]);

  useEffect(() => {
    const handleUpdate = () => loadOrders();
    window.addEventListener('ordersUpdated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'glowhive_orders' || (e.key && e.key.includes('glowhive_') && e.key.includes('_orders'))) {
        loadOrders();
      }
    });
    return () => {
      window.removeEventListener('ordersUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const deleteOrder = (id) => {
    let allOrders = JSON.parse(localStorage.getItem('glowhive_orders') || '[]');
    
    try {
      const userData = JSON.parse(localStorage.getItem('glowhive_user') || 'null');
      if (userData?.email) {
        const scopedKey = `glowhive_${encodeURIComponent(userData.email)}_orders`;
        const scopedOrders = localStorage.getItem(scopedKey);
        if (scopedOrders) {
          allOrders = JSON.parse(scopedOrders);
        }
      }
    } catch (e) {}
    
    const updated = allOrders.filter(o => o.id !== id);
    
    localStorage.setItem('glowhive_orders', JSON.stringify(updated));
    
    try {
      const userData = JSON.parse(localStorage.getItem('glowhive_user') || 'null');
      if (userData?.email) {
        const scopedKey = `glowhive_${encodeURIComponent(userData.email)}_orders`;
        localStorage.setItem(scopedKey, JSON.stringify(updated));
      }
    } catch (e) {}
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ordersUpdated'));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'glowhive_orders',
        newValue: JSON.stringify(updated),
      }));
    }
    
    loadOrders();
    setConfirm(null);
  };

  if (!hydrated) return (
    <div style={{ minHeight: '100vh', background: '#fdf8f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#f43f68', fontWeight: 600, fontSize: 'clamp(14px, 1.3vw, 15px)' }}>Loading…</p>
    </div>
  );

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#fdf8f4', fontFamily: "'Inter', sans-serif" }}>

        <div style={{
          background: '#fff',
          borderBottom: '1px solid #f9e4ea',
          padding: 'clamp(16px, 2vh, 24px) clamp(16px, 3vw, 28px)',
        }}
        className="page-header"
        >
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <button onClick={() => router.back()} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#f43f68',
              fontSize: 'clamp(13px, 1.2vw, 14px)',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '14px',
            }}>
              <ArrowLeft size={14} /> Back
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
            className="header-content"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 'clamp(38px, 4vw, 44px)',
                  height: 'clamp(38px, 4vw, 44px)',
                  borderRadius: '50%',
                  background: '#eef3fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Package size={18} color="#5b8dd9" />
                </div>
                <div>
                  <h1 style={{
                    fontSize: 'clamp(18px, 2.2vw, 22px)',
                    fontWeight: 800,
                    color: '#1a0a0f',
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}>To Receive</h1>
                  <p style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#888', marginTop: '2px' }}>Orders on their way to you</p>
                </div>
              </div>
              
              <Link href="/returns" style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(4px, 0.5vw, 6px)',
                    padding: 'clamp(6px, 0.8vw, 8px) clamp(12px, 1.5vw, 16px)',
                    background: '#fef1f4',
                    border: '1px solid #fde8ec',
                    borderRadius: '50px',
                    fontSize: 'clamp(11px, 1.1vw, 12px)',
                    fontWeight: 700,
                    color: '#b76e79',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <RefreshCw size={12} />
                  Returns
                </motion.div>
              </Link>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', padding: 'clamp(16px, 2vw, 28px) clamp(12px, 2vw, 20px)' }}>
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: '#fff',
                borderRadius: 'clamp(20px, 2vw, 24px)',
                border: '1px solid #f9e4ea',
                padding: 'clamp(40px, 6vh, 64px) clamp(24px, 3vw, 40px)',
                textAlign: 'center',
              }}
            >
              <div style={{
                width: 'clamp(60px, 6vw, 72px)',
                height: 'clamp(60px, 6vw, 72px)',
                borderRadius: '50%',
                background: '#eef3fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Truck size={28} color="#5b8dd9" />
              </div>
              <h2 style={{
                fontSize: 'clamp(16px, 1.8vw, 18px)',
                fontWeight: 800,
                color: '#1a0a0f',
                marginBottom: '8px',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}>Nothing on the way yet</h2>
              <p style={{ fontSize: 'clamp(13px, 1.2vw, 14px)', color: '#888', marginBottom: '28px' }}>Shipped orders will appear here so you can track them.</p>
              <button
                onClick={() => router.push('/products')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f43f68',
                  color: '#fff',
                  border: 'none',
                  padding: 'clamp(10px, 1.5vh, 12px) clamp(20px, 3vw, 28px)',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: 'clamp(13px, 1.3vw, 14px)',
                  cursor: 'pointer',
                }}
              >
                <ShoppingBag size={14} /> Shop Now
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
                    style={{
                      background: '#fff',
                      borderRadius: 'clamp(16px, 1.8vw, 20px)',
                      border: '1px solid #f9e4ea',
                      overflow: 'hidden',
                    }}
                    className="order-card"
                  >
                    <div style={{
                      background: 'linear-gradient(135deg,#eef3fd,#f5f8fe)',
                      padding: 'clamp(12px, 1.2vw, 14px) clamp(16px, 1.8vw, 20px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #dbeafe',
                    }}>
                      <div>
                        <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', color: '#888', marginBottom: '2px' }}>Order ID</div>
                        <div style={{ fontSize: 'clamp(13px, 1.3vw, 14px)', fontWeight: 800, color: '#1a0a0f' }} className="order-id">{order.id}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          fontSize: 'clamp(10px, 1vw, 11px)',
                          fontWeight: 700,
                          padding: 'clamp(2px, 0.3vw, 3px) clamp(8px, 1vw, 12px)',
                          borderRadius: '50px',
                          background: order.status === 'out_for_delivery' ? '#d1fae5' : '#dbeafe',
                          color: order.status === 'out_for_delivery' ? '#065f46' : '#1d4ed8',
                        }}>
                          {order.status === 'out_for_delivery' ? '🚚 Out for Delivery' : '📦 Shipped'}
                        </span>
                        <button
                          onClick={() => setConfirm({ id: order.id })}
                          style={{
                            width: 'clamp(28px, 3vw, 32px)',
                            height: 'clamp(28px, 3vw, 32px)',
                            borderRadius: '50%',
                            background: '#fff0f0',
                            border: '1px solid #fecaca',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={12} color="#dc2626" />
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: 'clamp(14px, 1.5vw, 16px) clamp(16px, 1.8vw, 20px)' }}>
                      <ProgressTracker status={order.status} />

                      <div style={{ height: '1px', background: '#f9e4ea', margin: '14px 0' }} />

                      <div className="order-items">
                        {(order.items || []).slice(0, 2).map((item, j) => (
                          <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(12px, 1.2vw, 13px)', marginBottom: '6px' }}>
                            <span style={{ color: '#555' }}>{item.name} <span style={{ fontWeight: 700 }}>× {item.quantity}</span></span>
                            <span style={{ fontWeight: 700, color: '#1a0a0f' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                        {(order.items || []).length > 2 && (
                          <div style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', color: '#aaa', marginBottom: '6px' }}>+{order.items.length - 2} more items</div>
                        )}
                      </div>

                      {order.address && (
                        <div style={{
                          background: '#fdf8f4',
                          borderRadius: '12px',
                          padding: 'clamp(8px, 0.8vw, 10px) clamp(12px, 1.2vw, 14px)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          margin: '10px 0',
                        }}>
                          <MapPin size={12} color="#f43f68" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', color: '#555', lineHeight: 1.5 }}>
                            {order.address.address}, {order.address.city}, {order.address.province}
                          </span>
                        </div>
                      )}

                      <div style={{
                        display: 'flex',
                        gap: 'clamp(6px, 0.8vw, 8px)',
                        marginTop: '12px',
                        marginBottom: '8px',
                      }}
                      className="order-actions"
                      >
                        <Link href={`/orders`} style={{
                          flex: 1,
                          textAlign: 'center',
                          fontSize: 'clamp(11px, 1.1vw, 12px)',
                          fontWeight: 700,
                          color: '#b76e79',
                          textDecoration: 'none',
                          background: '#fdf0f3',
                          border: '1px solid #fde8ec',
                          borderRadius: '50px',
                          padding: 'clamp(8px, 0.8vw, 9px) clamp(10px, 1vw, 12px)',
                        }}>
                          <FileText size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          View Order
                        </Link>

                        <Link href={`/returns`} style={{
                          flex: 1,
                          textAlign: 'center',
                          fontSize: 'clamp(11px, 1.1vw, 12px)',
                          fontWeight: 700,
                          color: '#f43f68',
                          textDecoration: 'none',
                          background: '#fff',
                          border: '1px solid #fecaca',
                          borderRadius: '50px',
                          padding: 'clamp(8px, 0.8vw, 9px) clamp(10px, 1vw, 12px)',
                        }}>
                          <RefreshCw size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          Request Return
                        </Link>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 'clamp(11px, 1.1vw, 12px)',
                        color: '#888',
                        marginTop: '4px',
                        flexWrap: 'wrap',
                        gap: '4px',
                      }}>
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

      <style jsx>{`
        @media (max-width: 480px) {
          .page-header .header-content {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .order-card .order-id {
            font-size: 12px !important;
          }
          .order-actions {
            flex-direction: column !important;
          }
          .order-actions a {
            width: 100% !important;
          }
          .tracking-step .tracking-icon {
            width: 24px !important;
            height: 24px !important;
          }
          .tracking-step .tracking-label {
            font-size: 8px !important;
          }
        }
      `}</style>
    </>
  );
}