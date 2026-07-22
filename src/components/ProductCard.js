'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    setAdding(true);
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛍️`);
    setTimeout(() => setAdding(false), 800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product.id);
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist 💗');
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48, delay: index * 0.08 }}
    >
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
        <motion.div
          whileHover={{
            y: -8,
            boxShadow: '0 24px 60px rgba(183,110,121,0.18)',
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          style={{
            background: '#fff',
            borderRadius: 'clamp(16px, 2vw, 20px)',
            overflow: 'hidden',
            border: '1px solid #fde8ec',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          {/* Discount badge */}
          <AnimatePresence>
            {discount && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute', top: 'clamp(8px, 1.5vw, 12px)', left: 'clamp(8px, 1.5vw, 12px)',
                  background: '#b76e79', color: '#fff',
                  fontSize: 'clamp(9px, 1.2vw, 11px)',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '20px',
                  zIndex: 2,
                }}
              >
                -{discount}%
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wishlist button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleWishlist}
            style={{
              position: 'absolute', top: 'clamp(8px, 1.5vw, 12px)', right: 'clamp(8px, 1.5vw, 12px)',
              background: wishlisted ? '#fde8ec' : 'rgba(255,255,255,0.9)',
              border: '1px solid #fde8ec',
              borderRadius: '50%',
              width: 'clamp(30px, 4vw, 34px)',
              height: 'clamp(30px, 4vw, 34px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 2,
              backdropFilter: 'blur(8px)',
            }}
          >
            <Heart
              size={15}
              fill={wishlisted ? '#b76e79' : 'transparent'}
              color={wishlisted ? '#b76e79' : '#8c6468'}
            />
          </motion.button>

          {/* Product image */}
          <div style={{
            height: 'clamp(160px, 25vw, 200px)',
            overflow: 'hidden',
            background: '#fdf6f0',
          }}>
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.45 }}
              src={product.image || `https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80`}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Info */}
          <div style={{ padding: 'clamp(12px, 1.5vw, 16px)' }}>
            {/* Category */}
            <div style={{
              fontSize: 'clamp(10px, 1.2vw, 11px)',
              color: '#b76e79',
              fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '1px', marginBottom: '4px',
            }}>
              {product.category}
            </div>

            {/* Name */}
            <div style={{
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              fontWeight: 700,
              color: '#3d1f25',
              marginBottom: '6px',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {product.name}
            </div>

            {/* Stars */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              marginBottom: 'clamp(8px, 1vw, 12px)',
            }}>
              <div style={{ display: 'flex', gap: '1px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < Math.floor(product.rating || 4.5) ? '#f5a623' : '#e8e8e8'}
                    color={i < Math.floor(product.rating || 4.5) ? '#f5a623' : '#e8e8e8'}
                  />
                ))}
              </div>
              <span style={{ fontSize: 'clamp(10px, 1.2vw, 12px)', color: '#8c6468', fontWeight: 600 }}>
                {product.rating || '4.5'}
              </span>
            </div>

            {/* Price */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: 'clamp(10px, 1.5vw, 14px)',
              flexWrap: 'wrap',
            }}>
              <span style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                fontWeight: 800,
                color: '#3d1f25',
              }}>
                Rs. {product.price?.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span style={{
                  fontSize: 'clamp(11px, 1.2vw, 13px)',
                  color: '#bbb',
                  textDecoration: 'line-through',
                }}>
                  Rs. {product.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Add to cart */}
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: '0 8px 24px rgba(183,110,121,0.32)',
              }}
              whileTap={{ scale: 0.96 }}
              onClick={handleAddToCart}
              style={{
                width: '100%',
                background: adding
                  ? '#c2748a'
                  : 'linear-gradient(135deg, #b76e79, #c2748a)',
                color: '#fff', border: 'none', borderRadius: '50px',
                padding: 'clamp(10px, 1.2vw, 12px) clamp(12px, 1.5vw, 16px)',
                fontSize: 'clamp(11px, 1.2vw, 13px)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px',
                transition: 'background 0.2s',
              }}
            >
              <ShoppingCart size={15} />
              {adding ? 'Added! ✓' : 'Add to Cart'}
            </motion.button>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}