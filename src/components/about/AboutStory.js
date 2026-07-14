'use client';

import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const FEATURES = [
  { icon: '🌿', label: '100% Cruelty-Free'       },
  { icon: '♻️', label: 'Eco-Friendly'             },
  { icon: '🧪', label: 'Dermatologist Tested'     },
];

export default function AboutStory() {
  return (
    <>
    <section style={{ background: '#fff8f5', padding: '80px 28px 0px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Section label */}
        <div style={{ textAlign: 'center', marginBottom: '56px', marginTop: '-45px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg,#fdf0f3,#fff8f5)',
            border: '1px solid #fde8ec', borderRadius: '50px',
            padding: '7px 18px', marginBottom: '16px',
          }}>
            <span style={{ fontSize: '14px' }}>✦</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#b76e79', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
              Our Story
            </span>
            <span style={{ fontSize: '14px' }}>✦</span>
          </div>
          <h2 style={{
            fontSize: '38px', fontWeight: 800, color: '#3d1f25',
            fontFamily: "'Playfair Display', Georgia, serif",
            marginBottom: '12px', lineHeight: 1.2,
          }}>
            Born from a Passion for Beauty
          </h2>
          <p style={{ fontSize: '15px', color: '#8c6468', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Crafted with love, backed by science — GlowHive is where luxury meets conscience.
          </p>
        </div>

        {/* Main grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}>

          {/* Left — logo card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ position: 'relative' }}
          >
            {/* Glow blobs */}
            <div style={{
              position: 'absolute', bottom: '-24px', right: '-24px',
              width: '130px', height: '130px', borderRadius: '50%',
              background: 'rgba(232,164,176,0.35)', filter: 'blur(32px)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', top: '-24px', left: '-24px',
              width: '100px', height: '100px', borderRadius: '50%',
              background: 'rgba(183,110,121,0.2)', filter: 'blur(28px)',
              pointerEvents: 'none',
            }} />

            {/* Card */}
            <div style={{
              position: 'relative', borderRadius: '24px', overflow: 'hidden',
              background: '#fff', boxShadow: '0 20px 60px rgba(183,110,121,0.15)',
              border: '1px solid #fde8ec',
            }}>
                          {/* Animated logo area */}
              <div style={{
                background: 'linear-gradient(135deg,#fdf0f3 0%,#fff8f5 50%,#fde8ec 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                aspectRatio: '4/3',
              }}>
                <div style={{ position: 'relative' }}>
                  {/* Outer glow pulse */}
                  <motion.div
                    animate={{ opacity: [0.35, 0.85, 0.35], scale: [1, 1.12, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute', inset: '-20px', borderRadius: '50px',
                      background: 'linear-gradient(135deg,rgba(183,110,121,0.45),rgba(232,164,176,0.45))',
                      filter: 'blur(24px)',
                    }}
                  />
                  {/* Logo box */}
                  <motion.div
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'relative',
                      width: '160px', height: '160px', borderRadius: '48px',
                      background: 'linear-gradient(135deg,#c2748a,#b76e79,#e8a4b0,#b76e79)',
                      backgroundSize: '200% 200%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 20px 60px rgba(183,110,121,0.55), inset 0 2px 0 rgba(255,255,255,0.28)',
                    }}
                  >
                    {/* Sparkle top-right */}
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5], y: [-2, 3, -2], rotate: [0, 15, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      style={{ position: 'absolute', top: '18px', right: '20px', fontSize: '22px', color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}
                    >✦</motion.span>
                    {/* Sparkle bottom-left */}
                    <motion.span
                      animate={{ opacity: [0.3, 0.75, 0.3], y: [2, -3, 2] }}
                      transition={{ duration: 2.6, repeat: Infinity, delay: 0.6 }}
                      style={{ position: 'absolute', bottom: '18px', left: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}
                    >✦</motion.span>
                    {/* G letter */}
                    <span style={{
                      fontSize: '86px', fontWeight: 900, color: '#fff',
                      fontFamily: "'Playfair Display', Georgia, serif",
                      lineHeight: 1, letterSpacing: '-4px',
                      textShadow: '0 4px 16px rgba(0,0,0,0.18)',
                    }}>G</span>
                  </motion.div>
                </div>
              </div>               

              {/* Bottom strip */}
              <div style={{
                background: 'linear-gradient(135deg,#b76e79,#c2748a)',
                padding: '12px 20px 0px', textAlign: 'center',
              }}>
                <p style={{ color: '#fff', fontSize: '16px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
                  ✦ Since 2026 ✦
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Story text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <p style={{ fontSize: '15px', color: '#5a3a40', lineHeight: 1.8, margin: 0 }}>
                GLOWHIVE was founded in 2026 with a simple mission — to create premium skincare and makeup that actually works, without compromising on ethics or sustainability.
              </p>
              <p style={{ fontSize: '15px', color: '#5a3a40', lineHeight: 1.8, margin: 0 }}>
                What started as a small batch of handcrafted serums in a kitchen has grown into a beloved beauty brand trusted by thousands. Every product is carefully formulated with the finest natural ingredients, backed by science, and infused with love.
              </p>
            </div>

            {/* Quote */}
            <div style={{
              borderLeft: '3px solid #b76e79',
              paddingLeft: '18px',
              marginBottom: '32px',
            }}>
              <p style={{
                fontSize: '17px', fontWeight: 700, color: '#b76e79',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: 'italic', margin: 0, lineHeight: 1.5,
              }}>
                "Because you deserve to glow inside and out."
              </p>
            </div>

            {/* Feature badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
              {FEATURES.map(({ icon, label }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(183,110,121,0.15)' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: '#fff', border: '1px solid #fde8ec',
                    borderRadius: '16px', padding: '18px 12px',
                    textAlign: 'center', cursor: 'default',
                    boxShadow: '0 2px 12px rgba(183,110,121,0.07)',
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#3d1f25', lineHeight: 1.4 }}>{label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          style={{
            marginTop: '64px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1px',
            background: '#fde8ec',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #fde8ec',
          }}
        >
          {[
            { value: '50,000+', label: 'Happy Customers'  },
            { value: '100+',    label: 'Beauty Products'  },
            { value: '4.9★',    label: 'Average Rating'   },
            { value: '0%',      label: 'Harmful Chemicals'},
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', padding: '24px', textAlign: 'center' }}>
              <div style={{
                fontSize: '26px', fontWeight: 900, color: '#b76e79',
                fontFamily: "'Playfair Display', Georgia, serif",
                marginBottom: '4px',
              }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#8c6468', fontWeight: 600, letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
          
        </motion.div>
  
      </div>
      <br /><br /><br /><br />
      
    </section>
    <Footer />
    </>
  );
  
}