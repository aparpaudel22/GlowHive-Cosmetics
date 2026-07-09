'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    // eSewa returns: transaction_uuid, total_amount, transaction_code, status
    // Khalti returns: pidx, txnId, amount, purchase_order_id, status
    const txnId     = searchParams.get('transaction_code') || searchParams.get('txnId')    || searchParams.get('pidx')              || '—';
    const amount    = searchParams.get('total_amount')     || searchParams.get('amount')   || '—';
    const orderId   = searchParams.get('transaction_uuid') || searchParams.get('purchase_order_id') || '—';
    const status    = searchParams.get('status')           || 'Completed';
    setDetails({ txnId, amount, orderId, status });
  }, [searchParams]);

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>

        {/* Success icon */}
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          margin: '0 auto 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(34,197,94,0.3)',
          animation: 'pulse 2s infinite',
        }}>
          <CheckCircle size={52} color="#fff" />
        </div>

        <h1 style={{
          fontSize: '34px', fontWeight: 800, color: '#3d1f25',
          fontFamily: "'Playfair Display', Georgia, serif",
          marginBottom: '12px',
        }}>
          Payment Successful! 🎉
        </h1>

        <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
          Your payment has been confirmed and your order is now being processed.
          You'll receive a confirmation shortly.
        </p>

        {/* Transaction details */}
        {details && (
          <div style={{
            background: '#fff', border: '1px solid #fde8ec',
            borderRadius: '16px', padding: '20px',
            marginBottom: '28px', textAlign: 'left',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px' }}>
              Transaction Details
            </p>
            {[
              { label: 'Order ID',          value: details.orderId },
              { label: 'Transaction ID',    value: details.txnId },
              { label: 'Amount Paid',       value: details.amount !== '—' ? `Rs. ${parseFloat(details.amount).toLocaleString()}` : '—' },
              { label: 'Payment Status',    value: details.status },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid #fde8ec' : 'none' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>{row.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#3d1f25', maxWidth: '200px', textAlign: 'right', wordBreak: 'break-all' }}>
                  {row.value}
                </span>
              </div>
            ))}
            <div style={{ marginTop: '12px', background: '#f0fdf4', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={15} color="#16a34a" />
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Expected delivery: 3–5 business days</span>
            </div>
          </div>
        )}

        {/* Steps */}
        <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '16px', padding: '20px', marginBottom: '28px', textAlign: 'left' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px' }}>What happens next?</p>
          {[
            { step: '1', text: 'Order confirmed and processing started', done: true },
            { step: '2', text: 'Item packed and dispatched from warehouse', done: false },
            { step: '3', text: 'Out for delivery to your address', done: false },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: i < 2 ? '12px' : 0 }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                background: s.done ? '#b76e79' : '#fde8ec',
                color: s.done ? '#fff' : '#9ca3af',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 800,
              }}>
                {s.done ? '✓' : s.step}
              </div>
              <p style={{ fontSize: '13px', color: s.done ? '#3d1f25' : '#9ca3af', fontWeight: s.done ? 600 : 400, paddingTop: '4px' }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            background: '#b76e79', color: '#fff',
            padding: '13px 28px', borderRadius: '12px',
            textDecoration: 'none', fontWeight: 700, fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            Back to Home
          </Link>
          <Link href="/products" style={{
            background: '#fff', color: '#b76e79',
            border: '1.5px solid #b76e79',
            padding: '13px 28px', borderRadius: '12px',
            textDecoration: 'none', fontWeight: 700, fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}