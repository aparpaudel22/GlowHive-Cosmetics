'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '@/data/mockData';

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  const prev = () => setCurrent(c => (c - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setCurrent(c => (c + 1) % heroSlides.length);

  return (
    <section style={{
      background: 'linear-gradient(135deg, #fdf6f0 0%, #fde8ec 50%, #fdf0f3 100%)',
      minHeight: '520px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative circles */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(183,110,121,0.12), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(194,116,138,0.10), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '60px 28px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: '48px',
      }}>

        {/* LEFT — Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#fff', border: '1px solid #fde8ec',
                borderRadius: '50px', padding: '6px 16px',
                fontSize: '12px', fontWeight: 700, color: '#b76e79',
                letterSpacing: '0.5px', marginBottom: '24px',
                boxShadow: '0 2px 12px rgba(183,110,121,0.12)',
              }}
            >
              {slide.tag}
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                fontSize: 'clamp(38px, 5vw, 64px)',
                fontWeight: 800,
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#3d1f25',
                lineHeight: 1.1,
                marginBottom: '8px',
              }}
            >
              {slide.title}
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: 'clamp(38px, 5vw, 64px)',
                fontWeight: 800,
                fontFamily: "'Playfair Display', Georgia, serif",
                background: 'linear-gradient(135deg, #b76e79, #c2748a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.1,
                marginBottom: '20px',
              }}
            >
              {slide.titleAccent}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                fontSize: '16px', color: '#8c6468',
                lineHeight: 1.75, marginBottom: '36px',
                maxWidth: '440px',
              }}
            >
              {slide.subtitle}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}
            >
              <Link href={slide.ctaLink} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 12px 36px rgba(183,110,121,0.38)',
                  }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: 'linear-gradient(135deg, #b76e79, #c2748a)',
                    color: '#fff', padding: '14px 32px', borderRadius: '50px',
                    fontSize: '15px', fontWeight: 700,
                    boxShadow: '0 6px 24px rgba(183,110,121,0.30)',
                    letterSpacing: '0.3px',
                  }}
                >
                  {slide.cta}
                  <ArrowRight size={16} />
                </motion.div>
              </Link>

              <Link href={slide.secondaryLink} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    background: '#fde8ec',
                  }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: '#fff', color: '#3d1f25',
                    padding: '14px 32px', borderRadius: '50px',
                    fontSize: '15px', fontWeight: 600,
                    border: '1.5px solid #fde8ec',
                    transition: 'background 0.2s',
                  }}
                >
                  {slide.secondaryCta}
                </motion.div>
              </Link>
            </motion.div>

            {/* Dots */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '36px' }}>
              {heroSlides.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrent(i)}
                  animate={{ width: i === current ? 28 : 8, background: i === current ? '#b76e79' : '#fde8ec' }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: '8px', borderRadius: '4px',
                    border: 'none', cursor: 'pointer', padding: 0,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* RIGHT — Product image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current + '-img'}
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -40 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <motion.div
              whileHover={{ rotate: 2, scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                width: '420px', height: '420px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.6)',
                border: '2px solid rgba(183,110,121,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 20px 80px rgba(183,110,121,0.18)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Floating image */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "relative", zIndex: 10 }}
                >
                  <div
                    style={{
                      width: "320px",
                      height: "320px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "4px solid white",
                      boxShadow: "0 25px 60px rgba(244,63,104,0.2)",
                    }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                </motion.div>
              
              {/* Floating badges */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: '24px', right: '24px',
                  background: '#fff', borderRadius: '16px',
                  padding: '10px 16px', boxShadow: '0 8px 24px rgba(183,110,121,0.18)',
                  fontSize: '12px', fontWeight: 700, color: '#3d1f25',
                }}
              >
                ⭐ 4.9 Rating
              </motion.div>
              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', bottom: '40px', left: '20px',
                  background: '#b76e79', color: '#fff', borderRadius: '16px',
                  padding: '10px 16px', boxShadow: '0 8px 24px rgba(183,110,121,0.28)',
                  fontSize: '12px', fontWeight: 700,
                }}
              >
                🌿 100% Clean
              </motion.div>

              {/* Center product visual */}
              <div style={{
                width: '260px', height: '260px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #fde8ec, #fdf0f3, #fff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '100px',
                boxShadow: 'inset 0 4px 32px rgba(183,110,121,0.1)',
              }}>
                {slide.emoji}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next arrows */}
      {[
        { fn: prev, icon: <ChevronLeft size={20} />, side: 'left', pos: '24px' },
        { fn: next, icon: <ChevronRight size={20} />, side: 'right', pos: '24px' },
      ].map((btn, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.12, background: '#b76e79', color: '#fff' }}
          whileTap={{ scale: 0.9 }}
          onClick={btn.fn}
          style={{
            position: 'absolute',
            [btn.side]: btn.pos,
            top: '50%', transform: 'translateY(-50%)',
            background: '#fff', border: '1px solid #fde8ec',
            borderRadius: '50%', width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#3d1f25',
            boxShadow: '0 4px 16px rgba(183,110,121,0.14)',
            transition: 'background 0.2s, color 0.2s',
            zIndex: 10,
          }}
        >
          {btn.icon}
        </motion.button>
      ))}
    </section>
  );
}