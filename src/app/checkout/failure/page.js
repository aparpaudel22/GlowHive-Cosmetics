'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, Home, Phone, Mail } from 'lucide-react';

export default function FailurePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
      <div style={{ 
        maxWidth: 'clamp(340px, 80vw, 520px)', 
        margin: '0 auto', 
        padding: 'clamp(40px, 8vh, 80px) clamp(16px, 4vw, 24px)', 
        textAlign: 'center' 
      }}>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          style={{
            width: 'clamp(64px, 8vw, 88px)',
            height: 'clamp(64px, 8vw, 88px)',
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#f87171,#ef4444)',
            margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(239,68,68,0.28)',
          }}
        >
          <XCircle size={32} color="#fff" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          style={{
            fontSize: 'clamp(24px, 3vw, 28px)',
            fontWeight: 800, color: '#3d1f25',
            fontFamily: "'Playfair Display', Georgia, serif",
            marginBottom: '12px',
          }}
        >
          Payment Failed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          style={{ 
            color: '#8c6468', 
            fontSize: 'clamp(13px, 1.2vw, 14px)', 
            lineHeight: 1.75, 
            marginBottom: '28px' 
          }}
        >
          Oops! Something went wrong while processing your payment.
          Don't worry — your cart is still saved and no amount was deducted.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: '#fff', border: '1px solid #fde8ec',
            borderRadius: 'clamp(14px, 1.5vw, 16px)',
            padding: 'clamp(16px, 2vw, 20px)',
            marginBottom: '24px', textAlign: 'left',
          }}
        >
          <p style={{
            fontSize: 'clamp(10px, 1vw, 11px)',
            fontWeight: 800, color: '#b76e79',
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px',
          }}>
            Common Reasons
          </p>
          {[
            '💳  Insufficient balance in wallet or account',
            '🔒  Transaction declined by your bank',
            '🌐  Network timeout — please check your internet',
            '⏱️  Session expired — please try placing order again',
          ].map(r => (
            <div key={r} style={{ 
              fontSize: 'clamp(12px, 1.2vw, 13px)', 
              color: '#5a3a40', 
              marginBottom: '8px', 
              lineHeight: 1.5 
            }}>
              {r}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <Link href="/checkout" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: 'linear-gradient(135deg,#b76e79,#c2748a)', color: '#fff',
            padding: 'clamp(12px, 1.5vh, 14px) clamp(20px, 3vw, 24px)',
            borderRadius: '12px', textDecoration: 'none',
            fontWeight: 800, fontSize: 'clamp(14px, 1.3vw, 15px)',
            boxShadow: '0 4px 18px rgba(183,110,121,0.28)',
          }}>
            <RefreshCw size={14} /> Try Again
          </Link>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: '#fff', color: '#b76e79', border: '1.5px solid #b76e79',
            padding: 'clamp(12px, 1.5vh, 13px) clamp(20px, 3vw, 24px)',
            borderRadius: '12px', textDecoration: 'none',
            fontWeight: 700, fontSize: 'clamp(13px, 1.3vw, 14px)',
          }}>
            <Home size={14} /> Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.46 }}
          style={{ marginTop: '28px' }}
        >
          <p style={{ fontSize: 'clamp(11px, 1vw, 12px)', color: '#8c6468', marginBottom: '12px' }}>
            Still having trouble? We're here to help.
          </p>
          <div style={{ 
            display: 'flex', 
            gap: 'clamp(8px, 1vw, 10px)', 
            justifyContent: 'center', 
            flexWrap: 'wrap' 
          }}>
            <a href="tel:+9779841234567" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: 'clamp(12px, 1.2vw, 13px)',
              fontWeight: 700, color: '#b76e79', textDecoration: 'none',
              background: '#fdf0f3', border: '1px solid #fde8ec',
              borderRadius: '50px', padding: 'clamp(6px, 0.8vw, 8px) clamp(12px, 1.5vw, 16px)',
            }}>
              <Phone size={12} /> +977 984-1234567
            </a>
            <a href="mailto:support@glowhive.com" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: 'clamp(12px, 1.2vw, 13px)',
              fontWeight: 700, color: '#b76e79', textDecoration: 'none',
              background: '#fdf0f3', border: '1px solid #fde8ec',
              borderRadius: '50px', padding: 'clamp(6px, 0.8vw, 8px) clamp(12px, 1.5vw, 16px)',
            }}>
              <Mail size={12} /> support@glowhive.com
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}