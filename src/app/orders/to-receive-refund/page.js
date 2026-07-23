'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Package, Trash2, ShoppingBag, AlertTriangle, RefreshCw, CheckCircle, Clock, CreditCard, Wallet, Banknote, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const REFUND_STATUSES = {
  pending: { label: 'Refund Initiated', color: '#f59e0b', bg: '#fef9ec', icon: <Clock size={14} color="#f59e0b" /> },
  processing: { label: 'Being Processed', color: '#3b82f6', bg: '#eff6ff', icon: <RefreshCw size={14} color="#3b82f6" /> },
  completed: { label: 'Refund Received', color: '#22c55e', bg: '#f0fdf4', icon: <CheckCircle size={14} color="#22c55e" /> },
};

const REFUND_METHOD_ICONS = {
  esewa: <Wallet size={14} color="#10b981" />,
  khalti: <Wallet size={14} color="#8b5cf6" />,
  bank: <Banknote size={14} color="#3b82f6" />,
  cod: <CreditCard size={14} color="#6b7280" />,
};

const REFUND_METHOD_LABELS = {
  esewa: 'eSewa Wallet',
  khalti: 'Khalti Wallet',
  bank: 'Bank Transfer',
  cod: 'Cash on Delivery',
};

function RefundCard({ refund, onDelete, onMarkReceived }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const status = REFUND_STATUSES[refund.status] || REFUND_STATUSES.pending;
  const methodIcon = REFUND_METHOD_ICONS[refund.paymentMethod] || REFUND_METHOD_ICONS.cod;
  const methodLabel = REFUND_METHOD_LABELS[refund.paymentMethod] || refund.paymentMethod || 'Unknown';

  const handleDelete = () => {
    onDelete(refund.id);
    setShowDeleteConfirm(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, scale: 0.95 }}
      style={{
        background: '#fff',
        borderRadius: 'clamp(16px, 1.8vw, 20px)',
        border: '1px solid #f9e4ea',
        overflow: 'hidden',
      }}
      className="refund-card"
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #fdf8f4, #fff)',
        padding: 'clamp(12px, 1.2vw, 14px) clamp(16px, 1.8vw, 20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f9e4ea',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ 
              fontSize: 'clamp(13px, 1.3vw, 14px)', 
              fontWeight: 800, 
              color: '#1a0a0f' 
            }} className="refund-id">
              Refund #{refund.id?.slice(-6) || 'N/A'}
            </span>
            <span style={{
              fontSize: 'clamp(10px, 1vw, 11px)',
              fontWeight: 700,
              background: status.bg,
              color: status.color,
              padding: 'clamp(2px, 0.3vw, 3px) clamp(8px, 1vw, 12px)',
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              {status.icon}
              {status.label}
            </span>
          </div>
          <div style={{
            fontSize: 'clamp(10px, 1vw, 11px)',
            color: '#888',
            marginTop: '4px',
          }}>
            {refund.orderId ? `Order: ${refund.orderId}` : 'Cancelled Order'} · {new Date(refund.createdAt).toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        {refund.status === 'completed' && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
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
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 'clamp(14px, 1.5vw, 16px) clamp(16px, 1.8vw, 20px)' }}>
        {/* Refund Amount */}
        <div style={{
          background: '#fdf8f4',
          borderRadius: '12px',
          padding: 'clamp(10px, 1vw, 12px) clamp(12px, 1.2vw, 16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 'clamp(14px, 1.4vw, 16px)' }}>💰</span>
            <span style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', fontWeight: 600, color: '#555' }}>Refund Amount</span>
          </div>
          <span style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', fontWeight: 800, color: '#16a34a' }}>
            Rs. {refund.amount?.toLocaleString() || '0'}
          </span>
        </div>

        {/* Refund Method */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: 'clamp(8px, 0.8vw, 10px) 0',
          marginBottom: '10px',
        }}>
          <div style={{
            width: 'clamp(32px, 3vw, 36px)',
            height: 'clamp(32px, 3vw, 36px)',
            borderRadius: '50%',
            background: '#f9f9f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {methodIcon}
          </div>
          <div>
            <div style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', fontWeight: 700, color: '#1a0a0f' }}>
              {methodLabel}
            </div>
            <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', color: '#888' }}>
              {refund.methodDetails || 'Refund will be sent to your account'}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ marginTop: '14px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            marginBottom: '10px',
          }}>
            <span style={{ fontSize: 'clamp(10px, 1vw, 11px)', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Refund Progress
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              top: '14px', 
              left: '14px', 
              right: '14px', 
              height: '2px', 
              background: '#f9e4ea', 
              zIndex: 0 
            }} />
            
            {['pending', 'processing', 'completed'].map((stepKey, idx) => {
              const stepStatus = REFUND_STATUSES[stepKey];
              const isDone = refund.status === 'completed' || 
                            (refund.status === 'processing' && stepKey !== 'completed') ||
                            (refund.status === 'pending' && stepKey === 'pending');
              const isActive = refund.status === stepKey;
              
              return (
                <div key={stepKey} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: idx === 0 ? 'flex-start' : idx === 2 ? 'flex-end' : 'center',
                  position: 'relative',
                  zIndex: 2,
                }}>
                  <div style={{
                    width: 'clamp(24px, 2.5vw, 28px)',
                    height: 'clamp(24px, 2.5vw, 28px)',
                    borderRadius: '50%',
                    background: isDone ? 'linear-gradient(135deg, #16a34a, #22c55e)' : '#fff',
                    border: `2px solid ${isDone ? '#16a34a' : '#f9e4ea'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isActive ? '0 0 0 4px rgba(34,197,94,0.15)' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {isDone ? (
                      <CheckCircle size={12} color="#fff" />
                    ) : (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f9e4ea' }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: 'clamp(8px, 0.9vw, 9px)',
                    fontWeight: isActive ? 800 : 600,
                    marginTop: '6px',
                    textAlign: 'center',
                    color: isActive ? '#16a34a' : isDone ? '#1a0a0f' : '#ccc',
                  }}>
                    {stepStatus?.label || stepKey}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Progress Bar */}
          <div style={{
            marginTop: '12px',
            height: '4px',
            background: '#f9e4ea',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${refund.status === 'completed' ? 100 : refund.status === 'processing' ? 50 : 10}%`,
              background: 'linear-gradient(90deg, #16a34a, #22c55e)',
              borderRadius: '4px',
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>

        {/* Expected Time */}
        <div style={{
          marginTop: '14px',
          background: '#fdf8f4',
          borderRadius: '10px',
          padding: 'clamp(8px, 0.8vw, 10px) clamp(12px, 1.2vw, 14px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: 'clamp(14px, 1.4vw, 16px)' }}>⏱</span>
          <div>
            <div style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', fontWeight: 600, color: '#555' }}>
              {refund.status === 'completed' 
                ? 'Refund received on ' + new Date(refund.completedAt || refund.updatedAt).toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })
                : `Expected within ${refund.expectedTime || '3–5 business days'}`
              }
            </div>
            {refund.status !== 'completed' && (
              <div style={{ fontSize: 'clamp(10px, 1vw, 11px)', color: '#888' }}>
                Initiated on {new Date(refund.createdAt).toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            )}
          </div>
        </div>

        {/* Mark as Received Button (for completed refunds) */}
        {refund.status === 'completed' && (
          <button
            onClick={onMarkReceived}
            style={{
              width: '100%',
              marginTop: '14px',
              padding: 'clamp(10px, 1.2vw, 12px)',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: 'clamp(12px, 1.2vw, 13px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <CheckCircle size={16} />
            Mark as Received
          </button>
        )}

        {/* Show note if order was deleted */}
        {refund.orderDeleted && (
          <div style={{
            marginTop: '12px',
            background: '#fef9ec',
            border: '1px solid #fde68a',
            borderRadius: '10px',
            padding: 'clamp(8px, 0.8vw, 10px) clamp(12px, 1.2vw, 14px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: 'clamp(14px, 1.4vw, 16px)' }}>ℹ️</span>
            <span style={{ fontSize: 'clamp(11px, 1.1vw, 12px)', color: '#92400e' }}>
              Order was deleted from history, but refund is still being processed.
            </span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
              padding: '20px',
            }}
            onClick={() => setShowDeleteConfirm(false)}
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
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: 'clamp(38px, 4vw, 44px)', height: 'clamp(38px, 4vw, 44px)', borderRadius: '50%', background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriangle size={18} color="#dc2626" />
                </div>
                <h3 style={{ fontSize: 'clamp(14px, 1.4vw, 16px)', fontWeight: 800, color: '#1a0a0f' }}>Delete Refund Record?</h3>
              </div>
              <p style={{ fontSize: 'clamp(13px, 1.2vw, 14px)', color: '#666', lineHeight: 1.6, marginBottom: '22px' }}>
                This refund record will be removed from your history permanently.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: 'clamp(10px, 1vw, 11px)', background: '#fdf8f4', border: '1.5px solid #f9e4ea', borderRadius: '12px', fontWeight: 700, color: '#888', cursor: 'pointer', fontSize: 'clamp(13px, 1.2vw, 14px)' }}>Cancel</button>
                <button onClick={handleDelete} style={{ flex: 1, padding: 'clamp(10px, 1vw, 11px)', background: 'linear-gradient(135deg,#dc2626,#b91c1c)', border: 'none', borderRadius: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontSize: 'clamp(13px, 1.2vw, 14px)' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ToReceiveRefundPage() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();
  const [refunds, setRefunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRefunds = () => {
    setIsLoading(true);
    try {
      // First, get saved refunds from localStorage (these persist even if orders are deleted)
      const savedRefunds = JSON.parse(localStorage.getItem('glowhive_refunds') || '[]');
      
      // Get all orders from localStorage
      const allOrders = JSON.parse(localStorage.getItem('glowhive_orders') || '[]');
      
      // Find cancelled orders that need refunds (non-COD)
      const cancelledOrders = allOrders.filter(o => 
        o.status === 'cancelled' && 
        o.paymentMethod !== 'cod' && 
        o.paymentMethod // Has a payment method
      );
      
      // Create refund records from cancelled orders
      const orderRefunds = cancelledOrders.map(order => ({
        id: `refund_${order.id}`,
        orderId: order.id,
        amount: order.total || 0,
        paymentMethod: order.paymentMethod || 'esewa',
        methodDetails: order.paymentMethod === 'esewa' ? 'eSewa Wallet' :
                       order.paymentMethod === 'khalti' ? 'Khalti Wallet' :
                       order.paymentMethod === 'bank' ? 'Bank Transfer' : 'Unknown',
        status: order.refundStatus || 'pending',
        createdAt: order.cancelledAt || order.date || new Date().toISOString(),
        updatedAt: order.refundUpdatedAt || order.cancelledAt || order.date || new Date().toISOString(),
        completedAt: order.refundCompletedAt || null,
        expectedTime: order.paymentMethod === 'esewa' ? '1–3 business days' :
                     order.paymentMethod === 'khalti' ? '1–3 business days' :
                     order.paymentMethod === 'bank' ? '3–5 business days' : '3–5 business days',
        orderDeleted: false,
        originalOrder: order,
      }));
      
      // Merge: combine saved refunds with order refunds, but keep saved refunds that don't exist in orders
      // Also, if a saved refund has the same ID as an order refund, use the saved one (it may have more up-to-date status)
      const refundMap = new Map();
      
      // First add all saved refunds
      savedRefunds.forEach(refund => {
        refundMap.set(refund.id, refund);
      });
      
      // Then add/update with order refunds
      orderRefunds.forEach(refund => {
        // If this refund already exists in saved refunds, keep the saved one
        // unless the saved one is completed and the order one is pending
        const existing = refundMap.get(refund.id);
        if (existing) {
          // If the existing refund is completed, keep it
          // Otherwise, update with order data (which might have newer status)
          if (existing.status !== 'completed') {
            refundMap.set(refund.id, {
              ...refund,
              status: existing.status || refund.status,
              completedAt: existing.completedAt || refund.completedAt,
              updatedAt: existing.updatedAt || refund.updatedAt,
            });
          }
        } else {
          refundMap.set(refund.id, refund);
        }
      });
      
      // Convert map back to array
      let allRefunds = Array.from(refundMap.values());
      
      // Sort by date (newest first)
      allRefunds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Check which refunds have their orders deleted
      const orderIds = new Set(allOrders.map(o => o.id));
      allRefunds = allRefunds.map(refund => {
        if (!orderIds.has(refund.orderId) && refund.orderId) {
          return { ...refund, orderDeleted: true };
        }
        return refund;
      });
      
      setRefunds(allRefunds);
      
      // Save refunds back to localStorage to persist
      localStorage.setItem('glowhive_refunds', JSON.stringify(allRefunds));
      
    } catch (error) {
      console.error('Error loading refunds:', error);
      setRefunds([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) { router.replace('/account'); return; }
    loadRefunds();
  }, [hydrated, isAuthenticated]);

  // Listen for order updates
  useEffect(() => {
    const handleUpdate = () => loadRefunds();
    window.addEventListener('ordersUpdated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'glowhive_orders' || e.key === 'glowhive_refunds') {
        loadRefunds();
      }
    });
    return () => {
      window.removeEventListener('ordersUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleDeleteRefund = (refundId) => {
    // Remove from state
    const updatedRefunds = refunds.filter(r => r.id !== refundId);
    setRefunds(updatedRefunds);
    
    // Save to localStorage (so it stays deleted)
    localStorage.setItem('glowhive_refunds', JSON.stringify(updatedRefunds));
  };

  const handleMarkReceived = (refundId) => {
    const updatedRefunds = refunds.map(r => {
      if (r.id === refundId) {
        const updated = {
          ...r,
          status: 'completed',
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Also update the original order if it exists
        if (r.originalOrder) {
          const allOrders = JSON.parse(localStorage.getItem('glowhive_orders') || '[]');
          const updatedOrders = allOrders.map(o => {
            if (o.id === r.orderId) {
              return {
                ...o,
                refundStatus: 'completed',
                refundCompletedAt: new Date().toISOString(),
                refundUpdatedAt: new Date().toISOString(),
              };
            }
            return o;
          });
          localStorage.setItem('glowhive_orders', JSON.stringify(updatedOrders));
        }
        
        return updated;
      }
      return r;
    });
    
    setRefunds(updatedRefunds);
    localStorage.setItem('glowhive_refunds', JSON.stringify(updatedRefunds));
  };

  if (!hydrated) return (
    <div style={{ minHeight: '100vh', background: '#fdf8f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#f43f68', fontWeight: 600, fontSize: 'clamp(14px, 1.3vw, 15px)' }}>Loading…</p>
    </div>
  );

  // Count refunds by status
  const pendingCount = refunds.filter(r => r.status === 'pending').length;
  const processingCount = refunds.filter(r => r.status === 'processing').length;
  const completedCount = refunds.filter(r => r.status === 'completed').length;

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
                  <RefreshCw size={18} color="#5b8dd9" />
                </div>
                <div>
                  <h1 style={{
                    fontSize: 'clamp(18px, 2.2vw, 22px)',
                    fontWeight: 800,
                    color: '#1a0a0f',
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}>To Receive Refund</h1>
                  <p style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#888', marginTop: '2px' }}>
                    Track your refunds from cancelled orders
                  </p>
                </div>
              </div>
              
              <Link href="/orders" style={{ textDecoration: 'none' }}>
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
                  <Package size={12} />
                  View Orders
                </motion.div>
              </Link>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', padding: 'clamp(16px, 2vw, 28px) clamp(12px, 2vw, 20px)' }}>
          
          {/* Stats */}
          {refunds.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(6px, 0.8vw, 10px)',
              marginBottom: 'clamp(16px, 2vh, 24px)',
            }}>
              <div style={{
                background: '#fff',
                border: '1px solid #f9e4ea',
                borderRadius: '12px',
                padding: 'clamp(10px, 1.2vw, 12px)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', fontWeight: 800, color: '#f59e0b' }}>{pendingCount + processingCount}</div>
                <div style={{ fontSize: 'clamp(9px, 0.9vw, 10px)', color: '#888', fontWeight: 600 }}>In Progress</div>
              </div>
              <div style={{
                background: '#fff',
                border: '1px solid #f9e4ea',
                borderRadius: '12px',
                padding: 'clamp(10px, 1.2vw, 12px)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', fontWeight: 800, color: '#22c55e' }}>{completedCount}</div>
                <div style={{ fontSize: 'clamp(9px, 0.9vw, 10px)', color: '#888', fontWeight: 600 }}>Completed</div>
              </div>
              <div style={{
                background: '#fff',
                border: '1px solid #f9e4ea',
                borderRadius: '12px',
                padding: 'clamp(10px, 1.2vw, 12px)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', fontWeight: 800, color: '#1a0a0f' }}>{refunds.length}</div>
                <div style={{ fontSize: 'clamp(9px, 0.9vw, 10px)', color: '#888', fontWeight: 600 }}>Total</div>
              </div>
            </div>
          )}

          {refunds.length === 0 ? (
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
                <RefreshCw size={28} color="#5b8dd9" />
              </div>
              <h2 style={{
                fontSize: 'clamp(16px, 1.8vw, 18px)',
                fontWeight: 800,
                color: '#1a0a0f',
                marginBottom: '8px',
                fontFamily: "'Playfair Display', Georgia, serif",
              }}>No refunds to track</h2>
              <p style={{ fontSize: 'clamp(13px, 1.2vw, 14px)', color: '#888', marginBottom: '28px' }}>
                Refunds from cancelled orders will appear here automatically.
              </p>
              <button
                onClick={() => router.push('/orders')}
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
                <Package size={14} /> View Orders
              </button>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <AnimatePresence mode="popLayout">
                {refunds.map((refund) => (
                  <RefundCard
                    key={refund.id}
                    refund={refund}
                    onDelete={handleDeleteRefund}
                    onMarkReceived={() => handleMarkReceived(refund.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 480px) {
          .page-header .header-content {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .refund-card .refund-id {
            font-size: 12px !important;
          }
        }
      `}</style>
    </>
  );
}