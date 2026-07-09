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
      padding: '56px 28px',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column',
        textAlign: 'center', gap: '24px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>💌</div>
          <h2 style={{
            fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
            color: '#fff',
            fontFamily: "'Playfair Display', Georgia, serif",
            marginBottom: '8px',
          }}>
            Subscribe for 10% off your first order
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px' }}>
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
            display: 'flex', gap: '0',
            width: '100%', maxWidth: '480px',
            borderRadius: '50px', overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            background: '#fff', padding: '0 20px', gap: '10px',
          }}>
            <Mail size={16} color="#b76e79" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: '14px', color: '#3d1f25',
                background: 'transparent', padding: '16px 0',
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.04, background: '#c2748a' }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            style={{
              background: '#b76e79', color: '#fff',
              border: 'none', cursor: 'pointer',
              padding: '16px 28px', fontSize: '14px',
              fontWeight: 700, whiteSpace: 'nowrap',
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
          style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}
        >
          No spam, ever. Unsubscribe anytime.
        </motion.p>
      </div>
    </section>
  );
}