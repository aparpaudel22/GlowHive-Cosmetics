'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, ShoppingBag, Heart, Shield, Truck, RotateCcw, Package, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/Products';
import Footer from '@/components/Footer';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const product = products.find(p => p.id === Number(id));
  const { addToCart } = useCart();

  const [qty, setQty]           = useState(1);
  const [wished, setWished]     = useState(false);
  const [added, setAdded]       = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
        <div style={{ textAlign: 'center', padding: 'clamp(60px, 12vw, 120px) clamp(16px, 3vw, 28px)' }}>
          <p style={{ fontSize: '64px' }}>😔</p>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#3d1f25', margin: '16px 0 8px' }}>
            Product not found
          </h2>
          <Link href="/products" style={{ color: '#b76e79', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const related  = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const tabContent = {
    description: product.description,
    ingredients: 'Aqua, Glycerin, Niacinamide, Sodium Hyaluronate, Panthenol, Allantoin, Tocopherol (Vitamin E), Phenoxyethanol, Ethylhexylglycerin. Full INCI list printed on packaging.',
    'how to use': 'Apply a small amount to cleansed skin. Gently massage in upward circular motions until fully absorbed. Use morning and/or evening. Always follow with SPF during the day.',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(16px, 3vw, 28px)' }}>

        {/* Breadcrumb */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: 'clamp(20px, 4vw, 28px)', 
          fontSize: 'clamp(12px, 1.1vw, 13px)',
          flexWrap: 'wrap',
        }}>
          <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <Link href="/products" style={{ color: '#9ca3af', textDecoration: 'none' }}>Shop</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ color: '#3d1f25', fontWeight: 500, wordBreak: 'break-word' }}>{product.name}</span>
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#b76e79', fontSize: 'clamp(13px, 1.1vw, 14px)', fontWeight: 600,
            marginBottom: 'clamp(16px, 3vw, 24px)', padding: 0,
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Main grid - responsive */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
          gap: window.innerWidth < 768 ? '24px' : '48px',
          alignItems: 'start',
          marginBottom: 'clamp(40px, 6vw, 64px)',
        }}>

          {/* ── Left: Image ── */}
          <div style={{ 
            position: 'relative', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            background: '#fdf6f0', 
            aspectRatio: '1 / 1',
            maxWidth: window.innerWidth < 768 ? '100%' : '100%',
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {product.badge && (
              <span style={{
                position: 'absolute', top: '16px', left: '16px',
                background: '#b76e79', color: '#fff',
                fontSize: 'clamp(11px, 1vw, 12px)', fontWeight: 700,
                padding: '5px 14px', borderRadius: '999px',
              }}>
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span style={{
                position: 'absolute', top: '16px', right: '16px',
                background: '#22c55e', color: '#fff',
                fontSize: 'clamp(11px, 1vw, 12px)', fontWeight: 700,
                padding: '5px 14px', borderRadius: '999px',
              }}>
                {discount}% OFF
              </span>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div>
            {/* Category */}
            <p style={{
              fontSize: 'clamp(10px, 1vw, 11px)', fontWeight: 700, color: '#b76e79',
              letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px',
            }}>
              {product.category.replace('-', ' ')}
            </p>

            {/* Name */}
            <h1 style={{
              fontSize: 'clamp(24px, 4vw, 30px)', fontWeight: 800, color: '#3d1f25',
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1.3, marginBottom: '16px',
            }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => (
                  <Star
                    key={s} size={16}
                    fill={s <= Math.round(product.rating) ? '#f59e0b' : '#e5e7eb'}
                    color={s <= Math.round(product.rating) ? '#f59e0b' : '#e5e7eb'}
                  />
                ))}
              </div>
              <span style={{ fontWeight: 700, color: '#3d1f25', fontSize: '15px' }}>{product.rating}</span>
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>({product.reviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'clamp(26px, 4vw, 32px)', fontWeight: 800, color: '#3d1f25' }}>
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: '#9ca3af', textDecoration: 'line-through' }}>
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
              {discount > 0 && (
                <span style={{ fontSize: 'clamp(12px, 1.1vw, 13px)', fontWeight: 700, color: '#22c55e' }}>
                  Save Rs. {(product.originalPrice - product.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Qty + Add to Cart + Wishlist */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              alignItems: 'center', 
              marginBottom: '24px', 
              flexWrap: 'wrap' 
            }}>

              {/* Qty */}
              <div style={{
                display: 'flex', alignItems: 'center',
                border: '1.5px solid #fde8ec', borderRadius: '12px', overflow: 'hidden',
                flexShrink: 0,
              }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    background: 'none', border: 'none',
                    width: 'clamp(38px, 5vw, 42px)', height: 'clamp(44px, 5vw, 50px)',
                    cursor: 'pointer', fontSize: '20px', color: '#3d1f25',
                  }}
                >−</button>
                <span style={{ width: 'clamp(32px, 4vw, 40px)', textAlign: 'center', fontWeight: 700, color: '#3d1f25', fontSize: '16px' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    background: 'none', border: 'none',
                    width: 'clamp(38px, 5vw, 42px)', height: 'clamp(44px, 5vw, 50px)',
                    cursor: 'pointer', fontSize: '20px', color: '#3d1f25',
                  }}
                >+</button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  background: added ? '#22c55e' : '#b76e79',
                  border: 'none', borderRadius: '12px', color: '#fff',
                  fontSize: 'clamp(13px, 1.2vw, 15px)', fontWeight: 700,
                  padding: 'clamp(12px, 1.5vw, 14px) clamp(16px, 2vw, 24px)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'background 0.25s',
                  minWidth: 'clamp(120px, 15vw, 160px)',
                }}
              >
                {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setWished(w => !w)}
                style={{
                  background: wished ? '#fde8ec' : '#fff',
                  border: `1.5px solid ${wished ? '#b76e79' : '#fde8ec'}`,
                  borderRadius: '12px', width: 'clamp(46px, 5vw, 52px)', height: 'clamp(46px, 5vw, 52px)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                <Heart size={20} fill={wished ? '#b76e79' : 'none'} color="#b76e79" />
              </button>
            </div>

            {/* Trust badges - responsive grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: window.innerWidth < 480 ? '1fr' : '1fr 1fr', 
              gap: '10px', 
              marginBottom: '28px' 
            }}>
              {[
                { icon: <Truck size={14} color="#b76e79" />,    text: 'Free delivery on Rs.5000+' },
                { icon: <RotateCcw size={14} color="#b76e79" />, text: '7-day easy returns'        },
                { icon: <Shield size={14} color="#b76e79" />,   text: '100% authentic products'   },
                { icon: <Package size={14} color="#b76e79" />,  text: 'Secure packaging'           },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#fdf6f0', borderRadius: '10px', padding: '10px 12px',
                }}>
                  {item.icon}
                  <span style={{ fontSize: 'clamp(11px, 1vw, 12px)', color: '#3d1f25', fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ borderTop: '1px solid #fde8ec', paddingTop: '20px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {Object.keys(tabContent).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: activeTab === tab ? '#b76e79' : 'transparent',
                      color: activeTab === tab ? '#fff' : '#8c6468',
                      border: 'none', borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: 'clamp(12px, 1.1vw, 13px)', fontWeight: 600,
                      cursor: 'pointer', textTransform: 'capitalize',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 'clamp(13px, 1.1vw, 14px)', color: '#6b7280', lineHeight: 1.8 }}>
                {tabContent[activeTab]}
              </p>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 style={{
              fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 800, color: '#3d1f25',
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: '24px',
            }}>
              You May Also Like
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 480 ? '1fr' : window.innerWidth < 640 ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
            }}>
              {related.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: '#fff', border: '1px solid #fde8ec',
                      borderRadius: '16px', overflow: 'hidden',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(183,110,121,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ paddingBottom: '100%', position: 'relative', background: '#fdf6f0' }}>
                      <img src={p.image} alt={p.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <p style={{ fontSize: 'clamp(12px, 1.1vw, 13px)', fontWeight: 600, color: '#3d1f25', marginBottom: '6px', lineHeight: 1.4, flex: 1 }}>{p.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                        <span style={{ fontSize: 'clamp(14px, 1.2vw, 15px)', fontWeight: 800, color: '#b76e79' }}>Rs. {p.price.toLocaleString()}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Star size={11} fill="#f59e0b" color="#f59e0b" />
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#3d1f25' }}>{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}