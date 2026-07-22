'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, ChevronRight, XCircle, CheckCircle, Truck, AlertCircle, 
  Sparkles, Trash2, RefreshCw, Clock, DollarSign, FileText,
  ArrowLeft, MessageCircle, ThumbsUp, ThumbsDown
} from 'lucide-react';
import Footer from '@/components/Footer';

const RETURN_STATUS_STYLE = {
  pending:    { bg: '#fef9ec', color: '#d97706', label: 'Pending Review', icon: '⏳' },
  approved:   { bg: '#f0fdf4', color: '#22c55e', label: 'Return Approved', icon: '✅' },
  rejected:   { bg: '#fef2f2', color: '#ef4444', label: 'Return Rejected', icon: '❌' },
  processing: { bg: '#eff6ff', color: '#3b82f6', label: 'Processing', icon: '🔄' },
  shipped:    { bg: '#fdf6f0', color: '#b76e79', label: 'Shipped Back', icon: '📦' },
  completed:  { bg: '#f0fdf4', color: '#22c55e', label: 'Refunded', icon: '💵' },
};

const RETURN_REASONS = [
  'Wrong item received',
  'Item is damaged/defective',
  'Not as described',
  'Changed my mind',
  'Size issue',
  'Other',
];

const RETURN_FILTERS = [
  { key: 'all',        label: 'All Returns' },
  { key: 'pending',    label: 'Pending' },
  { key: 'approved',   label: 'Approved' },
  { key: 'processing', label: 'Processing' },
  { key: 'completed',  label: 'Completed' },
  { key: 'rejected',   label: 'Rejected' },
];

export default function ReturnsPage() {
  const [returns, setReturns] = useState([]);
  const [expandedReturn, setExpandedReturn] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnOther, setReturnOther] = useState('');
  const [returnNotes, setReturnNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load returns from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('glowhive_returns') || '[]');
      setReturns(saved);
    } catch (_) {}
  }, []);

  // Load orders for the return modal
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('glowhive_orders') || '[]');
      // Only show delivered orders that can be returned (within 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const eligible = saved.filter(o => 
        o.status === 'delivered' && 
        new Date(o.date) > thirtyDaysAgo &&
        !returns.some(r => r.orderId === o.id)
      );
      setOrders(eligible);
    } catch (_) {}
  }, [returns]);

  const openReturnModal = (order) => {
    setSelectedOrder(order);
    setReturnReason('');
    setReturnOther('');
    setReturnNotes('');
    setShowReturnModal(true);
  };

  const closeReturnModal = () => {
    setShowReturnModal(false);
    setSelectedOrder(null);
    setReturnReason('');
    setReturnOther('');
    setReturnNotes('');
  };

  const submitReturn = () => {
    const finalReason = returnReason === 'Other' ? returnOther.trim() : returnReason;
    if (!finalReason) {
      toast.error('Please select a return reason.');
      return;
    }

    setSubmitting(true);

    const newReturn = {
      id: `RET-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      orderId: selectedOrder.id,
      orderDate: selectedOrder.date,
      items: selectedOrder.items,
      total: selectedOrder.total,
      reason: finalReason,
      notes: returnNotes.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      returnMethod: 'pickup', // or 'dropoff'
      refundAmount: selectedOrder.total,
      trackingNumber: null,
    };

    const updatedReturns = [...returns, newReturn];
    setReturns(updatedReturns);
    localStorage.setItem('glowhive_returns', JSON.stringify(updatedReturns));

    // Update the order status to 'return_requested'
    const updatedOrders = orders.map(o => {
      if (o.id === selectedOrder.id) {
        return { ...o, status: 'return_requested' };
      }
      return o;
    });
    localStorage.setItem('glowhive_orders', JSON.stringify(updatedOrders));

    setSubmitting(false);
    closeReturnModal();
    toast.success('Return request submitted successfully! We\'ll review it shortly.');
  };

  const filtered = filterStatus === 'all' 
    ? returns 
    : returns.filter(r => r.status === filterStatus);

  // Get status style for a return
  const getStatusStyle = (status) => {
    return RETURN_STATUS_STYLE[status] || RETURN_STATUS_STYLE.pending;
  };

  // Get days since order
  const getDaysSince = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#fdf6f0', paddingBottom: '60px' }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #3d1f25 0%, #b76e79 60%, #e8a4b0 100%)',
          padding: '60px 28px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <RefreshCw size={18} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '3px', textTransform: 'uppercase' }}>
                Returns & Refunds
              </span>
              <RefreshCw size={18} color="rgba(255,255,255,0.8)" />
            </div>
            <h1 style={{ fontSize: '44px', fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '12px' }}>
              My Returns
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px', margin: '0 auto' }}>
              Track and manage your return requests. We're here to help!
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginTop: '28px', flexWrap: 'wrap' }}>
              {[
                { value: returns.length, label: 'Total Returns' },
                { value: returns.filter(r => r.status === 'pending' || r.status === 'processing').length, label: 'Active Returns' },
                { value: returns.filter(r => r.status === 'completed').length, label: 'Refunded' },
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

          {/* Back to Orders */}
          <Link href="/orders" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ x: -4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '12px 0', color: '#8c6468', fontSize: '13px', fontWeight: 600,
              }}
            >
              <ArrowLeft size={16} /> Back to Orders
            </motion.div>
          </Link>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 0 16px', scrollbarWidth: 'none' }}>
            {RETURN_FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilterStatus(f.key)}
                style={{ 
                  whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '50px', 
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer', 
                  border: `1.5px solid ${filterStatus === f.key ? '#b76e79' : '#fde8ec'}`, 
                  background: filterStatus === f.key ? '#b76e79' : '#fff', 
                  color: filterStatus === f.key ? '#fff' : '#3d1f25', 
                  transition: 'all 0.2s' 
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Eligible Orders for Return */}
          {orders.length > 0 && (
            <div style={{ 
              background: 'linear-gradient(135deg, #fdf0f3, #fff8f5)',
              border: '1.5px dashed #b76e79',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <RefreshCw size={18} color="#b76e79" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#3d1f25' }}>
                  Eligible for Return
                </span>
                <span style={{ 
                  fontSize: '11px', 
                  background: '#b76e79', 
                  color: '#fff', 
                  padding: '2px 10px', 
                  borderRadius: '50px',
                  fontWeight: 700,
                }}>
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#8c6468', marginBottom: '10px' }}>
                You can request a return within 30 days of delivery.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {orders.slice(0, 3).map(order => (
                  <motion.button
                    key={order.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openReturnModal(order)}
                    style={{
                      padding: '6px 14px',
                      background: '#b76e79',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {order.id}
                  </motion.button>
                ))}
                {orders.length > 3 && (
                  <span style={{ fontSize: '11px', color: '#8c6468', padding: '6px 0' }}>
                    +{orders.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '14px' }}>🔄</div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginBottom: '8px' }}>
                No return requests yet
              </p>
              <p style={{ fontSize: '13px', color: '#8c6468', marginBottom: '24px' }}>
                Need to return an item? Start a return from your orders page.
              </p>
              <Link href="/orders" style={{ 
                background: 'linear-gradient(135deg,#b76e79,#c2748a)', 
                color: '#fff', 
                padding: '12px 28px', 
                borderRadius: '50px', 
                textDecoration: 'none', 
                fontWeight: 700, 
                fontSize: '14px' 
              }}>
                View Orders
              </Link>
            </div>
          )}

          {/* Return cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((returnItem) => {
                const st = getStatusStyle(returnItem.status);
                const isOpen = expandedReturn === returnItem.id;
                const daysSince = getDaysSince(returnItem.createdAt);
                const order = orders.find(o => o.id === returnItem.orderId);

                return (
                  <motion.div
                    key={returnItem.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, scale: 0.97 }}
                    transition={{ duration: 0.22 }}
                    style={{ 
                      background: '#fff', 
                      border: `1px solid ${st.color}33`, 
                      borderRadius: '20px', 
                      overflow: 'hidden', 
                      boxShadow: '0 2px 12px rgba(183,110,121,0.07)' 
                    }}
                  >
                    {/* Card header */}
                    <div style={{ padding: '18px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#3d1f25' }}>{returnItem.id}</span>
                            <span style={{ 
                              fontSize: '11px', fontWeight: 700, 
                              background: st.bg, color: st.color, 
                              padding: '3px 10px', borderRadius: '50px', 
                              border: `1px solid ${st.color}33` 
                            }}>
                              {st.icon} {st.label}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#8c6468' }}>
                            {new Date(returnItem.createdAt).toLocaleDateString('en-NP', { month: 'long', day: 'numeric', year: 'numeric' })}
                            {' · '}{returnItem.items?.length} {returnItem.items?.length === 1 ? 'item' : 'items'}
                            {' · '}<strong style={{ color: '#3d1f25' }}>Rs. {returnItem.refundAmount?.toLocaleString()}</strong>
                          </div>
                          {daysSince <= 7 && (
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: '#d97706',
                              background: '#fef9ec',
                              padding: '2px 8px',
                              borderRadius: '50px',
                              display: 'inline-block',
                              marginTop: '4px',
                            }}>
                              New
                            </span>
                          )}
                        </div>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setExpandedReturn(isOpen ? null : returnItem.id)}
                          style={{ 
                            background: '#fdf6f0', border: '1px solid #fde8ec', 
                            borderRadius: '50%', width: '34px', height: '34px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            cursor: 'pointer', flexShrink: 0 
                          }}
                        >
                          <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronRight size={15} color="#b76e79" />
                          </motion.span>
                        </motion.button>
                      </div>

                      {/* Items preview chips */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {returnItem.items?.slice(0, 3).map((item, i) => (
                          <div key={i} style={{ 
                            background: '#fdf6f0', borderRadius: '10px', 
                            padding: '6px 10px', fontSize: '11px', 
                            color: '#5a3a40', fontWeight: 600 
                          }}>
                            {item.name} ×{item.quantity}
                          </div>
                        ))}
                        {returnItem.items?.length > 3 && (
                          <div style={{ background: '#fdf6f0', borderRadius: '10px', padding: '6px 10px', fontSize: '11px', color: '#8c6468' }}>
                            +{returnItem.items.length - 3} more
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href={`/orders`}
                          style={{ 
                            flex: 1, textAlign: 'center', fontSize: '12px', 
                            fontWeight: 700, color: '#b76e79', textDecoration: 'none', 
                            background: '#fdf0f3', border: '1px solid #fde8ec', 
                            borderRadius: '50px', padding: '9px 12px' 
                          }}>
                          View Order
                        </Link>
                        {returnItem.status === 'rejected' && (
                          <button
                            onClick={() => {
                              // Re-open return request
                              const updatedReturns = returns.map(r => {
                                if (r.id === returnItem.id) {
                                  return { ...r, status: 'pending', updatedAt: new Date().toISOString() };
                                }
                                return r;
                              });
                              setReturns(updatedReturns);
                              localStorage.setItem('glowhive_returns', JSON.stringify(updatedReturns));
                              toast.success('Return request reopened for review.');
                            }}
                            style={{
                              flex: 1,
                              fontSize: '12px',
                              fontWeight: 700,
                              color: '#b76e79',
                              background: '#fff',
                              border: '1px solid #b76e79',
                              borderRadius: '50px',
                              padding: '9px 12px',
                              cursor: 'pointer',
                            }}
                          >
                            Re-request Return
                          </button>
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
                            
                            {/* Return Status Timeline */}
                            <div style={{ marginBottom: '16px' }}>
                              <p style={{ fontSize: '11px', fontWeight: 800, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                                📋 Return Status
                              </p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {[
                                  { label: 'Return Request Submitted', done: true, time: returnItem.createdAt },
                                  { label: 'Reviewed by Our Team', done: returnItem.status !== 'pending' && returnItem.status !== 'rejected', time: returnItem.updatedAt },
                                  { label: 'Return Approved', done: returnItem.status === 'approved' || returnItem.status === 'processing' || returnItem.status === 'completed', time: returnItem.updatedAt },
                                  { label: 'Item Shipped Back', done: returnItem.status === 'shipped' || returnItem.status === 'completed', time: returnItem.updatedAt },
                                  { label: 'Refund Processed', done: returnItem.status === 'completed', time: returnItem.updatedAt },
                                ].map((step, i) => (
                                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                      width: '28px',
                                      height: '28px',
                                      borderRadius: '50%',
                                      flexShrink: 0,
                                      background: step.done ? '#22c55e' : '#e5e7eb',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                      {step.done ? <CheckCircle size={14} color="#fff" /> : <Clock size={14} color="#9ca3af" />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: '13px', fontWeight: step.done ? 700 : 400, color: step.done ? '#15803d' : '#9ca3af' }}>
                                        {step.label}
                                      </div>
                                      {step.time && step.done && (
                                        <div style={{ fontSize: '10px', color: '#6b7280' }}>
                                          {new Date(step.time).toLocaleDateString('en-NP', { month: 'short', day: 'numeric' })}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Return Details */}
                            <div style={{ 
                              display: 'grid', 
                              gridTemplateColumns: '1fr 1fr', 
                              gap: '10px',
                              marginBottom: '12px',
                            }}>
                              <div style={{ background: '#fff', borderRadius: '10px', padding: '10px 12px', border: '1px solid #fde8ec' }}>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  Reason
                                </div>
                                <div style={{ fontSize: '13px', color: '#3d1f25', marginTop: '2px' }}>
                                  {returnItem.reason}
                                </div>
                              </div>
                              <div style={{ background: '#fff', borderRadius: '10px', padding: '10px 12px', border: '1px solid #fde8ec' }}>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  Refund Amount
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 800, color: '#22c55e', marginTop: '2px' }}>
                                  Rs. {returnItem.refundAmount?.toLocaleString()}
                                </div>
                              </div>
                            </div>

                            {returnItem.notes && (
                              <div style={{ 
                                background: '#fff', 
                                borderRadius: '10px', 
                                padding: '10px 12px', 
                                border: '1px solid #fde8ec',
                                marginBottom: '12px',
                              }}>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  Additional Notes
                                </div>
                                <div style={{ fontSize: '13px', color: '#5a3a40', marginTop: '2px' }}>
                                  {returnItem.notes}
                                </div>
                              </div>
                            )}

                            {/* Support buttons */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <a href="tel:+9779841234567" style={{ 
                                flex: 1, display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', gap: '6px', fontSize: '12px', 
                                fontWeight: 700, color: '#b76e79', textDecoration: 'none', 
                                background: '#fff', border: '1px solid #fde8ec', 
                                borderRadius: '50px', padding: '9px' 
                              }}>
                                📞 Call Support
                              </a>
                              <a href="mailto:support@glowhive.com" style={{ 
                                flex: 1, display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', gap: '6px', fontSize: '12px', 
                                fontWeight: 700, color: '#b76e79', textDecoration: 'none', 
                                background: '#fff', border: '1px solid #fde8ec', 
                                borderRadius: '50px', padding: '9px' 
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

        {/* ══════════════════════════════════
            RETURN REQUEST MODAL
        ══════════════════════════════════ */}
        <AnimatePresence>
          {showReturnModal && selectedOrder && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeReturnModal}
                style={{ 
                  position: 'fixed', inset: 0, 
                  background: 'rgba(61,31,37,0.55)', 
                  backdropFilter: 'blur(6px)', 
                  zIndex: 9000 
                }}
              />

              <div style={{ 
                position: 'fixed', inset: 0, zIndex: 9001, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                padding: '16px', pointerEvents: 'none' 
              }}>
                <motion.div
                  initial={{ scale: 0.88, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.88, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                  style={{ 
                    background: '#fff', borderRadius: '24px', padding: '28px', 
                    width: 'min(460px, 92vw)', 
                    boxShadow: '0 32px 80px rgba(61,31,37,0.28)', 
                    maxHeight: '90vh', overflowY: 'auto', 
                    pointerEvents: 'auto' 
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ 
                      width: '60px', height: '60px', borderRadius: '50%', 
                      background: '#fef1f4', margin: '0 auto 14px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      <RefreshCw size={28} color="#b76e79" />
                    </div>
                    <h2 style={{ 
                      fontSize: '18px', fontWeight: 800, color: '#3d1f25', 
                      fontFamily: "'Playfair Display', Georgia, serif", 
                      marginBottom: '8px' 
                    }}>
                      Request a Return
                    </h2>
                    <p style={{ fontSize: '13px', color: '#8c6468', lineHeight: 1.65, margin: 0 }}>
                      {selectedOrder.id} — {new Date(selectedOrder.date).toLocaleDateString('en-NP', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div style={{ 
                    background: '#fdf6f0', borderRadius: '12px', padding: '12px 14px', 
                    marginBottom: '16px' 
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                      Order Summary
                    </div>
                    {selectedOrder.items?.slice(0, 3).map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span style={{ color: '#5a3a40' }}>{item.name} ×{item.quantity}</span>
                        <span style={{ fontWeight: 700, color: '#3d1f25' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{ 
                      borderTop: '1px solid #fde8ec', marginTop: '8px', 
                      paddingTop: '8px', display: 'flex', justifyContent: 'space-between', 
                      fontWeight: 800, fontSize: '14px', color: '#3d1f25' 
                    }}>
                      <span>Total</span>
                      <span>Rs. {selectedOrder.total?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Return Reason */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ 
                      display: 'block', fontSize: '12px', fontWeight: 700, 
                      color: '#3d1f25', marginBottom: '6px' 
                    }}>
                      Return Reason *
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {RETURN_REASONS.map(reason => (
                        <div 
                          key={reason} 
                          onClick={() => setReturnReason(reason)}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: '12px', 
                            padding: '10px 14px', borderRadius: '12px', 
                            border: `1.5px solid ${returnReason === reason ? '#b76e79' : '#fde8ec'}`, 
                            background: returnReason === reason ? '#fef5f7' : '#fff', 
                            cursor: 'pointer', transition: 'all 0.15s' 
                          }}
                        >
                          <div style={{ 
                            width: '17px', height: '17px', borderRadius: '50%', 
                            flexShrink: 0, 
                            border: `2px solid ${returnReason === reason ? '#b76e79' : '#d1d5db'}`, 
                            background: returnReason === reason ? '#b76e79' : '#fff', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                          }}>
                            {returnReason === reason && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                          </div>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: returnReason === reason ? 700 : 500, 
                            color: '#3d1f25' 
                          }}>
                            {reason}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {returnReason === 'Other' && (
                    <textarea
                      value={returnOther}
                      onChange={e => setReturnOther(e.target.value)}
                      placeholder="Please tell us more… (required)"
                      rows={3}
                      style={{ 
                        width: '100%', padding: '12px 14px', fontFamily: 'inherit', 
                        border: '1.5px solid #fde8ec', borderRadius: '12px', 
                        fontSize: '13px', outline: 'none', resize: 'none', 
                        color: '#3d1f25', background: '#fdf6f0', 
                        boxSizing: 'border-box', marginBottom: '14px' 
                      }}
                    />
                  )}

                  {/* Additional Notes */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', fontSize: '12px', fontWeight: 700, 
                      color: '#3d1f25', marginBottom: '6px' 
                    }}>
                      Additional Notes <span style={{ color: '#8c6468', fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <textarea
                      value={returnNotes}
                      onChange={e => setReturnNotes(e.target.value)}
                      placeholder="Any additional details about your return…"
                      rows={2}
                      style={{ 
                        width: '100%', padding: '12px 14px', fontFamily: 'inherit', 
                        border: '1.5px solid #fde8ec', borderRadius: '12px', 
                        fontSize: '13px', outline: 'none', resize: 'none', 
                        color: '#3d1f25', background: '#fdf6f0', 
                        boxSizing: 'border-box' 
                      }}
                    />
                  </div>

                  {/* Return Policy Note */}
                  <div style={{ 
                    background: '#fdf6f0', border: '1px solid #fde8ec', 
                    borderRadius: '10px', padding: '10px 14px', marginBottom: '16px' 
                  }}>
                    <p style={{ fontSize: '11px', color: '#8c6468', lineHeight: 1.6, margin: 0 }}>
                      💡 <strong>Return Policy:</strong> Returns must be initiated within 30 days of delivery. 
                      Items must be unused and in original packaging. Refunds are processed within 3-5 business days after approval.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <motion.button 
                      whileTap={{ scale: 0.97 }} 
                      onClick={closeReturnModal}
                      style={{ 
                        flex: 1, background: '#fff', color: '#3d1f25', 
                        border: '1.5px solid #fde8ec', borderRadius: '12px', 
                        padding: '13px', fontWeight: 700, fontSize: '14px', 
                        cursor: 'pointer' 
                      }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={submitReturn}
                      disabled={!returnReason || (returnReason === 'Other' && !returnOther.trim()) || submitting}
                      style={{
                        flex: 2,
                        background: (!returnReason || (returnReason === 'Other' && !returnOther.trim()) || submitting) 
                          ? '#fde8ec' 
                          : 'linear-gradient(135deg, #b76e79, #c2748a)',
                        color: (!returnReason || (returnReason === 'Other' && !returnOther.trim()) || submitting) 
                          ? '#8c6468' 
                          : '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '13px',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: (!returnReason || (returnReason === 'Other' && !returnOther.trim()) || submitting) 
                          ? 'not-allowed' 
                          : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      {submitting ? (
                        <>
                          <span style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid #fff',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                          }} />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={16} /> Submit Return
                        </>
                      )}
                    </motion.button>
                  </div>

                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

      </div>
      <Footer />

      {/* Add spin animation */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}