'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { XCircle, RefreshCw, ShoppingBag } from 'lucide-react';
import Footer from '@/components/Footer';

const FAILURE_REASONS = {
  'CANCELLED':        'You cancelled the payment.',
  'FAILED':           'The payment could not be processed.',
  'USER_CANCELED':    'You cancelled the payment.',
  'PENDING':          'Payment is pending. Please try again.',
};

export default function CheckoutFailurePage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const status  = searchParams.get('status') || 'FAILED';
  const reason  = FAILURE_REASONS[status] || 'Something went wrong with your payment.';
  const orderId = searchParams.get('transaction_uuid') || searchParams.get('purchase_order_id') || '';

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>

        {/* Failure icon */}
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          margin: '0 auto 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(239,68,68,0.3)',
        }}>
          <XCircle size={52} color="#fff" />
        </div>

        <h1 style={{
          fontSize: '32px', fontWeight: 800, color: '#3d1f25',
          fontFamily: "'Playfair Display', Georgia, serif",
          marginBottom: '12px',
        }}>
          Payment Failed
        </h1>

        <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
          {reason} Your cart has been saved — you can try again.
        </p>

        {/* Error card */}
        <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '16px', padding: '20px', marginBottom: '28px', textAlign: 'left' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px' }}>
            What happened?
          </p>
          {[
            'The payment gateway returned an error.',
            'Your session may have timed out.',
            'Your bank may have declined the transaction.',
            'There may have been a network issue.',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ color: '#ef4444', fontSize: '14px', flexShrink: 0 }}>•</span>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>{item}</p>
            </div>
          ))}
          {orderId && (
            <div style={{ marginTop: '10px', background: '#fef2f2', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#ef4444' }}>
              Order reference: <strong>{orderId}</strong>
            </div>
          )}
        </div>

        {/* What to try */}
        <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '16px', padding: '20px', marginBottom: '28px', textAlign: 'left' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px' }}>
            What to try
          </p>
          {[
            { icon: '💳', text: 'Try a different payment method (eSewa / Khalti / COD)' },
            { icon: '🔄', text: 'Check your wallet balance and try again' },
            { icon: '📶', text: 'Check your internet connection' },
            { icon: '🏦', text: 'Contact your bank if the issue persists' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < 3 ? '10px' : 0 }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
              <p style={{ fontSize: '13px', color: '#3d1f25', fontWeight: 500 }}>{item.text}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/checkout')}
            style={{
              background: '#b76e79', color: '#fff',
              padding: '13px 28px', borderRadius: '12px',
              border: 'none', fontWeight: 700, fontSize: '14px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <RefreshCw size={14} /> Try Again
          </button>
          <Link href="/cart" style={{
            background: '#fff', color: '#b76e79',
            border: '1.5px solid #b76e79',
            padding: '13px 28px', borderRadius: '12px',
            textDecoration: 'none', fontWeight: 700, fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <ShoppingBag size={14} /> Back to Cart
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  );
}