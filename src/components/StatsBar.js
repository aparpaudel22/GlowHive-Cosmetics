'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const stats = [
  { value: '500+',  label: 'Premium Products', icon: '✨' },
  { value: '50K+',  label: 'Happy Customers',  icon: '💗' },
  { value: '4.9',   label: 'Average Rating',   icon: null, isRating: true },
  { value: '100%',  label: 'Cruelty Free',     icon: '🌿' },
];

export default function StatsBar() {
  return (
    <section style={{
      background: '#fff',
      borderTop: '1px solid #fde8ec',
      borderBottom: '1px solid #fde8ec',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 28px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
      }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            whileHover={{ background: '#fdf6f0' }}
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              borderRight: i < stats.length - 1 ? '1px solid #fde8ec' : 'none',
              cursor: 'default',
              transition: 'background 0.2s',
            }}
          >
            {s.isRating ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '8px' }}>
                  {[...Array(5)].map((_, si) => (
                    <motion.div
                      key={si}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + si * 0.07 }}
                    >
                      <Star size={14} fill="#f5a623" color="#f5a623" />
                    </motion.div>
                  ))}
                </div>
                <div style={{
                  fontSize: '30px', fontWeight: 800, color: '#3d1f25',
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}>
                  {s.value}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{
                  fontSize: '30px', fontWeight: 800, color: '#3d1f25',
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}>
                  {s.value}
                </div>
              </>
            )}
            <div style={{ fontSize: '13px', color: '#8c6468', marginTop: '5px', fontWeight: 500 }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}