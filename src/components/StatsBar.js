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
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '0 clamp(12px, 3vw, 28px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
      }}
      className="stats-grid"
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            whileHover={{ background: '#fdf6f0' }}
            style={{
              padding: 'clamp(20px, 4vh, 32px) clamp(8px, 2vw, 16px)',
              textAlign: 'center',
              borderRight: i < stats.length - 1 ? '1px solid #fde8ec' : 'none',
              cursor: 'default',
              transition: 'background 0.2s',
            }}
          >
            {s.isRating ? (
              <>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 'clamp(2px, 0.5vw, 3px)', 
                  marginBottom: 'clamp(4px, 1vh, 8px)' 
                }}>
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
                  fontSize: 'clamp(22px, 3.5vw, 30px)',
                  fontWeight: 800, 
                  color: '#3d1f25',
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}>
                  {s.value}
                </div>
              </>
            ) : (
              <>
                <div style={{ 
                  fontSize: 'clamp(18px, 2.5vw, 22px)', 
                  marginBottom: 'clamp(4px, 1vh, 6px)' 
                }}>{s.icon}</div>
                <div style={{
                  fontSize: 'clamp(22px, 3.5vw, 30px)',
                  fontWeight: 800, 
                  color: '#3d1f25',
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}>
                  {s.value}
                </div>
              </>
            )}
            <div style={{ 
              fontSize: 'clamp(11px, 1.2vw, 13px)', 
              color: '#8c6468', 
              marginTop: 'clamp(4px, 1vh, 5px)', 
              fontWeight: 500 
            }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stats-grid > div:nth-child(2) {
            border-right: none !important;
          }
          .stats-grid > div:nth-child(4) {
            border-right: none !important;
          }
        }
        @media (max-width: 400px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}