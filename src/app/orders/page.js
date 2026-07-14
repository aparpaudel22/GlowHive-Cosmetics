'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronRight, XCircle, CheckCircle, Truck, AlertCircle, Sparkles } from 'lucide-react';
import Footer from '@/components/Footer';
const TRACKING_STEPS = [
  { key: 'placed',    label: 'Placed',    icon: '🛍️' },
  { key: 'picked',    label: 'Picked',    icon: '📦' },
  { key: 'packing',   label: 'Packing',   icon: '🎀' },
  { key: 'shipped',   label: 'Shipped',   icon: '🚚' },
  { key: 'delivered', label: 'Delivered', icon: '🏡' },
];

const STEP_IDX = { placed: 0, picked: 1, packing: 2, shipped: 3, delivered: 4 };

const STATUS_STYLE = {
  placed:    { bg: '#fdf6f0', color: '#b76e79', label: 'Order Placed'  },
  picked:    { bg: '#fef9ec', color: '#d97706', label: 'Being Picked'  },
  packing:   { bg: '#fef9ec', color: '#d97706', label: 'Packing'       },
  shipped:   { bg: '#eff6ff', color: '#3b82f6', label: 'Shipped'       },
  delivered: { bg: '#f0fdf4', color: '#22c55e', label: 'Delivered'     },
  cancelled: { bg: '#fef2f2', color: '#ef4444', label: 'Cancelled'     },
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
  cod:    { label: 'Cash on Delivery', icon: '💵', method: 'No payment was taken — nothing to refund.',            time: 'N/A'               },
  esewa:  { label: 'eSewa Wallet',     icon: '🟢', method: 'Refund will be credited to your eSewa wallet.',        time: '1–3 business days' },
  khalti: { label: 'Khalti Wallet',    icon: '🟣', method: 'Refund will be credited to your Khalti wallet.',       time: '1–3 business days' },
  bank:   { label: 'Bank Transfer',    icon: '🏦', method: 'Refund will be sent to your registered bank account.', time: '3–5 business days' },
};

const STATUS_FILTERS = [
  { key: 'all',       label: 'All Orders' },
  { key: 'placed',    label: 'Placed'     },
  { key: 'shipped',   label: 'Shipped'    },
  { key: 'delivered', label: 'Delivered'  },
  { key: 'cancelled', label: 'Cancelled'  },
];

export default function OrdersPage() {
  const [orders,        setOrders]        = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus,  setFilterStatus]  = useState('all');
  const [cancelTarget,  setCancelTarget]  = useState(null);
  const [cancelReason,  setCancelReason]  = useState('');
  const [cancelOther,   setCancelOther]   = useState('');
  const [cancelStep,    setCancelStep]    = useState(1);

  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem('glowhive_orders') || '[]')); } catch (_) {}
  }, []);

  const openCancel  = (order) => { setCancelTarget(order); setCancelReason(''); setCancelOther(''); setCancelStep(1); };
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
    setCancelStep(3);
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <>
    <div style={{ minHeight: '100vh', background: '#fdf6f0', paddingBottom: '60px' }}>

            {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #3d1f25 0%, #b76e79 60%, #e8a4b0 100%)',
        padding: '60px 28px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={18} color="rgba(255,255,255,0.8)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Order History
            </span>
            <Sparkles size={18} color="rgba(255,255,255,0.8)" />
          </div>
          <h1 style={{ fontSize: '44px', fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '12px' }}>
            My Orders
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px', margin: '0 auto' }}>
            Track, manage and review all your GlowHive purchases in one place.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginTop: '28px', flexWrap: 'wrap' }}>
            {[
              { value: orders.length,                                                   label: 'Total Orders'   },
              { value: orders.filter(o => o.status !== 'cancelled').length,             label: 'Active Orders'  },
              { value: orders.filter(o => o.status === 'delivered').length,             label: 'Delivered'      },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 16px' }}>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '20px 0 16px', scrollbarWidth: 'none' }}>
          {STATUS_FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilterStatus(f.key)}
              style={{ whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '50px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${filterStatus === f.key ? '#b76e79' : '#fde8ec'}`, background: filterStatus === f.key ? '#b76e79' : '#fff', color: filterStatus === f.key ? '#fff' : '#3d1f25', transition: 'all 0.2s' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>📦</div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginBottom: '8px' }}>No orders here yet</p>
            <p style={{ fontSize: '13px', color: '#8c6468', marginBottom: '24px' }}>Time to discover something beautiful 🌸</p>
            <Link href="/products" style={{ background: 'linear-gradient(135deg,#b76e79,#c2748a)', color: '#fff', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
              Start Shopping
            </Link>
          </div>
        )}

        {/* Order cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((order) => {
            const st        = STATUS_STYLE[order.status] || STATUS_STYLE.placed;
            const stepIdx   = STEP_IDX[order.status] ?? 0;
            const isOpen    = expandedOrder === order.id;
            const canCancel = order.status === 'placed' || order.status === 'picked';
            const refund    = REFUND_INFO[order.paymentMethod] || REFUND_INFO.cod;
            const isCOD     = order.paymentMethod === 'cod' || !order.paymentMethod;

            return (
              <div key={order.id} style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(183,110,121,0.07)' }}>

                {/* Card header */}
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#3d1f25' }}>{order.id}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '50px', border: `1px solid ${st.color}33` }}>
                          {order.status === 'cancelled' ? '✕ ' : order.status === 'delivered' ? '✓ ' : '● '}
                          {st.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#8c6468' }}>
                        {new Date(order.date).toLocaleDateString('en-NP', { month: 'long', day: 'numeric', year: 'numeric' })}
                        {' · '}{order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                        {' · '}<strong style={{ color: '#3d1f25' }}>Rs. {order.total?.toLocaleString()}</strong>
                      </div>
                    </div>
                    <motion.button whileTap={{ scale: 0.9 }}
                      onClick={() => setExpandedOrder(isOpen ? null : order.id)}
                      style={{ background: '#fdf6f0', border: '1px solid #fde8ec', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronRight size={15} color="#b76e79" />
                      </motion.span>
                    </motion.button>
                  </div>

                  {/* Items preview chips */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {order.items?.slice(0, 3).map((item, i) => (
                      <div key={i} style={{ background: '#fdf6f0', borderRadius: '10px', padding: '6px 10px', fontSize: '11px', color: '#5a3a40', fontWeight: 600 }}>
                        {item.name} ×{item.quantity}
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div style={{ background: '#fdf6f0', borderRadius: '10px', padding: '6px 10px', fontSize: '11px', color: '#8c6468' }}>
                        +{order.items.length - 3} more
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/checkout/success?id=${order.id}`}
                      style={{ flex: 1, textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#b76e79', textDecoration: 'none', background: '#fdf0f3', border: '1px solid #fde8ec', borderRadius: '50px', padding: '9px 12px' }}>
                      Track Order
                    </Link>
                    {canCancel && (
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => openCancel(order)}
                        style={{ flex: 1, fontSize: '12px', fontWeight: 700, color: '#ef4444', background: '#fff', border: '1px solid #fecaca', borderRadius: '50px', padding: '9px 12px', cursor: 'pointer' }}>
                        Cancel Order
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Expanded section */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ borderTop: '1px solid #fde8ec', padding: '18px 20px', background: '#fdf8f5' }}>

                        {order.status !== 'cancelled' ? (
                          <>
                            {/* Live tracking */}
                            <p style={{ fontSize: '11px', fontWeight: 800, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                              📍 Live Tracking
                            </p>
                            <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', marginBottom: '16px' }}>
                              <div style={{ position: 'absolute', top: '19px', left: '19px', right: '19px', height: '2px', background: '#fde8ec', zIndex: 0 }} />
                              <div style={{ position: 'absolute', top: '19px', left: '19px', width: `${(stepIdx / (TRACKING_STEPS.length - 1)) * 100}%`, height: '2px', background: 'linear-gradient(to right,#b76e79,#c2748a)', zIndex: 1, transition: 'width 0.8s ease' }} />
                              {TRACKING_STEPS.map((s, i) => {
                                const done    = i < stepIdx;
                                const current = i === stepIdx;
                                return (
                                  <div key={s.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: done || current ? 'linear-gradient(135deg,#b76e79,#c2748a)' : '#fff', border: `2px solid ${done || current ? '#b76e79' : '#fde8ec'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', marginBottom: '6px', boxShadow: current ? '0 0 0 4px rgba(183,110,121,0.15)' : 'none' }}>
                                      {done ? <CheckCircle size={16} color="#fff" /> : s.icon}
                                    </div>
                                    <div style={{ fontSize: '10px', fontWeight: current ? 800 : 600, color: done || current ? '#3d1f25' : '#9ca3af', textAlign: 'center' }}>{s.label}</div>
                                    {current && <div style={{ fontSize: '9px', color: '#b76e79', fontWeight: 700 }}>Now</div>}
                                  </div>
                                );
                              })}
                            </div>

                            {order.estimatedDelivery && (
                              <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <Truck size={15} color="#b76e79" />
                                <span style={{ fontSize: '13px', color: '#3d1f25' }}><strong>Estimated delivery:</strong> {order.estimatedDelivery}</span>
                              </div>
                            )}

                            <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '12px', padding: '12px 14px', fontSize: '13px', color: '#5a3a40', marginBottom: '10px' }}>
                              📍 {order.address?.address}, {order.address?.city}, {order.address?.province}
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Cancelled banner */}
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '14px' }}>
                              <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444', marginBottom: '2px' }}>Order Cancelled</div>
                                {order.cancelReason && <div style={{ fontSize: '12px', color: '#6b7280' }}>Reason: {order.cancelReason}</div>}
                                {order.cancelledAt && (
                                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                                    On {new Date(order.cancelledAt).toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* ── REFUND SECTION ── */}
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '11px', fontWeight: 800, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                                💸 Refund Status
                              </div>

                              {isCOD ? (
                                <div style={{ background: '#fef9ec', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                  <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400e', marginBottom: '3px' }}>No Refund Required</div>
                                    <div style={{ fontSize: '12px', color: '#78350f', lineHeight: 1.6 }}>
                                      This was a Cash on Delivery order — no payment was collected, so no refund is needed.
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '14px', overflow: 'hidden' }}>

                                  {/* Status bar */}
                                  <div style={{ background: 'linear-gradient(135deg,#dcfce7,#f0fdf4)', padding: '12px 16px', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.25)' }} />
                                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#15803d' }}>Refund Initiated</span>
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '3px 10px', borderRadius: '50px', border: '1px solid #bbf7d0' }}>
                                      In Progress
                                    </span>
                                  </div>

                                  {/* Details */}
                                  <div style={{ padding: '14px 16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                      <span style={{ fontSize: '13px', color: '#5a3a40' }}>Refund Amount</span>
                                      <span style={{ fontSize: '17px', fontWeight: 900, color: '#16a34a' }}>Rs. {order.total?.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                      <span style={{ fontSize: '12px', color: '#5a3a40' }}>Refund To</span>
                                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#3d1f25' }}>{refund.icon} {refund.label}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.6, marginBottom: '12px' }}>
                                      {refund.method}
                                    </div>

                                    {/* Timeline */}
                                    <div style={{ background: '#dcfce7', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                      <span style={{ fontSize: '18px' }}>⏱</span>
                                      <div>
                                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d' }}>Expected within {refund.time}</div>
                                        <div style={{ fontSize: '11px', color: '#4ade80' }}>
                                          Initiated on {order.cancelledAt
                                            ? new Date(order.cancelledAt).toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : new Date().toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Refund steps */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      {[
                                        { label: 'Refund Request Submitted',       done: true  },
                                        { label: 'Refund Being Processed',         done: true  },
                                        { label: `Refund Sent to ${refund.label}`, done: false },
                                        { label: 'Refund Received',                done: false },
                                      ].map((step, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, background: step.done ? '#22c55e' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {step.done
                                              ? <CheckCircle size={12} color="#fff" />
                                              : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9ca3af' }} />
                                            }
                                          </div>
                                          <span style={{ fontSize: '12px', fontWeight: step.done ? 700 : 400, color: step.done ? '#15803d' : '#9ca3af' }}>
                                            {step.label}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Help line */}
                              <div style={{ marginTop: '10px', background: '#fdf6f0', border: '1px solid #fde8ec', borderRadius: '10px', padding: '10px 14px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#b76e79', marginBottom: '3px' }}>Refund not received?</div>
                                <div style={{ fontSize: '11px', color: '#8c6468', lineHeight: 1.6 }}>
                                  Contact us at <strong style={{ color: '#3d1f25' }}>+977 984-1234567</strong> or <strong style={{ color: '#3d1f25' }}>support@glowhive.com</strong>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Support buttons */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <a href="tel:+9779841234567" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#b76e79', textDecoration: 'none', background: '#fff', border: '1px solid #fde8ec', borderRadius: '50px', padding: '9px' }}>
                            📞 Call Support
                          </a>
                          <a href="mailto:support@glowhive.com" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#b76e79', textDecoration: 'none', background: '#fff', border: '1px solid #fde8ec', borderRadius: '50px', padding: '9px' }}>
                            ✉️ Email Us
                          </a>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════
          CANCEL MODAL
      ══════════════════════════════════ */}
      <AnimatePresence>
        {cancelTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => cancelStep !== 3 && closeCancel()}
              style={{ position: 'fixed', inset: 0, background: 'rgba(61,31,37,0.55)', backdropFilter: 'blur(6px)', zIndex: 9000 }}
            />

            {/* Centering wrapper */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 9001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', pointerEvents: 'none' }}>
              <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                style={{ background: '#fff', borderRadius: '24px', padding: '28px', width: 'min(460px, 92vw)', boxShadow: '0 32px 80px rgba(61,31,37,0.28)', maxHeight: '90vh', overflowY: 'auto', pointerEvents: 'auto' }}
              >

                {/* Step 1 — Confirm */}
                {cancelStep === 1 && (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fef2f2', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertCircle size={28} color="#ef4444" />
                      </div>
                      <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '8px' }}>
                        Cancel This Order?
                      </h2>
                      <p style={{ fontSize: '13px', color: '#8c6468', lineHeight: 1.65, margin: 0 }}>
                        You're about to cancel <strong style={{ color: '#3d1f25' }}>{cancelTarget.id}</strong>. This cannot be undone.
                      </p>
                    </div>

                    <div style={{ background: '#fdf6f0', borderRadius: '14px', padding: '14px', marginBottom: '20px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Order Summary</div>
                      {cancelTarget.items?.slice(0, 3).map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                          <span style={{ color: '#5a3a40' }}>{item.name} ×{item.quantity}</span>
                          <span style={{ fontWeight: 700, color: '#3d1f25' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid #fde8ec', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '14px', color: '#3d1f25' }}>
                        <span>Total</span>
                        <span>Rs. {cancelTarget.total?.toLocaleString()}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={closeCancel}
                        style={{ flex: 1, background: '#fff', color: '#3d1f25', border: '1.5px solid #fde8ec', borderRadius: '12px', padding: '13px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                        Keep Order 🌸
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCancelStep(2)}
                        style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                        Yes, Cancel
                      </motion.button>
                    </div>
                  </>
                )}

                {/* Step 2 — Reason */}
                {cancelStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button onClick={() => setCancelStep(1)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8c6468', fontSize: '13px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
                      ← Back
                    </button>
                    <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '6px' }}>
                      Help Us Improve 🌸
                    </h2>
                    <p style={{ fontSize: '13px', color: '#8c6468', lineHeight: 1.6, marginBottom: '16px' }}>
                      Tell us why you're cancelling — your feedback helps us get better.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
                      {CANCEL_REASONS.map(reason => (
                        <div key={reason} onClick={() => setCancelReason(reason)}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', border: `1.5px solid ${cancelReason === reason ? '#b76e79' : '#fde8ec'}`, background: cancelReason === reason ? '#fef5f7' : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                          <div style={{ width: '17px', height: '17px', borderRadius: '50%', flexShrink: 0, border: `2px solid ${cancelReason === reason ? '#b76e79' : '#d1d5db'}`, background: cancelReason === reason ? '#b76e79' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {cancelReason === reason && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: cancelReason === reason ? 700 : 500, color: '#3d1f25' }}>{reason}</span>
                        </div>
                      ))}
                    </div>

                    {cancelReason === 'Other' && (
                      <textarea
                        value={cancelOther}
                        onChange={e => setCancelOther(e.target.value)}
                        placeholder="Please tell us more… (required)"
                        rows={3}
                        style={{ width: '100%', padding: '12px 14px', fontFamily: 'inherit', border: '1.5px solid #fde8ec', borderRadius: '12px', fontSize: '13px', outline: 'none', resize: 'none', color: '#3d1f25', background: '#fdf6f0', boxSizing: 'border-box', marginBottom: '14px' }}
                      />
                    )}

                    <div style={{ background: '#fdf6f0', border: '1px solid #fde8ec', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px' }}>
                      <p style={{ fontSize: '11px', color: '#8c6468', lineHeight: 1.6, margin: 0 }}>
                        💬 Your feedback is anonymous and helps our team improve for everyone.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={closeCancel}
                        style={{ flex: 1, background: '#fff', color: '#3d1f25', border: '1.5px solid #fde8ec', borderRadius: '12px', padding: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                        Keep Order
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={confirmCancel}
                        disabled={!cancelReason || (cancelReason === 'Other' && !cancelOther.trim())}
                        style={{
                          flex: 1.5,
                          background: (!cancelReason || (cancelReason === 'Other' && !cancelOther.trim())) ? '#fde8ec' : '#ef4444',
                          color:      (!cancelReason || (cancelReason === 'Other' && !cancelOther.trim())) ? '#8c6468' : '#fff',
                          border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 800, fontSize: '13px',
                          cursor: (!cancelReason || (cancelReason === 'Other' && !cancelOther.trim())) ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                        }}>
                        Confirm Cancellation
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Step 3 — Refund confirmation */}
                {cancelStep === 3 && (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <div style={{ fontSize: '52px', marginBottom: '12px' }}>✅</div>
                      <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '8px' }}>
                        Order Cancelled
                      </h2>
                      <p style={{ fontSize: '13px', color: '#8c6468', lineHeight: 1.65, margin: 0 }}>
                        <strong style={{ color: '#3d1f25' }}>{cancelTarget.id}</strong> has been successfully cancelled.
                      </p>
                    </div>

                    {(() => {
                      const refund = REFUND_INFO[cancelTarget.paymentMethod] || REFUND_INFO.cod;
                      const isCOD  = cancelTarget.paymentMethod === 'cod' || !cancelTarget.paymentMethod;
                      return (
                        <div style={{ background: isCOD ? '#fef9ec' : '#f0fdf4', border: `1.5px solid ${isCOD ? '#fde68a' : '#bbf7d0'}`, borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: isCOD ? '#92400e' : '#16a34a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                            {isCOD ? '💡 No Refund Required' : '💚 Refund Information'}
                          </div>
                          {isCOD ? (
                            <div style={{ fontSize: '13px', color: '#78350f', lineHeight: 1.6 }}>
                              This was a Cash on Delivery order — no payment was collected, so no refund is needed.
                            </div>
                          ) : (
                            <>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', color: '#5a3a40' }}>Refund Amount</span>
                                <span style={{ fontSize: '16px', fontWeight: 900, color: '#16a34a' }}>Rs. {cancelTarget.total?.toLocaleString()}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', color: '#5a3a40' }}>Refund To</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#3d1f25' }}>{refund.icon} {refund.label}</span>
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px', lineHeight: 1.6 }}>{refund.method}</div>
                              <div style={{ background: '#dcfce7', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '18px' }}>⏱</span>
                                <div>
                                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d' }}>Expected within {refund.time}</div>
                                  <div style={{ fontSize: '11px', color: '#4ade80' }}>Initiated on {new Date().toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()}

                    <div style={{ background: '#fdf6f0', border: '1px solid #fde8ec', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#b76e79', marginBottom: '4px' }}>Need help with your refund?</div>
                      <div style={{ fontSize: '12px', color: '#8c6468', lineHeight: 1.6 }}>
                        Call <strong style={{ color: '#3d1f25' }}>+977 984-1234567</strong> or email <strong style={{ color: '#3d1f25' }}>support@glowhive.com</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={closeCancel}
                        style={{ flex: 1, background: 'linear-gradient(135deg,#b76e79,#c2748a)', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                        Done
                      </motion.button>
                      <Link href="/products" onClick={closeCancel}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf0f3', color: '#b76e79', border: '1px solid #fde8ec', borderRadius: '12px', padding: '13px', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
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

    </div>
    <Footer />
    </>
  );
}