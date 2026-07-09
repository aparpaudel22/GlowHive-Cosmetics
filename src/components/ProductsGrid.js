'use client';

import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

export default function ProductsGrid({
  products,
  page, totalPages,
  onPageChange,
  onReset,
}) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center', padding: '80px 20px', color: '#8c6468',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <p style={{
          fontSize: '18px', fontWeight: 700,
          color: '#3d1f25', marginBottom: '8px',
        }}>
          No products found
        </p>
        <p style={{ fontSize: '14px' }}>
          Try adjusting your filters or search term.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          style={{
            marginTop: '20px',
            background: 'linear-gradient(135deg, #b76e79, #c2748a)',
            color: '#fff', border: 'none', borderRadius: '50px',
            padding: '12px 28px', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Clear Filters
        </motion.button>
      </motion.div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
      }}>
        <AnimatePresence mode="popLayout">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <ProductCard product={product} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex', justifyContent: 'center',
            alignItems: 'center', gap: '6px',
            marginTop: '48px', flexWrap: 'wrap',
          }}
        >
          {/* Prev */}
          <motion.button
            whileHover={{ scale: 1.08, background: '#fde8ec' }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{
              width: '38px', height: '38px', borderRadius: '10px',
              border: '1.5px solid #fde8ec',
              background: page === 1 ? '#fafafa' : '#fff',
              color: page === 1 ? '#ccc' : '#3d1f25',
              fontSize: '15px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            ←
          </motion.button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <motion.button
              key={n}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(n)}
              style={{
                width: '38px', height: '38px', borderRadius: '10px',
                border: `1.5px solid ${n === page ? '#b76e79' : '#fde8ec'}`,
                background: n === page
                  ? 'linear-gradient(135deg, #b76e79, #c2748a)'
                  : '#fff',
                color: n === page ? '#fff' : '#3d1f25',
                fontSize: '14px', fontWeight: n === page ? 700 : 500,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              {n}
            </motion.button>
          ))}

          {/* Next */}
          <motion.button
            whileHover={{ scale: 1.08, background: '#fde8ec' }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={{
              width: '38px', height: '38px', borderRadius: '10px',
              border: '1.5px solid #fde8ec',
              background: page === totalPages ? '#fafafa' : '#fff',
              color: page === totalPages ? '#ccc' : '#3d1f25',
              fontSize: '15px',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            →
          </motion.button>
        </motion.div>
      )}
    </>
  );
}