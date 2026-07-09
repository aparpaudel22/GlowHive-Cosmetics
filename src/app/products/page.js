'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ShoppingBag, Heart, Star, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/Products';
import Footer from '@/components/Footer';

const CATEGORY_LIST = [
  { value: '',          label: 'All Products',  /*emoji:'✨'*/ },
  { value: 'skincare',  label: 'Skincare',       /*emoji: '🧴'*/ },
  { value: 'makeup',    label: 'Makeup',         /*emoji: '💄' */},
  { value: 'lip-care',  label: 'Lip Care',       /*emoji: '💋'*/ },
  { value: 'eye-care',  label: 'Eye Care',       /*emoji: '👁'*/ },
  { value: 'fragrance', label: 'Fragrance',      /*emoji: '🌸'*/ },
  { value: 'hair-care', label: 'Hair Care',      /*emoji: '💆'*/ },
  { value: 'body-care', label: 'Body Care',      /*emoji: '🛁' */},
  
];

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
];

function ProductCard({ product, addToCart }) {
  const router = useRouter();
  const [wished, setWished] = useState(false);
  const [added, setAdded]   = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => router.push(`/products/${product.id}`)}
      style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '18px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(183,110,121,0.18)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ position: 'relative', height: '200px', background: '#fdf6f0' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {product.badge && (
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: product.badge === 'New' ? '#b76e79' : product.badge === 'Bestseller' ? '#f59e0b' : '#3d1f25',
            color: '#fff', fontSize: '10px', fontWeight: 800,
            padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px',
          }}>
            {product.badge}
          </div>
        )}
        {discount > 0 && (
          <div style={{ position: 'absolute', top: '12px', right: '42px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '20px' }}>
            -{discount}%
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); setWished(w => !w); }}
          style={{ position: 'absolute', top: '10px', right: '10px', background: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <Heart size={13} fill={wished ? '#b76e79' : 'none'} color={wished ? '#b76e79' : '#9ca3af'} />
        </button>
      </div>
      <div style={{ padding: '14px' }}>
        <p style={{ fontSize: '10px', color: '#b76e79', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
          {product.category ? product.category.replace(/-/g, ' ') : 'Beauty'}
        </p>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#3d1f25', lineHeight: 1.4, marginBottom: '8px', minHeight: '36px' }}>
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
          <Star size={11} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#3d1f25' }}>{product.rating}</span>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>({(product.reviews || 0).toLocaleString()})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#3d1f25' }}>Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'line-through', marginLeft: '5px' }}>
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            style={{
              background: added ? '#22c55e' : '#b76e79', border: 'none',
              borderRadius: '8px', color: '#fff', fontSize: '11px', fontWeight: 700,
              padding: '7px 12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            <ShoppingBag size={11} />
            {added ? '✓ Added' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const urlCategory = searchParams.get('category') || '';

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [search, setSearch]                 = useState('');
  const [sort, setSort]                     = useState('featured');

  // Sync URL → state when navigating via links
  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  const handleCategory = useCallback((val) => {
    setActiveCategory(val);
    const url = val ? `/products?category=${val}` : '/products';
    router.replace(url, { scroll: false });
  }, [router]);

  const filtered = products
    .filter(p => {
      const matchCat    = !activeCategory || p.category === activeCategory;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating')     return b.rating - a.rating;
      return 0;
    });

  const activeLabel = CATEGORY_LIST.find(c => c.value === activeCategory)?.label || 'All Products';

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #fdf0f3, #fff8f5)', borderBottom: '1px solid #fde8ec', padding: '36px 28px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '6px' }}>
            {activeLabel}
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '420px' }}>
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1.5px solid #fde8ec', borderRadius: '12px',
                padding: '11px 14px 11px 40px', fontSize: '14px', color: '#3d1f25',
                outline: 'none', background: '#fff',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <X size={14} color="#9ca3af" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 28px' }}>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {CATEGORY_LIST.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              style={{
                background: activeCategory === cat.value ? '#b76e79' : '#fff',
                color: activeCategory === cat.value ? '#fff' : '#3d1f25',
                border: `1.5px solid ${activeCategory === cat.value ? '#b76e79' : '#fde8ec'}`,
                borderRadius: '30px', padding: '8px 18px',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Sort bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Showing <strong style={{ color: '#3d1f25' }}>{filtered.length}</strong> products
            {activeCategory && <> in <strong style={{ color: '#b76e79' }}>{activeLabel}</strong></>}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={14} color="#9ca3af" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{ border: '1.5px solid #fde8ec', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', color: '#3d1f25', outline: 'none', background: '#fff', cursor: 'pointer' }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 28px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#3d1f25', marginBottom: '8px' }}>No products found</h3>
            <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Try a different search or category</p>
            <button onClick={() => { setSearch(''); handleCategory(''); }} style={{ background: '#b76e79', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}