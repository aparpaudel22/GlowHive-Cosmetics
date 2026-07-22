'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Heart, Star, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/Products';
import Footer from '@/components/Footer';

const bestSellers = [
  ...products.filter(p => p.badge === 'Bestseller' || p.badge === 'Best Seller'),
  ...products.filter(p => p.rating >= 4.5 && p.reviews > 100),
].slice(0, 12);

// Remove duplicates based on product id
const uniqueBestSellers = bestSellers.reduce((acc, current) => {
  const exists = acc.find(item => item.id === current.id);
  if (!exists) {
    acc.push(current);
  }
  return acc;
}, []);

function BestSellerCard({ product, addToCart }) {
  const router = useRouter();
  const [wished, setWished] = useState(false);
  const [added, setAdded]   = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWish = (e) => {
    e.stopPropagation();
    setWished(w => !w);
  };

  return (
    <div
      onClick={() => router.push(`/products/${product.id}`)}
      style={{
        background: '#fff', border: '1px solid #fde8ec',
        borderRadius: '18px', overflow: 'hidden',
        cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(183,110,121,0.18)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ position: 'relative', paddingBottom: '100%', background: '#fdf6f0' }}>
        <img
          src={product.image} alt={product.name}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', top: '14px', left: '-2px',
          background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
          color: '#fff', fontSize: '10px', fontWeight: 800,
          padding: '4px 14px 4px 12px', letterSpacing: '1px',
          clipPath: 'polygon(0 0, 100% 0, 90% 50%, 100% 100%, 0 100%)',
        }}>
          ⭐ BESTSELLER
        </div>
        <button
          onClick={handleWish}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            background: '#fff', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Heart size={14} fill={wished ? '#b76e79' : 'none'} color={wished ? '#b76e79' : '#9ca3af'} />
        </button>
      </div>

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: '10px', color: '#b76e79', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '5px' }}>
          {product.category ? product.category.replace(/-/g, ' ') : 'Beauty'}
        </p>
        <p style={{ fontSize: 'clamp(13px, 1.2vw, 14px)', fontWeight: 600, color: '#3d1f25', lineHeight: 1.4, marginBottom: '8px', flex: 1 }}>
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
          <Star size={11} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#3d1f25' }}>{product.rating}</span>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>({(product.reviews || 0).toLocaleString()})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: 'clamp(15px, 1.5vw, 17px)', fontWeight: 800, color: '#3d1f25' }}>
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'line-through', marginLeft: '6px' }}>
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            style={{
              background: added ? '#22c55e' : '#b76e79',
              border: 'none', borderRadius: '9px', color: '#fff',
              fontSize: 'clamp(11px, 1vw, 12px)', fontWeight: 700, padding: '8px 14px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
              transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            <ShoppingBag size={12} />
            {added ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BestsellerPage() {
  const { addToCart } = useCart();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGridColumns = () => {
    if (windowWidth < 480) return '1fr';
    if (windowWidth < 768) return 'repeat(2, 1fr)';
    if (windowWidth < 1024) return 'repeat(3, 1fr)';
    return 'repeat(4, 1fr)';
  };

  const getStatsGridColumns = () => {
    if (windowWidth < 480) return '1fr';
    if (windowWidth < 768) return 'repeat(3, 1fr)';
    return 'repeat(3, 1fr)';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
      <div style={{
        background: 'linear-gradient(135deg, #3d1f25 0%, #b76e79 60%, #e8a4b0 100%)',
        padding: 'clamp(40px, 8vw, 60px) clamp(16px, 4vw, 28px)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={18} color="rgba(255,255,255,0.8)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '3px', textTransform: 'uppercase' }}>The BEST</span>
            <Sparkles size={18} color="rgba(255,255,255,0.8)" />
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 6vw, 44px)', fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '12px' }}>Best Sellers</h1>
          <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: 'rgba(255,255,255,0.75)', maxWidth: '480px', margin: '0 auto' }}>
            The premium brand with best selling , grab this with heavy discounts and offers from your favourite brand.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(24px, 4vw, 40px) clamp(16px, 3vw, 28px)' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: getStatsGridColumns(), 
          gap: '1px', 
          background: '#fde8ec', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          marginBottom: '40px' 
        }}>
          {[{ label: 'Best Products', value: '10+' }, { label: 'Categories', value: '7' }, { label: 'on this products', value: 'Heavy Discount' }].map((s, i) => (
            <div key={i} style={{ background: '#fff', padding: 'clamp(14px, 2.5vw, 18px)', textAlign: 'center' }}>
              <p style={{ fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 800, color: '#b76e79', marginBottom: '4px' }}>{s.value}</p>
              <p style={{ fontSize: 'clamp(11px, 1vw, 12px)', color: '#9ca3af' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: getGridColumns(), 
          gap: 'clamp(16px, 2vw, 22px)' 
        }}>
          {uniqueBestSellers.map((product) => (
            <BestSellerCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '56px', 
          padding: 'clamp(24px, 4vw, 40px)', 
          background: 'linear-gradient(135deg, #fdf0f3, #fff8f5)', 
          borderRadius: '20px', 
          border: '1px solid #fde8ec' 
        }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#b76e79', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Don't miss out</p>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '10px' }}>Explore Our Full Collection</h2>
          <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: 'clamp(13px, 1.2vw, 14px)' }}>500+ products across skincare, makeup, fragrance & more</p>
          <Link href="/products" style={{ 
            background: '#b76e79', color: '#fff', 
            padding: 'clamp(12px, 1.5vw, 14px) clamp(24px, 4vw, 36px)', 
            borderRadius: '12px', textDecoration: 'none', fontWeight: 700, 
            fontSize: 'clamp(14px, 1.2vw, 15px)', display: 'inline-block' 
          }}>
            Shop All Products →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}