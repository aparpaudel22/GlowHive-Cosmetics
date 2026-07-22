'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest'             },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Best Rated'         },
  { value: 'bestseller', label: 'Best Seller'        },
];

export default function ProductsTopBar({
  totalCount,
  search, setSearch,
  sort, setSort,
  sortOpen, setSortOpen,
  activeFilters,
  onMobileFilterOpen,
}) {
  return (
    <div style={{
      background: '#fdf6f0',
      borderBottom: '1px solid #fde8ec',
      padding: 'clamp(10px, 1.5vw, 14px) 0',
      position: 'sticky', top: '70px', zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(14px, 3vw, 28px)',
        display: 'flex', alignItems: 'center',
        gap: 'clamp(10px, 2vw, 16px)', flexWrap: 'wrap',
      }}>

        {/* Title + count */}
        <div style={{
          display: 'flex', alignItems: 'baseline',
          gap: '10px', flexShrink: 0,
        }}>
          <h1 style={{
            fontSize: 'clamp(16px, 2.5vw, 18px)', fontWeight: 800, color: '#3d1f25',
            fontFamily: "'Playfair Display', Georgia, serif",
            margin: 0,
          }}>
            All Products
          </h1>
          <span style={{ fontSize: 'clamp(12px, 1vw, 13px)', color: '#8c6468' }}>
            {totalCount} results
          </span>
        </div>

        {/* Search */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
          background: '#fff', borderRadius: '50px',
          border: '1.5px solid #fde8ec', padding: 'clamp(8px, 1vw, 10px) clamp(14px, 2vw, 18px)',
          minWidth: window.innerWidth < 480 ? '120px' : '200px',
          maxWidth: window.innerWidth < 480 ? '100%' : '400px',
          boxShadow: '0 2px 8px rgba(183,110,121,0.06)',
        }}>
          <Search size={15} color="#b76e79" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Search products..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent',
              fontSize: 'clamp(13px, 1.1vw, 14px)', color: '#3d1f25',
              minWidth: '60px',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', color: '#bbb',
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <motion.button
            whileHover={{ background: '#fff' }}
            onClick={() => setSortOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#fff', border: '1.5px solid #fde8ec',
              borderRadius: '50px', padding: 'clamp(8px, 1vw, 10px) clamp(14px, 2vw, 18px)',
              fontSize: 'clamp(12px, 1.1vw, 13px)', fontWeight: 600, color: '#3d1f25',
              cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(183,110,121,0.06)',
            }}
          >
            <span className="hidden sm:inline">Sort: </span>
            {SORT_OPTIONS.find(s => s.value === sort)?.label}
            <motion.span
              animate={{ rotate: sortOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={13} />
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: '#fff', borderRadius: '16px',
                  border: '1px solid #fde8ec', padding: '8px',
                  boxShadow: '0 16px 48px rgba(183,110,121,0.18)',
                  minWidth: window.innerWidth < 480 ? '160px' : '190px',
                  zIndex: 200,
                }}
              >
                {SORT_OPTIONS.map(opt => (
                  <motion.div
                    key={opt.value}
                    whileHover={{ background: '#fdf0f3', x: 4 }}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    style={{
                      padding: 'clamp(8px, 1vw, 10px) clamp(12px, 1.5vw, 14px)',
                      borderRadius: '10px',
                      fontSize: 'clamp(12px, 1.1vw, 13px)',
                      fontWeight: sort === opt.value ? 700 : 500,
                      color: sort === opt.value ? '#b76e79' : '#3d1f25',
                      background: sort === opt.value ? '#fdf0f3' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile filter button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex md:hidden"
          onClick={onMobileFilterOpen}
          style={{
            display: window.innerWidth < 768 ? 'flex' : 'none',
            alignItems: 'center', gap: '6px',
            background: '#b76e79', color: '#fff',
            border: 'none', borderRadius: '50px',
            padding: 'clamp(8px, 1vw, 10px) clamp(12px, 1.5vw, 16px)',
            fontSize: 'clamp(12px, 1.1vw, 13px)', fontWeight: 700,
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <SlidersHorizontal size={14} />
          Filters {activeFilters > 0 && `(${activeFilters})`}
        </motion.button>
      </div>
    </div>
  );
}