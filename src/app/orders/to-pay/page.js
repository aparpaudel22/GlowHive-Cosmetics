'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';
import { IoIosCash } from 'react-icons/io';
import { useAuth } from '@/context/AuthContext';

const TO_PAY_STATUSES = ['placed', 'confirmed', 'shipped', 'out_for_delivery'];

const STATUS_LABEL = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
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

export default function ToPayPage() {
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
        o.paymentMethod === 'cod' && 
        TO_PAY_STATUSES.includes(o.status) &&
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
              gap: '12px',
            }}
            className="header-content"
            >
              <div style={{
                width: 'clamp(38px, 4vw, 44px)',
                height: 'clamp(38px, 4vw, 44px)',
                borderRadius: '50%',
                background: '#fdf8ef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <IoIosCash size={20} color="#c9a87c" />
              </div>
              <div>
                <h1 style={{
                  fontSize: 'clamp(18px, 2.2vw, 22px)',
                  fontWeight: 800,
                  color: '#1a0a0f',
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}>To Pay</h1>
                <p style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#888', marginTop: '2px' }}>Cash on delivery — pay when your order arrives</p>
              </div>
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
                background: '#fdf8ef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <IoIosCash size={28} color="#c9a87c" />
              </div>
              <h2 style={{
                fontSize: 'clamp(16px, 1.8vw, 18px)',
                fontWeight: 800,
                color: '#1a0a0f',
                marginBottom: '8px',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}>No pending payments</h2>
              <p style={{ fontSize: 'clamp(13px, 1.2vw, 14px)', color: '#888', marginBottom: '28px' }}>Cash on delivery orders waiting to be paid will appear here.</p>
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
                      background: 'linear-gradient(135deg,#fdf8ef,#fdf8f4)',
                      padding: 'clamp(12px, 1.2vw, 14px) clamp(16px, 1.8vw, 20px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #f9e4ea',
                    }}>
                      <div>
                        <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', color: '#888', marginBottom: '2px' }}>Order ID</div>
                        <div style={{ fontSize: 'clamp(13px, 1.3vw, 14px)', fontWeight: 800, color: '#1a0a0f' }} className="order-id">{order.id}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          fontSize: 'clamp(10px, 1vw, 11px)',
                          fontWeight: 700,
                          background: '#fef9ec',
                          color: '#92400e',
                          padding: 'clamp(2px, 0.3vw, 3px) clamp(8px, 1vw, 12px)',
                          borderRadius: '50px',
                        }}>
                          {STATUS_LABEL[order.status] || order.status}
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

                    <div style={{ padding: 'clamp(14px, 1.5vw, 16px) clamp(16px, 1.8vw, 20px)' }} className="order-items">
                      {(order.items || []).slice(0, 2).map((item, j) => (
                        <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(12px, 1.2vw, 13px)', marginBottom: '6px' }}>
                          <span style={{ color: '#555' }}>{item.name} <span style={{ fontWeight: 700 }}>× {item.quantity}</span></span>
                          <span style={{ fontWeight: 700, color: '#1a0a0f' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      {(order.items || []).length > 2 && (
                        <div style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', color: '#aaa', marginBottom: '6px' }}>+{order.items.length - 2} more items</div>
                      )}

                      <div style={{
                        background: '#fef9ec',
                        border: '1px solid #fde68a',
                        borderRadius: '12px',
                        padding: 'clamp(10px, 1vw, 12px) clamp(12px, 1.2vw, 16px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        margin: '12px 0',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <IoIosCash size={16} color="#92400e" />
                          <span style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', fontWeight: 600, color: '#92400e' }}>Amount due on delivery</span>
                        </div>
                        <span style={{ fontSize: 'clamp(14px, 1.4vw, 16px)', fontWeight: 800, color: '#92400e' }}>Rs. {(order.total || 0).toLocaleString()}</span>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 'clamp(11px, 1.1vw, 12px)',
                        color: '#888',
                        flexWrap: 'wrap',
                        gap: '4px',
                      }}>
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
          .order-card .order-items {
            padding: 12px !important;
          }
        }
      `}</style>
    </>
  );
}