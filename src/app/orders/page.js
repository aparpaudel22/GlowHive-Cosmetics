'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronRight, XCircle, CheckCircle, Truck, AlertCircle, Sparkles, Trash2 } from 'lucide-react';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const TRACKING_STEPS = [
  { key: 'placed', label: 'Placed', icon: '🛍️' },
  { key: 'picked', label: 'Picked', icon: '📦' },
  { key: 'packing', label: 'Packing', icon: '🎀' },
  { key: 'shipped', label: 'Shipped', icon: '🚚' },
  { key: 'delivered', label: 'Delivered', icon: '🏡' },
];

const STEP_IDX = { placed: 0, picked: 1, packing: 2, shipped: 3, delivered: 4 };

const STATUS_STYLE = {
  placed: { bg: '#fdf6f0', color: '#b76e79', label: 'Order Placed' },
  picked: { bg: '#fef9ec', color: '#d97706', label: 'Being Picked' },
  packing: { bg: '#fef9ec', color: '#d97706', label: 'Packing' },
  shipped: { bg: '#eff6ff', color: '#3b82f6', label: 'Shipped' },
  delivered: { bg: '#f0fdf4', color: '#22c55e', label: 'Delivered' },
  cancelled: { bg: '#fef2f2', color: '#ef4444', label: 'Cancelled' },
};

const CANCEL_REASONS = [
  'Changed my mind',
  'Found a better price elsewhere',
  'Ordered by mistake',
  'Wrong item / wrong size',
  'Delivery time is too long',
  'Other',
];

const REFUND_INFO = {
  cod: { label: 'Cash on Delivery', icon: '💵', method: 'No payment was taken — nothing to refund.', time: 'N/A' },
  esewa: { label: 'eSewa Wallet', icon: '🟢', method: 'Refund will be credited to your eSewa wallet.', time: '1–3 business days' },
  khalti: { label: 'Khalti Wallet', icon: '🟣', method: 'Refund will be credited to your Khalti wallet.', time: '1–3 business days' },
  bank: { label: 'Bank Transfer', icon: '🏦', method: 'Refund will be sent to your registered bank account.', time: '3–5 business days' },
};

const STATUS_FILTERS = [
  { key: 'all', label: 'All Orders' },
  { key: 'placed', label: 'Placed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelOther, setCancelOther] = useState('');
  const [cancelStep, setCancelStep] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = () => {
    try {
      let stored = null;
      
      // First try to get user-specific orders
      try {
        const userData = JSON.parse(localStorage.getItem('glowhive_user') || 'null');
        if (userData?.email) {
          const scopedKey = `glowhive_${encodeURIComponent(userData.email)}_orders`;
          stored = localStorage.getItem(scopedKey);
        }
      } catch (e) {}
      
      // If no user-specific orders, try generic
      if (!stored) {
        stored = localStorage.getItem('glowhive_orders');
      }
      
      if (stored) {
        const parsed = JSON.parse(stored);
        const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sorted);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  useEffect(() => {
    const handleOrderUpdate = () => loadOrders();
    window.addEventListener('ordersUpdated', handleOrderUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'glowhive_orders' || (e.key && e.key.includes('glowhive_') && e.key.includes('_orders'))) {
        loadOrders();
      }
    });
    window.addEventListener('userLoggedIn', handleOrderUpdate);
    window.addEventListener('userLoggedOut', handleOrderUpdate);
    return () => {
      window.removeEventListener('ordersUpdated', handleOrderUpdate);
      window.removeEventListener('userLoggedIn', handleOrderUpdate);
      window.removeEventListener('userLoggedOut', handleOrderUpdate);
    };
  }, []);

  if (!isLoading && !isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#fdf6f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(30px, 5vh, 40px) clamp(16px, 3vw, 20px)' }}>
        <div style={{ fontSize: 'clamp(40px, 5vw, 48px)', marginBottom: '20px' }}>🔒</div>
        <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '10px' }}>Please Sign In</h2>
        <p style={{ fontSize: 'clamp(13px, 1.2vw, 14px)', color: '#8c6468', marginBottom: '24px' }}>You need to be logged in to view your orders.</p>
        <Link href="/auth" style={{ background: 'linear-gradient(135deg,#b76e79,#c2748a)', color: '#fff', padding: 'clamp(10px, 1.5vh, 12px) clamp(24px, 3vw, 32px)', borderRadius: '50px', textDecoration: 'none', fontWeight: 700, fontSize: 'clamp(13px, 1.3vw, 14px)' }}>
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fdf6f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#b76e79', fontWeight: 600, fontSize: 'clamp(14px, 1.3vw, 15px)' }}>Loading your orders...</p>
      </div>
    );
  }

  const openCancel = (order) => { setCancelTarget(order); setCancelReason(''); setCancelOther(''); setCancelStep(1); };
  const closeCancel = () => { setCancelTarget(null); setCancelReason(''); setCancelOther(''); setCancelStep(1); };

  const confirmCancel = () => {
    const finalReason = cancelReason === 'Other' ? cancelOther.trim() : cancelReason;
    if (!finalReason) return;
    
    const updated = orders.map(o =>
      o.id === cancelTarget.id
        ? {
            ...o,
            status: 'cancelled',
            cancelReason: finalReason,
            cancelledAt: new Date().toISOString(),
            statusHistory: [
              ...(o.statusHistory || []),
              { status: 'cancelled', label: 'Order Cancelled', time: new Date().toISOString(), reason: finalReason },
            ],
          }
        : o
    );
    
    setOrders(updated);
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
    
    setCancelStep(3);
  };

  const confirmDelete = () => {
    const updated = orders.filter(o => o.id !== deleteTarget.id);
    
    setOrders(updated);
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
    
    setDeleteTarget(null);
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#fdf6f0', paddingBottom: '60px' }}>

        <div style={{
          background: 'linear-gradient(135deg, #3d1f25 0%, #b76e79 60%, #e8a4b0 100%)',
          padding: 'clamp(40px, 6vh, 60px) clamp(16px, 3vw, 28px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="orders-hero"
        >
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={16} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: 'clamp(10px, 1vw, 12px)', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: 'clamp(2px, 0.3vw, 3px)', textTransform: 'uppercase' }}>
                Order History
              </span>
              <Sparkles size={16} color="rgba(255,255,255,0.8)" />
            </div>
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 44px)',
              fontWeight: 800, color: '#fff',
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: '12px',
            }}>
              My Orders
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 1.3vw, 16px)',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '480px',
              margin: '0 auto',
            }}>
              Track, manage and review all your GlowHive purchases in one place.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(16px, 2vw, 32px)',
              marginTop: '28px',
              flexWrap: 'wrap',
            }}
            className="orders-stats"
            >
              {[
                { value: orders.length, label: 'Total Orders' },
                { value: orders.filter(o => o.status !== 'cancelled').length, label: 'Active Orders' },
                { value: orders.filter(o => o.status === 'delivered').length, label: 'Delivered' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 'clamp(9px, 0.9vw, 11px)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 clamp(12px, 2vw, 16px)' }}>
          <div style={{
            display: 'flex',
            gap: 'clamp(6px, 0.8vw, 8px)',
            overflowX: 'auto',
            padding: 'clamp(16px, 2vh, 20px) 0 16px',
            scrollbarWidth: 'none',
          }}>
            {STATUS_FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilterStatus(f.key)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: 'clamp(6px, 0.8vw, 8px) clamp(12px, 1.5vw, 16px)',
                  borderRadius: '50px',
                  fontSize: 'clamp(11px, 1.1vw, 12px)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: `1.5px solid ${filterStatus === f.key ? '#b76e79' : '#fde8ec'}`,
                  background: filterStatus === f.key ? '#b76e79' : '#fff',
                  color: filterStatus === f.key ? '#fff' : '#3d1f25',
                  transition: 'all 0.2s',
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'clamp(40px, 6vh, 60px) 20px' }}>
              <div style={{ fontSize: 'clamp(40px, 5vw, 48px)', marginBottom: '14px' }}>📦</div>
              <p style={{ fontSize: 'clamp(14px, 1.3vw, 16px)', fontWeight: 700, color: '#3d1f25', marginBottom: '8px' }}>No orders here yet</p>
              <p style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#8c6468', marginBottom: '24px' }}>Time to discover something beautiful 🌸</p>
              <Link href="/products" style={{ background: 'linear-gradient(135deg,#b76e79,#c2748a)', color: '#fff', padding: 'clamp(10px, 1.5vh, 12px) clamp(20px, 3vw, 28px)', borderRadius: '50px', textDecoration: 'none', fontWeight: 700, fontSize: 'clamp(13px, 1.3vw, 14px)' }}>
                Start Shopping
              </Link>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((order) => {
                const st = STATUS_STYLE[order.status] || STATUS_STYLE.placed;
                const stepIdx = STEP_IDX[order.status] ?? 0;
                const isOpen = expandedOrder === order.id;
                const canCancel = order.status === 'placed' || order.status === 'picked';
                const canDelete = order.status === 'delivered' || order.status === 'cancelled';
                const refund = REFUND_INFO[order.paymentMethod] || REFUND_INFO.cod;
                const isCOD = order.paymentMethod === 'cod' || !order.paymentMethod;

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, scale: 0.97 }}
                    transition={{ duration: 0.22 }}
                    style={{
                      background: '#fff',
                      border: '1px solid #fde8ec',
                      borderRadius: 'clamp(16px, 1.8vw, 20px)',
                      overflow: 'hidden',
                      boxShadow: '0 2px 12px rgba(183,110,121,0.07)',
                    }}
                    className="order-card"
                  >
                    <div style={{ padding: 'clamp(14px, 1.5vw, 18px) clamp(16px, 1.8vw, 20px)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 0.5vw, 8px)', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <span style={{
                              fontSize: 'clamp(12px, 1.2vw, 13px)',
                              fontWeight: 800,
                              color: '#3d1f25',
                            }}
                            className="order-id"
                              >
                              {order.id}
                            </span>
                            <span style={{
                              fontSize: 'clamp(10px, 1vw, 11px)',
                              fontWeight: 700,
                              background: st.bg,
                              color: st.color,
                              padding: 'clamp(2px, 0.3vw, 3px) clamp(8px, 1vw, 10px)',
                              borderRadius: '50px',
                              border: `1px solid ${st.color}33`,
                            }}>
                              {order.status === 'cancelled' ? '✕ ' : order.status === 'delivered' ? '✓ ' : '● '}
                              {st.label}
                            </span>
                          </div>
                          <div style={{
                            fontSize: 'clamp(11px, 1.1vw, 12px)',
                            color: '#8c6468',
                          }}
                          className="order-date"
                          >
                            {new Date(order.date).toLocaleDateString('en-NP', { month: 'long', day: 'numeric', year: 'numeric' })}
                            {' · '}{order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                            {' · '}<strong style={{ color: '#3d1f25' }}>Rs. {order.total?.toLocaleString()}</strong>
                          </div>
                        </div>
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => setExpandedOrder(isOpen ? null : order.id)}
                          style={{
                            background: '#fdf6f0',
                            border: '1px solid #fde8ec',
                            borderRadius: '50%',
                            width: 'clamp(30px, 3.5vw, 34px)',
                            height: 'clamp(30px, 3.5vw, 34px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}>
                          <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronRight size={14} color="#b76e79" />
                          </motion.span>
                        </motion.button>
                      </div>

                      <div style={{ display: 'flex', gap: 'clamp(6px, 0.8vw, 8px)', flexWrap: 'wrap', marginBottom: '12px' }} className="order-items">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <div key={i} style={{
                            background: '#fdf6f0',
                            borderRadius: '10px',
                            padding: 'clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 10px)',
                            fontSize: 'clamp(10px, 1vw, 11px)',
                            color: '#5a3a40',
                            fontWeight: 600,
                          }}
                          className="order-items-chip"
                          >
                            {item.name} ×{item.quantity}
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div style={{ background: '#fdf6f0', borderRadius: '10px', padding: 'clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 10px)', fontSize: 'clamp(10px, 1vw, 11px)', color: '#8c6468' }}>
                            +{order.items.length - 3} more
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 'clamp(6px, 0.8vw, 8px)' }} className="order-actions">
                        <Link href={`/checkout/success?id=${order.id}`}
                          style={{
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
                          Track Order
                        </Link>
                        {canCancel && (
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => openCancel(order)}
                            style={{
                              flex: 1,
                              fontSize: 'clamp(11px, 1.1vw, 12px)',
                              fontWeight: 700,
                              color: '#ef4444',
                              background: '#fff',
                              border: '1px solid #fecaca',
                              borderRadius: '50px',
                              padding: 'clamp(8px, 0.8vw, 9px) clamp(10px, 1vw, 12px)',
                              cursor: 'pointer',
                            }}>
                            Cancel Order
                          </motion.button>
                        )}
                        {canDelete && (
                          <motion.button
                            whileHover={{ background: '#fff0f0' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeleteTarget(order)}
                            title="Delete from history"
                            style={{
                              width: 'clamp(34px, 3.5vw, 38px)',
                              height: 'clamp(34px, 3.5vw, 38px)',
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#fff',
                              border: '1px solid #fecaca',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                            }}>
                            <Trash2 size={13} color="#ef4444" />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ borderTop: '1px solid #fde8ec', padding: 'clamp(14px, 1.5vw, 18px) clamp(16px, 1.8vw, 20px)', background: '#fdf8f5' }}>
                            {order.status !== 'cancelled' ? (
                              <>
                                <p style={{
                                  fontSize: 'clamp(10px, 1vw, 11px)',
                                  fontWeight: 800,
                                  color: '#b76e79',
                                  textTransform: 'uppercase',
                                  letterSpacing: '1px',
                                  marginBottom: '16px',
                                }}>
                                  📍 Live Tracking
                                </p>
                                <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', marginBottom: '16px' }}>
                                  <div style={{ position: 'absolute', top: '19px', left: '19px', right: '19px', height: '2px', background: '#fde8ec', zIndex: 0 }} />
                                  <div style={{ position: 'absolute', top: '19px', left: '19px', width: `${(stepIdx / (TRACKING_STEPS.length - 1)) * 100}%`, height: '2px', background: 'linear-gradient(to right,#b76e79,#c2748a)', zIndex: 1, transition: 'width 0.8s ease' }} />
                                  {TRACKING_STEPS.map((s, i) => {
                                    const done = i < stepIdx;
                                    const current = i === stepIdx;
                                    return (
                                      <div key={s.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }} className="tracking-step">
                                        <div style={{
                                          width: 'clamp(32px, 3.5vw, 38px)',
                                          height: 'clamp(32px, 3.5vw, 38px)',
                                          borderRadius: '50%',
                                          background: done || current ? 'linear-gradient(135deg,#b76e79,#c2748a)' : '#fff',
                                          border: `2px solid ${done || current ? '#b76e79' : '#fde8ec'}`,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: 'clamp(13px, 1.3vw, 15px)',
                                          marginBottom: '6px',
                                          boxShadow: current ? '0 0 0 4px rgba(183,110,121,0.15)' : 'none',
                                        }}
                                        className="tracking-step-icon"
                                        >
                                          {done ? <CheckCircle size={15} color="#fff" /> : s.icon}
                                        </div>
                                        <div style={{
                                          fontSize: 'clamp(9px, 0.9vw, 10px)',
                                          fontWeight: current ? 800 : 600,
                                          color: done || current ? '#3d1f25' : '#9ca3af',
                                          textAlign: 'center',
                                        }}
                                        className="tracking-step-label"
                                        >
                                          {s.label}
                                        </div>
                                        {current && <div style={{ fontSize: 'clamp(8px, 0.8vw, 9px)', color: '#b76e79', fontWeight: 700 }}>Now</div>}
                                      </div>
                                    );
                                  })}
                                </div>

                                {order.estimatedDelivery && (
                                  <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '12px', padding: 'clamp(10px, 1vw, 12px) clamp(12px, 1.2vw, 14px)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <Truck size={14} color="#b76e79" />
                                    <span style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#3d1f25' }}><strong>Estimated delivery:</strong> {order.estimatedDelivery}</span>
                                  </div>
                                )}

                                <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '12px', padding: 'clamp(10px, 1vw, 12px) clamp(12px, 1.2vw, 14px)', fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#5a3a40', marginBottom: '10px' }}>
                                  📍 {order.address?.address}, {order.address?.city}, {order.address?.province}
                                </div>
                              </>
                            ) : (
                              <>
                                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: 'clamp(12px, 1.2vw, 14px)', display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '14px' }}>
                                  <XCircle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
                                  <div>
                                    <div style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', fontWeight: 700, color: '#ef4444', marginBottom: '2px' }}>Order Cancelled</div>
                                    {order.cancelReason && <div style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', color: '#6b7280' }}>Reason: {order.cancelReason}</div>}
                                    {order.cancelledAt && (
                                      <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', color: '#9ca3af', marginTop: '2px' }}>
                                        On {new Date(order.cancelledAt).toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', fontWeight: 800, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                                    💸 Refund Status
                                  </div>

                                  {isCOD ? (
                                    <div style={{ background: '#fef9ec', border: '1px solid #fde68a', borderRadius: '12px', padding: 'clamp(12px, 1.2vw, 14px) clamp(14px, 1.5vw, 16px)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', flexShrink: 0 }}>💡</span>
                                      <div>
                                        <div style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', fontWeight: 700, color: '#92400e', marginBottom: '3px' }}>No Refund Required</div>
                                        <div style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', color: '#78350f', lineHeight: 1.6 }}>
                                          This was a Cash on Delivery order — no payment was collected, so no refund is needed.
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '14px', overflow: 'hidden' }}>
                                      <div style={{ background: 'linear-gradient(135deg,#dcfce7,#f0fdf4)', padding: 'clamp(10px, 1vw, 12px) clamp(14px, 1.5vw, 16px)', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.25)' }} />
                                          <span style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', fontWeight: 800, color: '#15803d' }}>Refund Initiated</span>
                                        </div>
                                        <span style={{ fontSize: 'clamp(10px, 1vw, 11px)', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '3px 10px', borderRadius: '50px', border: '1px solid #bbf7d0' }}>
                                          In Progress
                                        </span>
                                      </div>
                                      <div style={{ padding: 'clamp(12px, 1.2vw, 14px) clamp(14px, 1.5vw, 16px)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                          <span style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#5a3a40' }}>Refund Amount</span>
                                          <span style={{ fontSize: 'clamp(15px, 1.5vw, 17px)', fontWeight: 900, color: '#16a34a' }}>Rs. {order.total?.toLocaleString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                          <span style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', color: '#5a3a40' }}>Refund To</span>
                                          <span style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', fontWeight: 700, color: '#3d1f25' }}>{refund.icon} {refund.label}</span>
                                        </div>
                                        <div style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', color: '#6b7280', lineHeight: 1.6, marginBottom: '12px' }}>
                                          {refund.method}
                                        </div>
                                        <div style={{ background: '#dcfce7', borderRadius: '10px', padding: 'clamp(10px, 1vw, 12px) clamp(10px, 1.2vw, 12px)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                          <span style={{ fontSize: 'clamp(16px, 1.6vw, 18px)' }}>⏱</span>
                                          <div>
                                            <div style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', fontWeight: 800, color: '#15803d' }}>Expected within {refund.time}</div>
                                            <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', color: '#4ade80' }}>
                                              Initiated on {order.cancelledAt
                                                ? new Date(order.cancelledAt).toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : new Date().toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                          </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          {[
                                            { label: 'Refund Request Submitted', done: true },
                                            { label: 'Refund Being Processed', done: true },
                                            { label: `Refund Sent to ${refund.label}`, done: false },
                                            { label: 'Refund Received', done: false },
                                          ].map((step, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                              <div style={{
                                                width: 'clamp(18px, 1.8vw, 20px)',
                                                height: 'clamp(18px, 1.8vw, 20px)',
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                                background: step.done ? '#22c55e' : '#e5e7eb',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                              }}>
                                                {step.done ? <CheckCircle size={11} color="#fff" /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9ca3af' }} />}
                                              </div>
                                              <span style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', fontWeight: step.done ? 700 : 400, color: step.done ? '#15803d' : '#9ca3af' }}>
                                                {step.label}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div style={{ marginTop: '10px', background: '#fdf6f0', border: '1px solid #fde8ec', borderRadius: '10px', padding: 'clamp(10px, 1vw, 12px) clamp(10px, 1.2vw, 12px)' }}>
                                    <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', fontWeight: 700, color: '#b76e79', marginBottom: '3px' }}>Refund not received?</div>
                                    <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', color: '#8c6468', lineHeight: 1.6 }}>
                                      Contact us at <strong style={{ color: '#3d1f25' }}>+977 984-1234567</strong> or <strong style={{ color: '#3d1f25' }}>support@glowhive.com</strong>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <a href="tel:+9779841234567" style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                fontSize: 'clamp(11px, 1.1vw, 12px)',
                                fontWeight: 700,
                                color: '#b76e79',
                                textDecoration: 'none',
                                background: '#fff',
                                border: '1px solid #fde8ec',
                                borderRadius: '50px',
                                padding: 'clamp(8px, 0.8vw, 9px) clamp(10px, 1vw, 12px)',
                              }}>
                                📞 Call Support
                              </a>
                              <a href="mailto:support@glowhive.com" style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                fontSize: 'clamp(11px, 1.1vw, 12px)',
                                fontWeight: 700,
                                color: '#b76e79',
                                textDecoration: 'none',
                                background: '#fff',
                                border: '1px solid #fde8ec',
                                borderRadius: '50px',
                                padding: 'clamp(8px, 0.8vw, 9px) clamp(10px, 1vw, 12px)',
                              }}>
                                ✉️ Email Us
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Cancel Modal */}
        <AnimatePresence>
          {cancelTarget && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => cancelStep !== 3 && closeCancel()}
                style={{ position: 'fixed', inset: 0, background: 'rgba(61,31,37,0.55)', backdropFilter: 'blur(6px)', zIndex: 9000 }}
              />
              <div style={{ position: 'fixed', inset: 0, zIndex: 9001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', pointerEvents: 'none' }}>
                <motion.div
                  initial={{ scale: 0.88, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.88, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                  style={{
                    background: '#fff',
                    borderRadius: 'clamp(20px, 2vw, 24px)',
                    padding: 'clamp(20px, 2vw, 28px)',
                    width: 'min(460px, 92vw)',
                    boxShadow: '0 32px 80px rgba(61,31,37,0.28)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    pointerEvents: 'auto',
                  }}
                >
                  {cancelStep === 1 && (
                    <>
                      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{
                          width: 'clamp(50px, 5vw, 60px)',
                          height: 'clamp(50px, 5vw, 60px)',
                          borderRadius: '50%',
                          background: '#fef2f2',
                          margin: '0 auto 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <AlertCircle size={26} color="#ef4444" />
                        </div>
                        <h2 style={{
                          fontSize: 'clamp(16px, 1.8vw, 18px)',
                          fontWeight: 800,
                          color: '#3d1f25',
                          fontFamily: "'Playfair Display', Georgia, serif",
                          marginBottom: '8px',
                        }}>
                          Cancel This Order?
                        </h2>
                        <p style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#8c6468', lineHeight: 1.65, margin: 0 }}>
                          You're about to cancel <strong style={{ color: '#3d1f25' }}>{cancelTarget.id}</strong>. This cannot be undone.
                        </p>
                      </div>

                      <div style={{ background: '#fdf6f0', borderRadius: '14px', padding: 'clamp(12px, 1.2vw, 14px)', marginBottom: '20px' }}>
                        <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Order Summary</div>
                        {cancelTarget.items?.slice(0, 3).map(item => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(12px, 1.2vw, 13px)', marginBottom: '4px' }}>
                            <span style={{ color: '#5a3a40' }}>{item.name} ×{item.quantity}</span>
                            <span style={{ fontWeight: 700, color: '#3d1f25' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                        <div style={{ borderTop: '1px solid #fde8ec', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 'clamp(13px, 1.3vw, 14px)', color: '#3d1f25' }}>
                          <span>Total</span>
                          <span>Rs. {cancelTarget.total?.toLocaleString()}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={closeCancel}
                          style={{
                            flex: 1,
                            background: '#fff',
                            color: '#3d1f25',
                            border: '1.5px solid #fde8ec',
                            borderRadius: '12px',
                            padding: 'clamp(12px, 1.2vw, 13px)',
                            fontWeight: 700,
                            fontSize: 'clamp(13px, 1.3vw, 14px)',
                            cursor: 'pointer',
                          }}>
                          Keep Order 🌸
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCancelStep(2)}
                          style={{
                            flex: 1,
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: 'clamp(12px, 1.2vw, 13px)',
                            fontWeight: 700,
                            fontSize: 'clamp(13px, 1.3vw, 14px)',
                            cursor: 'pointer',
                          }}>
                          Yes, Cancel
                        </motion.button>
                      </div>
                    </>
                  )}

                  {cancelStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <button onClick={() => setCancelStep(1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#8c6468',
                          fontSize: 'clamp(12px, 1.2vw, 13px)',
                          fontWeight: 600,
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0,
                        }}>
                        ← Back
                      </button>
                      <h2 style={{
                        fontSize: 'clamp(16px, 1.6vw, 17px)',
                        fontWeight: 800,
                        color: '#3d1f25',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        marginBottom: '6px',
                      }}>
                        Help Us Improve 🌸
                      </h2>
                      <p style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#8c6468', lineHeight: 1.6, marginBottom: '16px' }}>
                        Tell us why you're cancelling — your feedback helps us get better.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
                        {CANCEL_REASONS.map(reason => (
                          <div key={reason} onClick={() => setCancelReason(reason)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: 'clamp(10px, 1vw, 11px) clamp(12px, 1.2vw, 14px)',
                              borderRadius: '12px',
                              border: `1.5px solid ${cancelReason === reason ? '#b76e79' : '#fde8ec'}`,
                              background: cancelReason === reason ? '#fef5f7' : '#fff',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}>
                            <div style={{
                              width: '17px',
                              height: '17px',
                              borderRadius: '50%',
                              flexShrink: 0,
                              border: `2px solid ${cancelReason === reason ? '#b76e79' : '#d1d5db'}`,
                              background: cancelReason === reason ? '#b76e79' : '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              {cancelReason === reason && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                            </div>
                            <span style={{
                              fontSize: 'clamp(12px, 1.2vw, 13px)',
                              fontWeight: cancelReason === reason ? 700 : 500,
                              color: '#3d1f25',
                            }}>
                              {reason}
                            </span>
                          </div>
                        ))}
                      </div>

                      {cancelReason === 'Other' && (
                        <textarea
                          value={cancelOther}
                          onChange={e => setCancelOther(e.target.value)}
                          placeholder="Please tell us more… (required)"
                          rows={3}
                          style={{
                            width: '100%',
                            padding: 'clamp(10px, 1vw, 12px) clamp(12px, 1.2vw, 14px)',
                            fontFamily: 'inherit',
                            border: '1.5px solid #fde8ec',
                            borderRadius: '12px',
                            fontSize: 'clamp(12px, 1.2vw, 13px)',
                            outline: 'none',
                            resize: 'none',
                            color: '#3d1f25',
                            background: '#fdf6f0',
                            boxSizing: 'border-box',
                            marginBottom: '14px',
                          }}
                        />
                      )}

                      <div style={{ background: '#fdf6f0', border: '1px solid #fde8ec', borderRadius: '10px', padding: 'clamp(10px, 1vw, 12px) clamp(10px, 1.2vw, 12px)', marginBottom: '14px' }}>
                        <p style={{ fontSize: 'clamp(10px, 1vw, 11px)', color: '#8c6468', lineHeight: 1.6, margin: 0 }}>
                          💬 Your feedback is anonymous and helps our team improve for everyone.
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={closeCancel}
                          style={{
                            flex: 1,
                            background: '#fff',
                            color: '#3d1f25',
                            border: '1.5px solid #fde8ec',
                            borderRadius: '12px',
                            padding: 'clamp(11px, 1.1vw, 12px)',
                            fontWeight: 700,
                            fontSize: 'clamp(12px, 1.2vw, 13px)',
                            cursor: 'pointer',
                          }}>
                          Keep Order
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={confirmCancel}
                          disabled={!cancelReason || (cancelReason === 'Other' && !cancelOther.trim())}
                          style={{
                            flex: 1.5,
                            border: 'none',
                            borderRadius: '12px',
                            padding: 'clamp(11px, 1.1vw, 12px)',
                            fontWeight: 800,
                            fontSize: 'clamp(12px, 1.2vw, 13px)',
                            background: (!cancelReason || (cancelReason === 'Other' && !cancelOther.trim())) ? '#fde8ec' : '#ef4444',
                            color: (!cancelReason || (cancelReason === 'Other' && !cancelOther.trim())) ? '#8c6468' : '#fff',
                            cursor: (!cancelReason || (cancelReason === 'Other' && !cancelOther.trim())) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                          }}>
                          Confirm Cancellation
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {cancelStep === 3 && (
                    <>
                      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ fontSize: 'clamp(44px, 5vw, 52px)', marginBottom: '12px' }}>✅</div>
                        <h2 style={{
                          fontSize: 'clamp(16px, 1.8vw, 18px)',
                          fontWeight: 800,
                          color: '#3d1f25',
                          fontFamily: "'Playfair Display', Georgia, serif",
                          marginBottom: '8px',
                        }}>
                          Order Cancelled
                        </h2>
                        <p style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#8c6468', lineHeight: 1.65, margin: 0 }}>
                          <strong style={{ color: '#3d1f25' }}>{cancelTarget.id}</strong> has been successfully cancelled.
                        </p>
                      </div>

                      {(() => {
                        const refund = REFUND_INFO[cancelTarget.paymentMethod] || REFUND_INFO.cod;
                        const isCOD = cancelTarget.paymentMethod === 'cod' || !cancelTarget.paymentMethod;
                        return (
                          <div style={{
                            background: isCOD ? '#fef9ec' : '#f0fdf4',
                            border: `1.5px solid ${isCOD ? '#fde68a' : '#bbf7d0'}`,
                            borderRadius: '16px',
                            padding: 'clamp(14px, 1.5vw, 16px)',
                            marginBottom: '20px',
                          }}>
                            <div style={{
                              fontSize: 'clamp(11px, 1.1vw, 12px)',
                              fontWeight: 800,
                              color: isCOD ? '#92400e' : '#16a34a',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              marginBottom: '12px',
                            }}>
                              {isCOD ? '💡 No Refund Required' : '💚 Refund Information'}
                            </div>
                            {isCOD ? (
                              <div style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#78350f', lineHeight: 1.6 }}>
                                This was a Cash on Delivery order — no payment was collected, so no refund is needed.
                              </div>
                            ) : (
                              <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <span style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#5a3a40' }}>Refund Amount</span>
                                  <span style={{ fontSize: 'clamp(15px, 1.5vw, 16px)', fontWeight: 900, color: '#16a34a' }}>Rs. {cancelTarget.total?.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <span style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#5a3a40' }}>Refund To</span>
                                  <span style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', fontWeight: 700, color: '#3d1f25' }}>{refund.icon} {refund.label}</span>
                                </div>
                                <div style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', color: '#6b7280', marginBottom: '10px', lineHeight: 1.6 }}>{refund.method}</div>
                                <div style={{
                                  background: '#dcfce7',
                                  borderRadius: '10px',
                                  padding: 'clamp(10px, 1vw, 12px) clamp(10px, 1.2vw, 12px)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                }}>
                                  <span style={{ fontSize: 'clamp(16px, 1.6vw, 18px)' }}>⏱</span>
                                  <div>
                                    <div style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', fontWeight: 800, color: '#15803d' }}>Expected within {refund.time}</div>
                                    <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', color: '#4ade80' }}>
                                      Initiated on {new Date().toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })()}

                      <div style={{ background: '#fdf6f0', border: '1px solid #fde8ec', borderRadius: '12px', padding: 'clamp(10px, 1vw, 12px) clamp(12px, 1.2vw, 14px)', marginBottom: '20px' }}>
                        <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', fontWeight: 700, color: '#b76e79', marginBottom: '4px' }}>Need help with your refund?</div>
                        <div style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', color: '#8c6468', lineHeight: 1.6 }}>
                          Call <strong style={{ color: '#3d1f25' }}>+977 984-1234567</strong> or email <strong style={{ color: '#3d1f25' }}>support@glowhive.com</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={closeCancel}
                          style={{
                            flex: 1,
                            background: 'linear-gradient(135deg,#b76e79,#c2748a)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: 'clamp(12px, 1.2vw, 13px)',
                            fontWeight: 700,
                            fontSize: 'clamp(13px, 1.3vw, 14px)',
                            cursor: 'pointer',
                          }}>
                          Done
                        </motion.button>
                        <Link href="/products" onClick={closeCancel}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#fdf0f3',
                            color: '#b76e79',
                            border: '1px solid #fde8ec',
                            borderRadius: '12px',
                            padding: 'clamp(12px, 1.2vw, 13px)',
                            fontWeight: 700,
                            fontSize: 'clamp(12px, 1.2vw, 13px)',
                            textDecoration: 'none',
                          }}>
                          Shop Again 🛍️
                        </Link>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Modal */}
        <AnimatePresence>
          {deleteTarget && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setDeleteTarget(null)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(61,31,37,0.55)', backdropFilter: 'blur(6px)', zIndex: 9000 }}
              />
              <div style={{ position: 'fixed', inset: 0, zIndex: 9001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', pointerEvents: 'none' }}>
                <motion.div
                  initial={{ scale: 0.88, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.88, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                  style={{
                    background: '#fff',
                    borderRadius: 'clamp(20px, 2vw, 24px)',
                    padding: 'clamp(20px, 2vw, 28px)',
                    width: 'min(400px, 92vw)',
                    boxShadow: '0 32px 80px rgba(61,31,37,0.28)',
                    pointerEvents: 'auto',
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{
                      width: 'clamp(50px, 5vw, 60px)',
                      height: 'clamp(50px, 5vw, 60px)',
                      borderRadius: '50%',
                      background: '#fef2f2',
                      margin: '0 auto 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Trash2 size={24} color="#ef4444" />
                    </div>
                    <h2 style={{
                      fontSize: 'clamp(16px, 1.8vw, 18px)',
                      fontWeight: 800,
                      color: '#3d1f25',
                      fontFamily: "'Playfair Display', Georgia, serif",
                      marginBottom: '8px',
                    }}>
                      Delete This Order?
                    </h2>
                    <p style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#8c6468', lineHeight: 1.65, margin: 0 }}>
                      <strong style={{ color: '#3d1f25' }}>{deleteTarget.id}</strong> will be permanently removed from your order history.
                    </p>
                  </div>

                  <div style={{ background: '#fdf6f0', borderRadius: '12px', padding: 'clamp(10px, 1vw, 12px) clamp(12px, 1.2vw, 14px)', marginBottom: '20px' }}>
                    <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                      {STATUS_STYLE[deleteTarget.status]?.label || deleteTarget.status}
                    </div>
                    <div style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#5a3a40', marginBottom: '4px' }}>
                      {deleteTarget.items?.length} {deleteTarget.items?.length === 1 ? 'item' : 'items'} · <strong style={{ color: '#3d1f25' }}>Rs. {deleteTarget.total?.toLocaleString()}</strong>
                    </div>
                    <div style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', color: '#8c6468' }}>
                      {new Date(deleteTarget.date).toLocaleDateString('en-NP', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setDeleteTarget(null)}
                      style={{
                        flex: 1,
                        background: '#fff',
                        color: '#3d1f25',
                        border: '1.5px solid #fde8ec',
                        borderRadius: '12px',
                        padding: 'clamp(12px, 1.2vw, 13px)',
                        fontWeight: 700,
                        fontSize: 'clamp(13px, 1.3vw, 14px)',
                        cursor: 'pointer',
                      }}>
                      Keep It
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={confirmDelete}
                      style={{
                        flex: 1,
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: 'clamp(12px, 1.2vw, 13px)',
                        fontWeight: 700,
                        fontSize: 'clamp(13px, 1.3vw, 14px)',
                        cursor: 'pointer',
                      }}>
                      Yes, Delete
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}