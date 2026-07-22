'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, X, Share2, BellRing } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { products } from '@/data/Products';
import Footer from '@/components/Footer';

function WishlistCard({ product, addToCart, removeFromWishlist }) {
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    removeFromWishlist(product.id);
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #fde8ec',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.25s, box-shadow 0.25s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(183,110,121,0.16)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ position: 'relative', paddingBottom: '100%', background: '#fdf6f0', overflow: 'hidden' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {discount && (
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: '#b76e79', color: '#fff',
              fontSize: '11px', fontWeight: 700,
              padding: '4px 10px', borderRadius: '20px',
              zIndex: 2,
            }}>
              -{discount}%
            </div>
          )}
        </div>
      </Link>

      {/* Remove button */}
      <button
        onClick={handleRemove}
        aria-label="Remove from wishlist"
        style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(255,255,255,0.92)', border: '1px solid #fde8ec',
          borderRadius: '50%', width: '34px', height: '34px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 2, backdropFilter: 'blur(8px)',
          color: '#8c6468',
        }}
      >
        <X size={15} />
      </button>

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{
          fontSize: '11px', color: '#b76e79', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px',
        }}>
          {product.category?.replace(/-/g, ' ')}
        </p>

        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <p style={{ fontSize: 'clamp(14px, 1.2vw, 15px)', fontWeight: 700, color: '#3d1f25', marginBottom: '8px', lineHeight: 1.35 }}>
            {product.name}
          </p>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i} size={12}
                fill={i < Math.floor(product.rating || 4.5) ? '#f5a623' : '#e8e8e8'}
                color={i < Math.floor(product.rating || 4.5) ? '#f5a623' : '#e8e8e8'}
              />
            ))}
          </div>
          <span style={{ fontSize: '12px', color: '#8c6468', fontWeight: 600 }}>
            {product.rating} ({(product.reviews || 0).toLocaleString()})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'clamp(15px, 1.3vw, 17px)', fontWeight: 800, color: '#3d1f25' }}>
            Rs. {product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span style={{ fontSize: '13px', color: '#bbb', textDecoration: 'line-through' }}>
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div style={{
          fontSize: '12px', fontWeight: 600, marginBottom: '14px',
          color: product.inStock ? '#22c55e' : '#d32f2f',
        }}>
          {product.inStock ? '✓ In Stock' : '✕ Out of Stock'}
        </div>

        {product.inStock ? (
          <button
            onClick={handleAdd}
            style={{
              width: '100%',
              background: added ? '#22c55e' : 'linear-gradient(135deg, #b76e79, #c2748a)',
              color: '#fff', border: 'none', borderRadius: '50px',
              padding: 'clamp(10px, 1.2vw, 12px) 16px', fontSize: 'clamp(12px, 1.1vw, 13px)', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', transition: 'background 0.2s',
              marginTop: 'auto',
            }}
          >
            <ShoppingBag size={15} />
            {added ? 'Added! ✓' : 'Add to Cart'}
          </button>
        ) : (
          <button
            style={{
              width: '100%', background: '#fff', color: '#d32f2f',
              border: '1.5px solid #d32f2f', borderRadius: '50px',
              padding: 'clamp(10px, 1.2vw, 12px) 16px', fontSize: 'clamp(12px, 1.1vw, 13px)', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              marginTop: 'auto',
            }}
          >
            <BellRing size={14} /> Notify Me
          </button>
        )}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { addToCart } = useCart();
  const { wishlistIds, removeFromWishlist, clearWishlist } = useWishlist();

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  const handleAddAll = () => {
    wishlistProducts.forEach(p => p.inStock && addToCart(p));
  };

  // ── Empty state ──
  if (wishlistProducts.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
        <div style={{ textAlign: 'center', padding: 'clamp(60px, 12vw, 100px) clamp(16px, 3vw, 28px)' }}>
          <div style={{
            width: '96px', height: '96px', borderRadius: '50%',
            background: '#fde8ec', margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={40} color="#b76e79" />
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '10px' }}>
            Your wishlist is empty
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '28px', fontSize: 'clamp(14px, 1.2vw, 15px)' }}>
            Save the products you love and find them here anytime.
          </p>
          <Link href="/products" style={{
            background: '#b76e79', color: '#fff',
            padding: 'clamp(12px, 1.5vw, 14px) clamp(24px, 4vw, 32px)',
            borderRadius: '12px', textDecoration: 'none', fontWeight: 700, 
            fontSize: 'clamp(14px, 1.2vw, 15px)',
            display: 'inline-block',
          }}>
            Start Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Filled wishlist ──
  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #fdf0f3, #fff8f5)', borderBottom: '1px solid #fde8ec', padding: 'clamp(24px, 4vw, 32px) clamp(16px, 3vw, 28px)' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif" }}>
              My Wishlist
            </h1>
            <p style={{ fontSize: 'clamp(13px, 1.1vw, 14px)', color: '#8c6468', marginTop: '4px' }}>
              {wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigator.share ? navigator.share({ title: 'My GlowHive Wishlist', url: window.location.href }) : null}
              style={{
                background: 'transparent', border: '1.5px solid #3d1f25', color: '#3d1f25',
                borderRadius: '10px', padding: 'clamp(9px, 1vw, 11px) clamp(16px, 2vw, 22px)', 
                fontSize: 'clamp(12px, 1.1vw, 13px)', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
              <Share2 size={14} /> Share Wishlist
            </button>
            <button
              onClick={handleAddAll}
              style={{
                background: '#b76e79', border: 'none', color: '#fff',
                borderRadius: '10px', padding: 'clamp(9px, 1vw, 11px) clamp(16px, 2vw, 22px)', 
                fontSize: 'clamp(12px, 1.1vw, 13px)', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
              <ShoppingBag size={14} /> Add All To Cart
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(24px, 4vw, 40px) clamp(16px, 3vw, 28px)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 480 ? '1fr' : window.innerWidth < 640 ? 'repeat(2, 1fr)' : window.innerWidth < 1024 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
          gap: 'clamp(16px, 2vw, 22px)',
        }}>
          {wishlistProducts.map(product => (
            <WishlistCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              removeFromWishlist={removeFromWishlist}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}