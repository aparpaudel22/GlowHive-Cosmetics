'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, Package, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Footer from '@/components/Footer';

const COUPONS = { GLOWHIVE15: 15, WELCOME10: 10, BEAUTY20: 20 };

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [coupon, setCoupon]             = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError]   = useState('');

  const subtotal       = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round(subtotal * (COUPONS[appliedCoupon] / 100)) : 0;
  const shipping       = subtotal >= 5000 ? 0 : 299;
  const total          = subtotal - discountAmount + shipping;

  const handleCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError('');
    } else {
      setCouponError('Invalid code. Try: GLOWHIVE15, WELCOME10, or BEAUTY20');
    }
  };

  // ── Empty state ──
  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
        <div style={{ textAlign: 'center', padding: '100px 28px' }}>
          <div style={{
            width: '96px', height: '96px', borderRadius: '50%',
            background: '#fde8ec', margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShoppingBag size={40} color="#b76e79" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '10px' }}>
            Your cart is empty
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '28px', fontSize: '15px' }}>
            Looks like you haven't added anything yet.<br></br>Browse our collection and find something you'll love!
          </p>
          <Link href="/products" style={{
            background: '#b76e79', color: '#fff',
            padding: '14px 32px', borderRadius: '12px',
            textDecoration: 'none', fontWeight: 700, fontSize: '15px',
            display: 'inline-block',
          }}>
            Start Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Filled cart ──
  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #fdf0f3, #fff8f5)', borderBottom: '1px solid #fde8ec', padding: '32px 28px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif" }}>
            Your Cart
            <span style={{ fontSize: '18px', fontWeight: 600, color: '#b76e79', marginLeft: '12px' }}>
              ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </span>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>

          {/* ── Cart items ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {cartItems.map((item, index) => (
              <div key={item.id ?? index} style={{
                background: '#fff', border: '1px solid #fde8ec',
                borderRadius: '16px', padding: '18px',
                display: 'flex', gap: '16px', alignItems: 'center',
              }}>
                {/* Image */}
                <Link href={`/Products/${item.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{ width: '88px', height: '88px', borderRadius: '12px', overflow: 'hidden', background: '#fdf6f0' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </Link>

                {/* Name + category */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '10px', color: '#b76e79', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>
                    {item.category?.replace('-', ' ')}
                  </p>
                  <Link href={`/Products/${item.id}`} style={{ textDecoration: 'none' }}>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#3d1f25', marginBottom: '4px', lineHeight: 1.3 }}>
                      {item.name}
                    </p>
                  </Link>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#b76e79' }}>
                    Rs. {item.price.toLocaleString()}
                  </p>
                </div>

                {/* Qty control */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #fde8ec', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{ background: 'none', border: 'none', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3d1f25' }}>
                    <Minus size={13} />
                  </button>
                  <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, color: '#3d1f25', fontSize: '14px' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ background: 'none', border: 'none', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3d1f25' }}>
                    <Plus size={13} />
                  </button>
                </div>

                {/* Line total + remove */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontWeight: 800, color: '#3d1f25', fontSize: '16px', marginBottom: '8px' }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, marginLeft: 'auto' }}>
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Free shipping nudge */}
            {subtotal < 5000 && (
              <div style={{ background: '#fdf0f3', border: '1px dashed #f0b8c4', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={16} color="#b76e79" />
                <p style={{ fontSize: '13px', color: '#3d1f25' }}>
                  Add <strong style={{ color: '#b76e79' }}>Rs. {(5000 - subtotal).toLocaleString()}</strong> more to get <strong>free shipping!</strong>
                </p>
              </div>
            )}
            {subtotal >= 5000 && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={16} color="#22c55e" />
                <p style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>
                  🎉 You've unlocked free shipping!
                </p>
              </div>
            )}
          </div>

          {/* ── Order summary ── */}
          <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '20px', padding: '24px', position: 'sticky', top: '90px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#3d1f25', marginBottom: '20px' }}>
              Order Summary
            </h2>

            {/* Price rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span style={{ fontWeight: 600, color: '#3d1f25' }}>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>Discount ({appliedCoupon})</span>
                  <span style={{ fontWeight: 700, color: '#22c55e' }}>− Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>Shipping</span>
                <span style={{ fontWeight: 600, color: shipping === 0 ? '#22c55e' : '#3d1f25' }}>
                  {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
                </span>
              </div>
              <div style={{ borderTop: '1px solid #fde8ec', paddingTop: '13px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#3d1f25' }}>Total</span>
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#3d1f25' }}>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon code */}
            {!appliedCoupon ? (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#fdf6f0', border: '1.5px solid #fde8ec',
                    borderRadius: '10px', padding: '10px 14px',
                  }}>
                    <Tag size={14} color="#b76e79" />
                    <input
                      value={coupon}
                      onChange={e => { setCoupon(e.target.value); setCouponError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                      placeholder="Enter coupon code"
                      style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', color: '#3d1f25', width: '100%' }}
                    />
                  </div>
                  <button
                    onClick={handleCoupon}
                    style={{ background: '#3d1f25', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 700, padding: '10px 14px', cursor: 'pointer' }}>
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p style={{ fontSize: '12px', color: '#f87171', marginTop: '6px' }}>{couponError}</p>
                )}
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px' }}>
                  Try: GLOWHIVE15 · WELCOME10 · BEAUTY20
                </p>
              </div>
            ) : (
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: '10px', padding: '10px 14px',
                marginBottom: '16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>
                  ✓ {appliedCoupon} — {COUPONS[appliedCoupon]}% off applied!
                </span>
                <button
                  onClick={() => { setAppliedCoupon(null); setCoupon(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Checkout button */}
            <Link href="/checkout" style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{
                width: '100%', background: '#b76e79',
                border: 'none', borderRadius: '12px',
                color: '#fff', fontSize: '16px', fontWeight: 700,
                padding: '16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#a05e6a'}
                onMouseLeave={e => e.currentTarget.style.background = '#b76e79'}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </Link>

            <Link href="/products" style={{
              display: 'block', textAlign: 'center',
              marginTop: '14px', fontSize: '13px',
              color: '#b76e79', textDecoration: 'none', fontWeight: 600,
            }}>
              ← Continue Shopping
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}