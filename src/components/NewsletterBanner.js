'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('You\'re in! Check your inbox for 10% off 💌');
    setEmail('');
  };

  return (
    <section style={{
      background: 'linear-gradient(135deg, #3d1f25, #5a2d36)',
      padding: 'clamp(40px, 8vh, 56px) clamp(16px, 3vw, 28px)',
    }}>
      <div style={{
        maxWidth: '1280px', 
        margin: '0 auto',
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center', 
        flexDirection: 'column',
        textAlign: 'center', 
        gap: 'clamp(16px, 2vh, 24px)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ 
            fontSize: 'clamp(24px, 3vw, 28px)', 
            marginBottom: 'clamp(8px, 1vh, 10px)' 
          }}>💌</div>
          <h2 style={{
            fontSize: 'clamp(20px, 3vw, 28px)', 
            fontWeight: 800,
            color: '#fff',
            fontFamily: "'Playfair Display', Georgia, serif",
            marginBottom: 'clamp(6px, 0.8vh, 8px)',
          }}>
            Subscribe for 10% off your first order
          </h2>
          <p style={{ 
            color: 'rgba(255,255,255,0.65)', 
            fontSize: 'clamp(13px, 1.2vw, 14px)',
            padding: '0 8px',
          }}>
            Exclusive deals, beauty tips, and new arrivals — straight to your inbox.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          onSubmit={handleSubmit}
          style={{
            display: 'flex', 
            gap: '0',
            width: '100%', 
            maxWidth: '480px',
            borderRadius: '50px', 
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            flexDirection: 'row',
          }}
          className="newsletter-form"
        >
          <div style={{
            flex: 1, 
            display: 'flex', 
            alignItems: 'center',
            background: '#fff', 
            padding: '0 clamp(12px, 2vw, 20px)', 
            gap: 'clamp(6px, 0.8vw, 10px)',
          }}>
            <Mail size={16} color="#b76e79" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              style={{
                flex: 1, 
                border: 'none', 
                outline: 'none',
                fontSize: 'clamp(13px, 1.2vw, 14px)', 
                color: '#3d1f25',
                background: 'transparent', 
                padding: 'clamp(14px, 2vh, 16px) 0',
                minWidth: '80px',
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.04, background: '#c2748a' }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            style={{
              background: '#b76e79', 
              color: '#fff',
              border: 'none', 
              cursor: 'pointer',
              padding: 'clamp(14px, 2vh, 16px) clamp(18px, 3vw, 28px)',
              fontSize: 'clamp(13px, 1.2vw, 14px)',
              fontWeight: 700, 
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
          >
            Subscribe
          </motion.button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{ 
            fontSize: 'clamp(11px, 1vw, 12px)', 
            color: 'rgba(255,255,255,0.45)' 
          }}
        >
          No spam, ever. Unsubscribe anytime.
        </motion.p>
      </div>

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 480px) {
          .newsletter-form {
            flex-direction: column !important;
            border-radius: 16px !important;
            max-width: 100% !important;
          }
          .newsletter-form > div {
            border-radius: 16px 16px 0 0 !important;
          }
          .newsletter-form button {
            border-radius: 0 0 16px 16px !important;
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}