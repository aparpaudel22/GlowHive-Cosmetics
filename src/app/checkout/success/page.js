'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Package, Truck, MapPin,
  Phone, Mail, ClipboardList, XCircle, AlertCircle,
} from 'lucide-react';

const TRACKING_STEPS = [
  { key: 'placed',    label: 'Order Placed',  icon: '🛍️', desc: 'We have received your order and are processing it.' },
  { key: 'picked',    label: 'Being Picked',  icon: '📦', desc: 'Our team is picking your items from the shelf.' },
  { key: 'packing',   label: 'Packing',       icon: '🎀', desc: 'Your order is being carefully packed.' },
  { key: 'shipped',   label: 'Shipped',       icon: '🚚', desc: 'Your order is on its way to you.' },
  { key: 'delivered', label: 'Delivered',     icon: '🏡', desc: 'Package delivered. Enjoy your GlowHive goodies!' },
];
const STATUS_INDEX = { placed: 0, picked: 1, packing: 2, shipped: 3, delivered: 4 };

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

/* ─── 3-step Cancel Modal ─── */
function CancelModal({ order, onClose, onConfirmed }) {
  const [step,         setStep]         = useState(1);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelOther,  setCancelOther]  = useState('');

  const refund = REFUND_INFO[order?.paymentMethod] || REFUND_INFO.cod;
  const isCOD  = order?.paymentMethod === 'cod' || !order?.paymentMethod;

  const confirmCancel = () => {
    const finalReason = cancelReason === 'Other' ? cancelOther.trim() : cancelReason;
    if (!finalReason) return;
    onConfirmed(finalReason);
    setStep(3);
  };

  return (
    <>
      {/* Blurred backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => step !== 3 && onClose()}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(61,31,37,0.55)',
          backdropFilter: 'blur(6px)',
          zIndex: 9000,
        }}
      />

      {/* Modal panel */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9001,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', pointerEvents: 'none',
      }}>
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{   scale: 0.88, opacity: 0, y: 20  }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          style={{
            background: '#fff', borderRadius: '24px', padding: '28px',
            width: 'min(460px, 92vw)', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 32px 80px rgba(61,31,37,0.28)',
            pointerEvents: 'auto',
          }}
        >

          {/* ── Step 1 — Confirm ── */}
          {step === 1 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: '#fef2f2', margin: '0 auto 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AlertCircle size={28} color="#ef4444" />
                </div>
                <h2 style={{
                  fontSize: '18px', fontWeight: 800, color: '#3d1f25',
                  fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '8px',
                }}>
                  Cancel This Order?
                </h2>
                <p style={{ fontSize: '13px', color: '#8c6468', lineHeight: 1.65, margin: 0 }}>
                  You're about to cancel <strong style={{ color: '#3d1f25' }}>{order?.id}</strong>. This cannot be undone.
                </p>
              </div>

              {/* Mini order summary */}
              <div style={{
                background: '#fdf6f0', borderRadius: '14px',
                padding: '14px', marginBottom: '20px',
              }}>
                <div style={{
                  fontSize: '11px', fontWeight: 700, color: '#b76e79',
                  textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
                }}>
                  Order Summary
                </div>
                {order?.items?.slice(0, 3).map(item => (
                  <div key={item.id} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '13px', marginBottom: '4px',
                  }}>
                    <span style={{ color: '#5a3a40' }}>{item.name} ×{item.quantity}</span>
                    <span style={{ fontWeight: 700, color: '#3d1f25' }}>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div style={{
                  borderTop: '1px solid #fde8ec', marginTop: '8px', paddingTop: '8px',
                  display: 'flex', justifyContent: 'space-between',
                  fontWeight: 800, fontSize: '14px', color: '#3d1f25',
                }}>
                  <span>Total</span>
                  <span>Rs. {order?.total?.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
                  style={{
                    flex: 1, background: '#fff', color: '#3d1f25',
                    border: '1.5px solid #fde8ec', borderRadius: '12px',
                    padding: '13px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  }}>
                  Keep Order 🌸
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(2)}
                  style={{
                    flex: 1, background: '#ef4444', color: '#fff',
                    border: 'none', borderRadius: '12px',
                    padding: '13px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  }}>
                  Yes, Cancel
                </motion.button>
              </div>
            </>
          )}

          {/* ── Step 2 — Reason ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => setStep(1)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#8c6468', fontSize: '13px', fontWeight: 600,
                  marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px', padding: 0,
                }}>
                ← Back
              </button>

              <h2 style={{
                fontSize: '17px', fontWeight: 800, color: '#3d1f25',
                fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '6px',
              }}>
                Help Us Improve 🌸
              </h2>
              <p style={{ fontSize: '13px', color: '#8c6468', lineHeight: 1.6, marginBottom: '16px' }}>
                Tell us why you're cancelling — your feedback helps us get better.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
                {CANCEL_REASONS.map(reason => (
                  <div key={reason} onClick={() => setCancelReason(reason)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '11px 14px', borderRadius: '12px',
                      border: `1.5px solid ${cancelReason === reason ? '#b76e79' : '#fde8ec'}`,
                      background: cancelReason === reason ? '#fef5f7' : '#fff',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                    <div style={{
                      width: '17px', height: '17px', borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${cancelReason === reason ? '#b76e79' : '#d1d5db'}`,
                      background: cancelReason === reason ? '#b76e79' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {cancelReason === reason && (
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: '13px',
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
                    width: '100%', padding: '12px 14px', fontFamily: 'inherit',
                    border: '1.5px solid #fde8ec', borderRadius: '12px',
                    fontSize: '13px', outline: 'none', resize: 'none',
                    color: '#3d1f25', background: '#fdf6f0',
                    boxSizing: 'border-box', marginBottom: '14px',
                  }}
                />
              )}

              <div style={{
                background: '#fdf6f0', border: '1px solid #fde8ec',
                borderRadius: '10px', padding: '10px 14px', marginBottom: '14px',
              }}>
                <p style={{ fontSize: '11px', color: '#8c6468', lineHeight: 1.6, margin: 0 }}>
                  💬 Your feedback is anonymous and helps our team improve for everyone.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
                  style={{
                    flex: 1, background: '#fff', color: '#3d1f25',
                    border: '1.5px solid #fde8ec', borderRadius: '12px',
                    padding: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                  }}>
                  Keep Order
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmCancel}
                  disabled={!cancelReason || (cancelReason === 'Other' && !cancelOther.trim())}
                  style={{
                    flex: 1.5, border: 'none', borderRadius: '12px',
                    padding: '12px', fontWeight: 800, fontSize: '13px',
                    background: (!cancelReason || (cancelReason === 'Other' && !cancelOther.trim()))
                      ? '#fde8ec' : '#ef4444',
                    color: (!cancelReason || (cancelReason === 'Other' && !cancelOther.trim()))
                      ? '#8c6468' : '#fff',
                    cursor: (!cancelReason || (cancelReason === 'Other' && !cancelOther.trim()))
                      ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}>
                  Confirm Cancellation
                </motion.button>
              </div>
            </div>
          )}

          {/* ── Step 3 — Refund info ── */}
          {step === 3 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '52px', marginBottom: '12px' }}>✅</div>
                <h2 style={{
                  fontSize: '18px', fontWeight: 800, color: '#3d1f25',
                  fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '8px',
                }}>
                  Order Cancelled
                </h2>
                <p style={{ fontSize: '13px', color: '#8c6468', lineHeight: 1.65, margin: 0 }}>
                  <strong style={{ color: '#3d1f25' }}>{order?.id}</strong> has been successfully cancelled.
                </p>
              </div>

              <div style={{
                background: isCOD ? '#fef9ec' : '#f0fdf4',
                border: `1.5px solid ${isCOD ? '#fde68a' : '#bbf7d0'}`,
                borderRadius: '16px', padding: '16px', marginBottom: '20px',
              }}>
                <div style={{
                  fontSize: '12px', fontWeight: 800,
                  color: isCOD ? '#92400e' : '#16a34a',
                  textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px',
                }}>
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
                      <span style={{ fontSize: '16px', fontWeight: 900, color: '#16a34a' }}>
                        Rs. {order?.total?.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#5a3a40' }}>Refund To</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#3d1f25' }}>
                        {refund.icon} {refund.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px', lineHeight: 1.6 }}>
                      {refund.method}
                    </div>
                    <div style={{
                      background: '#dcfce7', borderRadius: '10px',
                      padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                      <span style={{ fontSize: '18px' }}>⏱</span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d' }}>
                          Expected within {refund.time}
                        </div>
                        <div style={{ fontSize: '11px', color: '#4ade80' }}>
                          Initiated on {new Date().toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div style={{
                background: '#fdf6f0', border: '1px solid #fde8ec',
                borderRadius: '12px', padding: '12px 14px', marginBottom: '20px',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#b76e79', marginBottom: '4px' }}>
                  Need help with your refund?
                </div>
                <div style={{ fontSize: '12px', color: '#8c6468', lineHeight: 1.6 }}>
                  Call <strong style={{ color: '#3d1f25' }}>+977 984-1234567</strong> or email{' '}
                  <strong style={{ color: '#3d1f25' }}>support@glowhive.com</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
                  style={{
                    flex: 1, background: 'linear-gradient(135deg,#b76e79,#c2748a)',
                    color: '#fff', border: 'none', borderRadius: '12px',
                    padding: '13px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  }}>
                  Done
                </motion.button>
                <Link href="/products" onClick={onClose}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#fdf0f3', color: '#b76e79',
                    border: '1px solid #fde8ec', borderRadius: '12px',
                    padding: '13px', fontWeight: 700, fontSize: '13px', textDecoration: 'none',
                  }}>
                  Shop Again 🛍️
                </Link>
              </div>
            </>
          )}

        </motion.div>
      </div>
    </>
  );
}

/* ─── Main page content ─── */
function SuccessContent() {
  const params  = useSearchParams();
  const orderId = params.get('id');

  const [order,           setOrder]           = useState(null);
  const [cancelled,       setCancelled]       = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    try {
      const orders = JSON.parse(localStorage.getItem('glowhive_orders') || '[]');
      const found  = orders.find(o => o.id === orderId);
      setOrder(found || null);
      if (found?.status === 'cancelled') setCancelled(true);
    } catch (_) {}
  }, [orderId]);

  /* Called from modal step 2 after reason is chosen */
  const handleConfirmedCancel = (reason) => {
    try {
      const orders  = JSON.parse(localStorage.getItem('glowhive_orders') || '[]');
      const updated = orders.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'cancelled',
              cancelReason: reason,
              cancelledAt: new Date().toISOString(),
              statusHistory: [
                ...(o.statusHistory || []),
                { status: 'cancelled', label: 'Order Cancelled', time: new Date().toISOString(), reason },
              ],
            }
          : o
      );
      localStorage.setItem('glowhive_orders', JSON.stringify(updated));
      setOrder(prev => ({ ...prev, status: 'cancelled', cancelReason: reason }));
      setCancelled(true);
    } catch (_) {}
  };

  const closeModal = () => setShowCancelModal(false);

  const currentStep = order ? (STATUS_INDEX[order.status] ?? 0) : 0;
  const canCancel   = order && (order.status === 'placed' || order.status === 'picked') && !cancelled;

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>

      {/* Cancel modal */}
      <AnimatePresence>
        {showCancelModal && (
          <CancelModal
            order={order}
            onClose={closeModal}
            onConfirmed={handleConfirmedCancel}
          />
        )}
      </AnimatePresence>

      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '60px 24px 80px' }}>

        {/* ── Confirmation Hero ── */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ textAlign: 'center', marginBottom: '36px' }}
        >
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%',
            background: cancelled
              ? 'linear-gradient(135deg,#f87171,#ef4444)'
              : 'linear-gradient(135deg,#b76e79,#c2748a)',
            margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: cancelled
              ? '0 8px 32px rgba(248,113,113,0.30)'
              : '0 8px 32px rgba(183,110,121,0.30)',
          }}>
            {cancelled
              ? <XCircle size={44} color="#fff" />
              : <CheckCircle size={44} color="#fff" />
            }
          </div>

          <h1 style={{
            fontSize: '30px', fontWeight: 800, color: '#3d1f25',
            fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '10px',
          }}>
            {cancelled ? 'Order Cancelled' : 'Order Confirmed! 🎉'}
          </h1>

          <p style={{ color: '#8c6468', fontSize: '14px', lineHeight: 1.75, marginBottom: '8px' }}>
            {cancelled
              ? 'Your order has been successfully cancelled. If you were charged, a refund will be processed within 3–5 business days.'
              : <>Thank you, <strong style={{ color: '#3d1f25' }}>{order?.profile?.firstName}!</strong> We're excited to get your order to you.</>
            }
          </p>

          {order && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '10px',
              background: '#fff', border: '1px solid #fde8ec', borderRadius: '50px',
              padding: '7px 18px', fontSize: '12px', fontWeight: 700, color: '#b76e79',
            }}>
              <ClipboardList size={13} /> Order ID: {order.id}
            </div>
          )}
        </motion.div>

        {/* ── Tracking Timeline ── */}
        {order && !cancelled && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            style={{
              background: '#fff', border: '1px solid #fde8ec',
              borderRadius: '20px', padding: '24px', marginBottom: '20px',
            }}
          >
            <h2 style={{
              fontSize: '11px', fontWeight: 800, color: '#b76e79',
              textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px',
            }}>
              📍 Order Tracking
            </h2>

            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '19px', top: '24px',
                width: '2px', height: 'calc(100% - 48px)',
                background: '#fde8ec',
              }} />
              <div style={{
                position: 'absolute', left: '19px', top: '24px',
                width: '2px',
                height: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%`,
                background: 'linear-gradient(to bottom,#b76e79,#c2748a)',
                transition: 'height 1s ease',
              }} />

              {TRACKING_STEPS.map((s, i) => {
                const done    = i < currentStep;
                const current = i === currentStep;
                return (
                  <motion.div
                    key={s.key}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i }}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '16px',
                      marginBottom: i < TRACKING_STEPS.length - 1 ? '24px' : 0,
                      position: 'relative',
                    }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0, zIndex: 1,
                      background: done || current
                        ? 'linear-gradient(135deg,#b76e79,#c2748a)'
                        : '#fde8ec',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '15px',
                      boxShadow: current ? '0 0 0 5px rgba(183,110,121,0.15)' : 'none',
                      transition: 'all 0.3s',
                    }}>
                      {done ? <CheckCircle size={18} color="#fff" /> : s.icon}
                    </div>
                    <div style={{ paddingTop: '7px' }}>
                      <div style={{
                        fontSize: '14px', fontWeight: 700,
                        color: done || current ? '#3d1f25' : '#9ca3af',
                        marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '8px',
                      }}>
                        {s.label}
                        {current && (
                          <span style={{
                            fontSize: '10px', background: '#b76e79', color: '#fff',
                            borderRadius: '50px', padding: '2px 9px', fontWeight: 700,
                          }}>
                            In Progress
                          </span>
                        )}
                        {done && (
                          <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 700 }}>
                            ✓ Done
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize: '12px', lineHeight: 1.55,
                        color: done || current ? '#8c6468' : '#d1d5db',
                      }}>
                        {s.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div style={{
              marginTop: '24px',
              background: 'linear-gradient(135deg,#fdf0f3,#fff8f5)',
              border: '1px solid #fde8ec', borderRadius: '14px',
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <Truck size={18} color="#b76e79" />
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Estimated Delivery
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#3d1f25', marginTop: '2px' }}>
                  {order.estimatedDelivery || '3–5 Business Days'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Order Details ── */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            style={{
              background: '#fff', border: '1px solid #fde8ec',
              borderRadius: '20px', padding: '24px', marginBottom: '20px',
            }}
          >
            <h2 style={{
              fontSize: '11px', fontWeight: 800, color: '#b76e79',
              textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px',
            }}>
              Order Details
            </h2>

            <div style={{ marginBottom: '14px' }}>
              {order.items?.map(item => (
                <div key={item.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '13px', marginBottom: '8px',
                }}>
                  <span style={{ color: '#8c6468' }}>
                    {item.name} <strong style={{ color: '#3d1f25' }}>× {item.quantity}</strong>
                  </span>
                  <span style={{ fontWeight: 700, color: '#3d1f25' }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #fde8ec', paddingTop: '12px' }}>
              {[
                ['Subtotal', `Rs. ${order.subtotal?.toLocaleString()}`],
                ['Shipping', order.shipping === 0 ? 'FREE' : `Rs. ${order.shipping}`],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ color: '#8c6468' }}>{l}</span>
                  <span style={{ fontWeight: 600, color: l === 'Shipping' && order.shipping === 0 ? '#22c55e' : '#3d1f25' }}>{v}</span>
                </div>
              ))}
              <div style={{
                borderTop: '2px solid #fde8ec', marginTop: '10px', paddingTop: '10px',
                display: 'flex', justifyContent: 'space-between',
                fontWeight: 800, fontSize: '16px', color: '#3d1f25',
              }}>
                <span>Total Paid</span>
                <span>Rs. {order.total?.toLocaleString()}</span>
              </div>
            </div>

            <div style={{
              marginTop: '14px', background: '#fdf6f0', borderRadius: '12px',
              padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start',
            }}>
              <MapPin size={15} color="#b76e79" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div style={{ fontSize: '13px', color: '#3d1f25', lineHeight: 1.6 }}>
                <strong>Delivering to:</strong> {order.address?.address}, {order.address?.city}, {order.address?.province}
              </div>
            </div>

            <div style={{
              marginTop: '8px', background: '#fdf6f0', borderRadius: '12px',
              padding: '10px 14px', fontSize: '13px', color: '#3d1f25',
            }}>
              💳 <strong>Payment:</strong> {order.paymentName}
            </div>
          </motion.div>
        )}

        {/* ── Support Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          style={{
            background: 'linear-gradient(135deg,#fdf0f3,#fff8f5)',
            border: '1px solid #fde8ec', borderRadius: '20px',
            padding: '24px', marginBottom: '24px',
          }}
        >
          <h2 style={{
            fontSize: '11px', fontWeight: 800, color: '#b76e79',
            textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px',
          }}>
            🌸 Need Help?
          </h2>
          <p style={{ fontSize: '13px', color: '#8c6468', lineHeight: 1.7, marginBottom: '16px' }}>
            Have questions about your order? Our support team is available Monday – Saturday, 10 am – 6 pm.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="tel:+9779841234567" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: '#fff', border: '1px solid #fde8ec', borderRadius: '12px',
              padding: '12px 16px', textDecoration: 'none',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#fde8ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Phone size={15} color="#b76e79" />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1px' }}>Call Us</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#3d1f25' }}>+977 984-1234567</div>
              </div>
            </a>
            <a href="mailto:support@glowhive.com" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: '#fff', border: '1px solid #fde8ec', borderRadius: '12px',
              padding: '12px 16px', textDecoration: 'none',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#fde8ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Mail size={15} color="#b76e79" />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Us</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#3d1f25' }}>support@glowhive.com</div>
              </div>
            </a>
          </div>
        </motion.div>

        {/* ── CTA Buttons ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/orders" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              background: 'linear-gradient(135deg,#b76e79,#c2748a)', color: '#fff',
              padding: '14px 20px', borderRadius: '12px', textDecoration: 'none',
              fontWeight: 700, fontSize: '14px',
              boxShadow: '0 4px 16px rgba(183,110,121,0.25)',
            }}>
              <Package size={15} /> View My Orders
            </Link>
            <Link href="/products" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#fff', color: '#b76e79', border: '1.5px solid #b76e79',
              padding: '14px 20px', borderRadius: '12px', textDecoration: 'none',
              fontWeight: 700, fontSize: '14px',
            }}>
              Continue Shopping
            </Link>
          </div>

          {/* Cancel button — opens modal, never native confirm() */}
          {canCancel && (
            <motion.button
              whileHover={{ background: '#fff5f5', borderColor: '#fca5a5' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCancelModal(true)}
              style={{
                background: '#fff', color: '#ef4444',
                border: '1.5px solid #fecaca', borderRadius: '12px',
                padding: '12px', fontWeight: 700, fontSize: '14px',
                cursor: 'pointer', width: '100%',
              }}
            >
              ✕ Cancel This Order
            </motion.button>
          )}
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#fff8f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '14px', color: '#8c6468' }}>Loading your order… 🌸</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
