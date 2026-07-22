'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { products } from '@/data/mockData';

export default function FeaturedProducts() {
  const featured = products.slice(0, 4);

  return (
    <section style={{ 
      padding: 'clamp(40px, 8vh, 72px) 0', 
      background: '#fff' 
    }}>
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '0 clamp(16px, 3vw, 28px)' 
      }}>

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'clamp(24px, 3vh, 36px)',
            flexWrap: 'wrap', gap: '12px',
          }}
        >
          <h2 style={{
            fontSize: 'clamp(20px, 2.5vw, 22px)',
            fontWeight: 800, color: '#3d1f25',
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>
            Featured Products
          </h2>
          <Link href="/products" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ gap: '10px', color: '#b76e79' }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: 'clamp(12px, 1.2vw, 14px)',
                fontWeight: 600, color: '#8c6468',
                transition: 'color 0.2s',
              }}
            >
              View All
              <motion.span whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
                <ArrowRight size={16} />
              </motion.span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Responsive product grid - 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'clamp(16px, 2vw, 24px)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 'clamp(16px, 2vw, 24px)',
          }}>
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}