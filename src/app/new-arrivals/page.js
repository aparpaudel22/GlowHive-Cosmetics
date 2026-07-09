'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Heart, Star, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/Products';
import Footer from '@/components/Footer';

const newArrivals = [
  ...products.filter(p => p.badge === 'New'),
  ...products.filter(p => p.badge === 'Must Have'),
  ...products.filter(p => p.badge === 'Luxury'),
  ...products.filter(p => !p.badge),
].slice(0, 12);

function NewArrivalCard({ product, addToCart }) {
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
      <div style={{ position: 'relative', height: '210px', background: '#fdf6f0' }}>
        <img
          src={product.image} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', top: '14px', left: '-2px',
          background: 'linear-gradient(90deg, #b76e79, #e8a4b0)',
          color: '#fff', fontSize: '10px', fontWeight: 800,
          padding: '4px 14px 4px 12px', letterSpacing: '1px',
          clipPath: 'polygon(0 0, 100% 0, 90% 50%, 100% 100%, 0 100%)',
        }}>
          ✦ NEW
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

      <div style={{ padding: '16px' }}>
        <p style={{ fontSize: '10px', color: '#b76e79', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '5px' }}>
          {product.category ? product.category.replace(/-/g, ' ') : 'Beauty'}
        </p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#3d1f25', lineHeight: 1.4, marginBottom: '8px' }}>
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
          <Star size={11} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#3d1f25' }}>{product.rating}</span>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>({(product.reviews || 0).toLocaleString()})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '17px', fontWeight: 800, color: '#3d1f25' }}>
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
              fontSize: '12px', fontWeight: 700, padding: '8px 14px',
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

export default function NewArrivalsPage() {
  const { addToCart } = useCart();

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
      <div style={{
        background: 'linear-gradient(135deg, #3d1f25 0%, #b76e79 60%, #e8a4b0 100%)',
        padding: '60px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={18} color="rgba(255,255,255,0.8)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '3px', textTransform: 'uppercase' }}>Just Dropped</span>
            <Sparkles size={18} color="rgba(255,255,255,0.8)" />
          </div>
          <h1 style={{ fontSize: '44px', fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '12px' }}>New Arrivals</h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px', margin: '0 auto' }}>
            Fresh drops from your favourite beauty brands — be the first to get them.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#fde8ec', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px' }}>
          {[{ label: 'New Products', value: `${newArrivals.length}+` }, { label: 'Categories', value: '7' }, { label: 'Limited Stock', value: 'Grab Fast' }].map((s, i) => (
            <div key={i} style={{ background: '#fff', padding: '18px', textAlign: 'center' }}>
              <p style={{ fontSize: '22px', fontWeight: 800, color: '#b76e79', marginBottom: '4px' }}>{s.value}</p>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '22px' }}>
          {newArrivals.map(product => (
            <NewArrivalCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '56px', padding: '40px', background: 'linear-gradient(135deg, #fdf0f3, #fff8f5)', borderRadius: '20px', border: '1px solid #fde8ec' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#b76e79', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Don't miss out</p>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '10px' }}>Explore Our Full Collection</h2>
          <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: '14px' }}>500+ products across skincare, makeup, fragrance & more</p>
          <Link href="/products" style={{ background: '#b76e79', color: '#fff', padding: '14px 36px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', display: 'inline-block' }}>
            Shop All Products →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}