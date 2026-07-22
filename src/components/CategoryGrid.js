'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1, name: 'Skincare', slug: 'skincare',
    img: '/VitamineC1.jpg',
    accent: '#b76e79',
  },
  {
    id: 2, name: 'Makeup', slug: 'makeup',
    img: '/LACounseler1.jpg',
    accent: '#c2748a',
  },
  {
    id: 3, name: 'Lip Care', slug: 'lip-care',
    img: '/Plumplipgloss1.jpg',
    accent: '#d4758a',
  },
  {
    id: 4, name: 'Eye Care', slug: 'eye-care',
    img: 'Kohlkajol1.jpg',
    accent: '#9b6ba8',
  },
  {
    id: 5, name: 'Fragrance', slug: 'fragrance',
    img: '/Perfume2.jpg',
    accent: '#b8906a',
  },
  {
    id: 6, name: 'Hair Care', slug: 'hair-care',
    img: '/Keratinesamphoo1.jpg',
    accent: '#6a9e78',
  },
  {
     id: 7, name: 'Body Care', slug: 'body-care',
    img: '/Lotion1.jpg',
    accent: '#3d1f25',
  },
];

export default function CategoryGrid() {
  return (
    <section style={{ 
      padding: 'clamp(40px, 8vh, 72px) 0', 
      background: '#fdf6f0' 
    }}>
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '0 clamp(16px, 3vw, 28px)' 
      }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 'clamp(24px, 3vh, 36px)' }}
        >
          <h2 style={{
            fontSize: 'clamp(20px, 2.5vw, 22px)',
            fontWeight: 800, color: '#3d1f25',
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>
            Shop by Category
          </h2>
        </motion.div>

        {/* Responsive Category Grid - 6 on desktop, 4 on tablet, 3 on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(10px, 1.5vw, 16px)',
        }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <Link href={`/products?category=${cat.slug}`} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{
                    y: -8,
                    boxShadow: `0 20px 48px rgba(183,110,121,0.22)`,
                    scale: 1.04,
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    borderRadius: 'clamp(14px, 2vw, 20px)',
                    overflow: 'hidden',
                    background: '#fff',
                    border: '1px solid #fde8ec',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {/* Photo */}
                  <div style={{ 
                    height: 'clamp(80px, 12vw, 130px)',
                    overflow: 'hidden' 
                  }}>
                    <motion.img
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.5 }}
                      src={cat.img}
                      alt={cat.name}
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', display: 'block',
                      }}
                    />
                  </div>

                  {/* Label */}
                  <div style={{
                    padding: 'clamp(8px, 1.2vw, 14px) clamp(4px, 0.5vw, 8px)',
                    fontSize: 'clamp(10px, 1.2vw, 13px)',
                    fontWeight: 700,
                    color: '#3d1f25',
                  }}>
                    {cat.name}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}