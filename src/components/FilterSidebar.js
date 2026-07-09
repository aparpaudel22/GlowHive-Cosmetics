'use client';

import { motion } from 'framer-motion';
import { SlidersHorizontal, Star } from 'lucide-react';

const CATEGORIES = ['Skincare', 'Makeup', 'Lip Care', 'Eye Care', 'Fragrance', 'Hair Care'];

export default function FilterSidebar({
  categories, toggleCategory,
  priceRange, setPriceRange,
  minRating, setMinRating,
  activeFilters, onReset,
}) {
  return (
    <div style={{
      width: '210px', flexShrink: 0,
      background: '#fdf6f0',
      borderRadius: '20px',
      border: '1px solid #fde8ec',
      padding: '24px 20px',
      height: 'fit-content',
      position: 'sticky', top: '140px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '20px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          fontSize: '13px', fontWeight: 800,
          color: '#3d1f25', letterSpacing: '1.5px',
          textTransform: 'uppercase',
        }}>
          <SlidersHorizontal size={14} color="#b76e79" />
          Filters
        </div>
        {activeFilters > 0 && (
          <button onClick={onReset} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '11px', color: '#b76e79', fontWeight: 600,
          }}>
            Clear all
          </button>
        )}
      </div>

      <div style={{ height: '1px', background: '#fde8ec', marginBottom: '20px' }} />

      {/* Category */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{
          fontSize: '12px', fontWeight: 700, color: '#3d1f25',
          letterSpacing: '0.5px', marginBottom: '12px',
        }}>
          Category
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {CATEGORIES.map(cat => (
            <label key={cat} style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              cursor: 'pointer', fontSize: '13px', color: '#5a3a40',
              fontWeight: categories.includes(cat) ? 700 : 400,
            }}>
              <motion.div
                whileTap={{ scale: 0.82 }}
                onClick={() => toggleCategory(cat)}
                style={{
                  width: '16px', height: '16px', borderRadius: '5px',
                  border: `2px solid ${categories.includes(cat) ? '#b76e79' : '#fde8ec'}`,
                  background: categories.includes(cat) ? '#b76e79' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {categories.includes(cat) && (
                  <motion.svg
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    width="9" height="9" viewBox="0 0 10 10"
                  >
                    <path d="M1.5 5l2.5 2.5 5-5"
                      stroke="#fff" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </motion.svg>
                )}
              </motion.div>
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', background: '#fde8ec', marginBottom: '20px' }} />

      {/* Price range */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{
          fontSize: '12px', fontWeight: 700, color: '#3d1f25',
          letterSpacing: '0.5px', marginBottom: '12px',
        }}>
          Price Range
        </p>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '12px', color: '#8c6468', marginBottom: '10px',
        }}>
          <span>Rs. {priceRange[0].toLocaleString()}</span>
          <span>Rs. {priceRange[1].toLocaleString()}</span>
        </div>
        <input
          type="range" min={0} max={5000} step={100}
          value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], +e.target.value])}
          style={{ width: '100%', accentColor: '#b76e79', cursor: 'pointer' }}
        />
      </div>

      <div style={{ height: '1px', background: '#fde8ec', marginBottom: '20px' }} />

      {/* Min rating */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{
          fontSize: '12px', fontWeight: 700, color: '#3d1f25',
          letterSpacing: '0.5px', marginBottom: '12px',
        }}>
          Min Rating
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {[4, 3, 2, 1].map(r => (
            <label key={r} style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              cursor: 'pointer', fontSize: '13px',
            }}>
              <motion.div
                whileTap={{ scale: 0.82 }}
                onClick={() => setMinRating(r === minRating ? 0 : r)}
                style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  border: `2px solid ${minRating === r ? '#b76e79' : '#fde8ec'}`,
                  background: minRating === r ? '#b76e79' : '#fff',
                  flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {minRating === r && (
                  <div style={{
                    width: '6px', height: '6px',
                    borderRadius: '50%', background: '#fff',
                  }} />
                )}
              </motion.div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {[...Array(r)].map((_, i) => (
                  <Star key={i} size={11} fill="#f5a623" color="#f5a623" />
                ))}
                <span style={{ fontSize: '11px', color: '#8c6468', marginLeft: '2px' }}>
                  & up
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Apply button */}
      <motion.button
        whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(183,110,121,0.30)' }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #b76e79, #c2748a)',
          color: '#fff', border: 'none', borderRadius: '50px',
          padding: '12px', fontSize: '13px', fontWeight: 700,
          cursor: 'pointer', letterSpacing: '0.5px',
        }}
      >
        Apply Filters {activeFilters > 0 && `(${activeFilters})`}
      </motion.button>
    </div>
  );
}