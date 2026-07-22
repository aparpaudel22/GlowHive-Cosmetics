'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, Package, X, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Footer from '@/components/Footer';

const COUPONS = { GLOWHIVE15: 15, WELCOME10: 10, BEAUTY20: 20 };

export default function CartPage() {
  const { 
    cartItems, 
    selectedItems, 
    removeFromCart, 
    updateQuantity, 
    toggleSelectItem,
    selectAllItems,
    deselectAllItems,
    getSelectedCount,
    getSelectedTotal
  } = useCart();
  
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const selectedCount = getSelectedCount?.() || 0;
  const selectedSubtotal = getSelectedTotal?.() || 0;
  const allSubtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const subtotal = selectedSubtotal > 0 ? selectedSubtotal : allSubtotal;
  const discountAmount = appliedCoupon ? Math.round(subtotal * (COUPONS[appliedCoupon] / 100)) : 0;
  const shipping = subtotal >= 5000 ? 0 : 299;
  const total = subtotal - discountAmount + shipping;

  const handleCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError('');
    } else {
      setCouponError('Invalid code. Try: GLOWHIVE15, WELCOME10, or BEAUTY20');
    }
  };

  const isAllSelected = cartItems.length > 0 && cartItems.every(item => selectedItems.includes(item.id));

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
        <div style={{ textAlign: 'center', padding: 'clamp(60px, 10vh, 100px) clamp(16px, 3vw, 28px)' }}>
          <div style={{
            width: 'clamp(72px, 8vw, 96px)',
            height: 'clamp(72px, 8vw, 96px)',
            borderRadius: '50%',
            background: '#fde8ec', margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShoppingBag size={34} color="#b76e79" />
          </div>
          <h2 style={{ 
            fontSize: 'clamp(24px, 3vw, 28px)', 
            fontWeight: 800, 
            color: '#3d1f25', 
            fontFamily: "'Playfair Display', Georgia, serif", 
            marginBottom: '10px' 
          }}>
            Your cart is empty
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '28px', fontSize: 'clamp(14px, 1.3vw, 15px)' }}>
            Looks like you haven't added anything yet.<br />Browse our collection and find something you'll love!
          </p>
          <Link href="/products" style={{
            background: '#b76e79', color: '#fff',
            padding: 'clamp(12px, 1.5vh, 14px) clamp(24px, 3vw, 32px)',
            borderRadius: '12px',
            textDecoration: 'none', fontWeight: 700, fontSize: 'clamp(14px, 1.3vw, 15px)',
            display: 'inline-block',
          }}>
            Start Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>

      <div style={{ 
        background: 'linear-gradient(135deg, #fdf0f3, #fff8f5)', 
        borderBottom: '1px solid #fde8ec', 
        padding: 'clamp(24px, 3vh, 32px) clamp(16px, 3vw, 28px)' 
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: 'clamp(24px, 3vw, 32px)', 
            fontWeight: 800, 
            color: '#3d1f25', 
            fontFamily: "'Playfair Display', Georgia, serif" 
          }}>
            Your Cart
            <span style={{ 
              fontSize: 'clamp(14px, 1.5vw, 18px)', 
              fontWeight: 600, 
              color: '#b76e79', 
              marginLeft: 'clamp(8px, 1vw, 12px)' 
            }}>
              ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </span>
          </h1>
          {selectedCount > 0 && selectedCount < cartItems.length && (
            <p style={{ fontSize: 'clamp(13px, 1.2vw, 14px)', color: '#8c6468', marginTop: '4px' }}>
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected for checkout
            </p>
          )}
        </div>
      </div>

      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: 'clamp(16px, 2vw, 28px)' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '28px', 
          alignItems: 'start' 
        }}
        className="cart-grid"
        >

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'clamp(8px, 1vh, 10px) 4px',
              borderBottom: '1px solid #fde8ec',
              marginBottom: '4px',
              flexWrap: 'wrap',
              gap: '8px',
            }}>
              <button
                onClick={isAllSelected ? deselectAllItems : selectAllItems}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'clamp(12px, 1.2vw, 13px)',
                  fontWeight: 600,
                  color: '#3d1f25',
                }}
              >
                <div style={{
                  width: 'clamp(16px, 1.5vw, 18px)',
                  height: 'clamp(16px, 1.5vw, 18px)',
                  borderRadius: '4px',
                  border: `2px solid ${isAllSelected ? '#b76e79' : '#d1d5db'}`,
                  background: isAllSelected ? '#b76e79' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {isAllSelected && <Check size={11} color="#fff" />}
                </div>
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </button>
              
              {selectedCount > 0 && (
                <span style={{
                  fontSize: 'clamp(11px, 1vw, 12px)',
                  color: '#b76e79',
                  fontWeight: 600,
                }}>
                  {selectedCount} selected
                </span>
              )}
            </div>

            {cartItems.map((item, index) => {
              const isSelected = selectedItems.includes(item.id);
              
              return (
                <div key={item.id ?? index} style={{
                  background: '#fff',
                  border: `2px solid ${isSelected ? '#b76e79' : '#fde8ec'}`,
                  borderRadius: 'clamp(14px, 1.5vw, 16px)',
                  padding: 'clamp(12px, 1.5vw, 18px)',
                  display: 'flex',
                  gap: 'clamp(10px, 1.5vw, 16px)',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 4px 16px rgba(183,110,121,0.08)' : 'none',
                  flexWrap: 'wrap',
                }}>
                  <button
                    onClick={() => toggleSelectItem(item.id)}
                    style={{
                      width: 'clamp(20px, 2vw, 24px)',
                      height: 'clamp(20px, 2vw, 24px)',
                      borderRadius: '6px',
                      border: `2px solid ${isSelected ? '#b76e79' : '#d1d5db'}`,
                      background: isSelected ? '#b76e79' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && <Check size={13} color="#fff" />}
                  </button>

                  <Link href={`/Products/${item.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                    <div style={{ 
                      width: 'clamp(60px, 8vw, 88px)',
                      height: 'clamp(60px, 8vw, 88px)',
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      background: '#fdf6f0' 
                    }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </Link>

                  <div style={{ flex: 1, minWidth: 'clamp(100px, 30%, 150px)' }}>
                    <p style={{ 
                      fontSize: 'clamp(9px, 1vw, 10px)', 
                      color: '#b76e79', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '1px', 
                      marginBottom: '3px' 
                    }}>
                      {item.category?.replace('-', ' ')}
                    </p>
                    <Link href={`/Products/${item.id}`} style={{ textDecoration: 'none' }}>
                      <p style={{ 
                        fontSize: 'clamp(13px, 1.3vw, 15px)', 
                        fontWeight: 600, 
                        color: '#3d1f25', 
                        marginBottom: '4px', 
                        lineHeight: 1.3 
                      }}>
                        {item.name}
                      </p>
                    </Link>
                    <p style={{ 
                      fontSize: 'clamp(13px, 1.3vw, 15px)', 
                      fontWeight: 700, 
                      color: '#b76e79' 
                    }}>
                      Rs. {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    border: '1.5px solid #fde8ec', 
                    borderRadius: '10px', 
                    overflow: 'hidden', 
                    flexShrink: 0 
                  }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ 
                        background: 'none', border: 'none', 
                        width: 'clamp(32px, 3.5vw, 36px)',
                        height: 'clamp(32px, 3.5vw, 36px)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3d1f25' 
                      }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ 
                      width: 'clamp(28px, 3vw, 32px)', 
                      textAlign: 'center', 
                      fontWeight: 700, 
                      color: '#3d1f25', 
                      fontSize: 'clamp(13px, 1.2vw, 14px)' 
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ 
                        background: 'none', border: 'none', 
                        width: 'clamp(32px, 3.5vw, 36px)',
                        height: 'clamp(32px, 3.5vw, 36px)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3d1f25' 
                      }}>
                      <Plus size={12} />
                    </button>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ 
                      fontWeight: 800, 
                      color: '#3d1f25', 
                      fontSize: 'clamp(14px, 1.5vw, 16px)', 
                      marginBottom: '8px' 
                    }}>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ 
                        background: 'none', border: 'none', 
                        cursor: 'pointer', color: '#f87171', 
                        display: 'flex', alignItems: 'center', gap: '4px', 
                        fontSize: 'clamp(11px, 1vw, 12px)', 
                        fontWeight: 600, marginLeft: 'auto' 
                      }}>
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {subtotal < 5000 && (
              <div style={{ 
                background: '#fdf0f3', border: '1px dashed #f0b8c4', 
                borderRadius: '12px', padding: 'clamp(12px, 1.5vh, 14px) clamp(14px, 1.5vw, 18px)', 
                display: 'flex', alignItems: 'center', gap: '10px',
                flexWrap: 'wrap',
              }}>
                <Package size={15} color="#b76e79" />
                <p style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#3d1f25' }}>
                  Add <strong style={{ color: '#b76e79' }}>Rs. {(5000 - subtotal).toLocaleString()}</strong> more to get <strong>free shipping!</strong>
                </p>
              </div>
            )}
            {subtotal >= 5000 && (
              <div style={{ 
                background: '#f0fdf4', border: '1px solid #bbf7d0', 
                borderRadius: '12px', padding: 'clamp(12px, 1.5vh, 14px) clamp(14px, 1.5vw, 18px)', 
                display: 'flex', alignItems: 'center', gap: '10px' 
              }}>
                <Package size={15} color="#22c55e" />
                <p style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#16a34a', fontWeight: 600 }}>
                  🎉 You've unlocked free shipping!
                </p>
              </div>
            )}
          </div>

          <div style={{ 
            background: '#fff', 
            border: '1px solid #fde8ec', 
            borderRadius: '20px', 
            padding: 'clamp(20px, 2vw, 24px)', 
            position: 'sticky', 
            top: '90px' 
          }}
          className="order-summary"
          >
            <h2 style={{ 
              fontSize: 'clamp(16px, 1.8vw, 18px)', 
              fontWeight: 800, 
              color: '#3d1f25', 
              marginBottom: '20px' 
            }}>
              Order Summary
              {selectedCount > 0 && selectedCount < cartItems.length && (
                <span style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', fontWeight: 600, color: '#b76e79', display: 'block', marginTop: '2px' }}>
                  {selectedCount} of {cartItems.length} items selected
                </span>
              )}
              {selectedCount === cartItems.length && (
                <span style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', fontWeight: 600, color: '#22c55e', display: 'block', marginTop: '2px' }}>
                  All items selected
                </span>
              )}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(13px, 1.2vw, 14px)' }}>
                <span style={{ color: '#6b7280' }}>Subtotal ({selectedCount || cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span style={{ fontWeight: 600, color: '#3d1f25' }}>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(13px, 1.2vw, 14px)' }}>
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>Discount ({appliedCoupon})</span>
                  <span style={{ fontWeight: 700, color: '#22c55e' }}>− Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(13px, 1.2vw, 14px)' }}>
                <span style={{ color: '#6b7280' }}>Shipping</span>
                <span style={{ fontWeight: 600, color: shipping === 0 ? '#22c55e' : '#3d1f25' }}>
                  {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
                </span>
              </div>
              <div style={{ borderTop: '1px solid #fde8ec', paddingTop: '13px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'clamp(16px, 1.6vw, 17px)', fontWeight: 800, color: '#3d1f25' }}>Total</span>
                <span style={{ fontSize: 'clamp(16px, 1.6vw, 17px)', fontWeight: 800, color: '#3d1f25' }}>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {!appliedCoupon ? (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#fdf6f0', border: '1.5px solid #fde8ec',
                    borderRadius: '10px', padding: 'clamp(8px, 1vw, 10px) clamp(12px, 1.2vw, 14px)',
                    minWidth: '120px',
                  }}>
                    <Tag size={13} color="#b76e79" />
                    <input
                      value={coupon}
                      onChange={e => { setCoupon(e.target.value); setCouponError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                      placeholder="Enter coupon code"
                      style={{ 
                        border: 'none', outline: 'none', background: 'transparent', 
                        fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#3d1f25', width: '100%' 
                      }}
                    />
                  </div>
                  <button
                    onClick={handleCoupon}
                    style={{ 
                      background: '#3d1f25', border: 'none', borderRadius: '10px', 
                      color: '#fff', fontSize: 'clamp(12px, 1.2vw, 13px)', 
                      fontWeight: 700, padding: 'clamp(8px, 1vw, 10px) clamp(12px, 1.2vw, 14px)', 
                      cursor: 'pointer' 
                    }}>
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p style={{ fontSize: 'clamp(11px, 1vw, 12px)', color: '#f87171', marginTop: '6px' }}>{couponError}</p>
                )}
                <p style={{ fontSize: 'clamp(10px, 0.9vw, 11px)', color: '#9ca3af', marginTop: '6px' }}>
                  Try: GLOWHIVE15 · WELCOME10 · BEAUTY20
                </p>
              </div>
            ) : (
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: '10px', padding: 'clamp(8px, 1vw, 10px) clamp(12px, 1.2vw, 14px)',
                marginBottom: '16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                <span style={{ fontSize: 'clamp(12px, 1.2vw, 13px)', color: '#16a34a', fontWeight: 600 }}>
                  ✓ {appliedCoupon} — {COUPONS[appliedCoupon]}% off applied!
                </span>
                <button
                  onClick={() => { setAppliedCoupon(null); setCoupon(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
                  <X size={13} />
                </button>
              </div>
            )}

            <Link href={selectedCount > 0 ? "/checkout" : "#"} style={{ textDecoration: 'none', display: 'block' }}>
              <button
                disabled={selectedCount === 0}
                style={{
                  width: '100%',
                  background: selectedCount > 0 ? '#b76e79' : '#d1d5db',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  fontWeight: 700,
                  padding: 'clamp(14px, 1.5vh, 16px)',
                  cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => {
                  if (selectedCount > 0) {
                    e.currentTarget.style.background = '#a05e6a';
                  }
                }}
                onMouseLeave={e => {
                  if (selectedCount > 0) {
                    e.currentTarget.style.background = '#b76e79';
                  }
                }}
              >
                {selectedCount === 0 ? 'Select Items to Checkout' : 'Proceed to Checkout'}
                {selectedCount > 0 && <ArrowRight size={17} />}
              </button>
            </Link>

            {selectedCount === 0 && (
              <p style={{ fontSize: 'clamp(10px, 0.9vw, 11px)', color: '#f87171', textAlign: 'center', marginTop: '8px' }}>
                Please select at least one item to proceed
              </p>
            )}

            <Link href="/products" style={{
              display: 'block', textAlign: 'center',
              marginTop: '14px', fontSize: 'clamp(12px, 1.2vw, 13px)',
              color: '#b76e79', textDecoration: 'none', fontWeight: 600,
            }}>
              ← Continue Shopping
            </Link>
          </div>

        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .cart-grid {
            grid-template-columns: 1fr 360px !important;
          }
          .order-summary {
            position: sticky !important;
            top: 90px !important;
          }
        }
        @media (max-width: 767px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
          .order-summary {
            position: static !important;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
}