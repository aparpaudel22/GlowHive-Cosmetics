'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, ShoppingBag, User,
  Menu, X, ChevronDown, Package,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'Home',         href: '/' },
  { label: 'Shop All',     href: '/products' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  {
    label: 'Categories',
    href: '#',
    children: [
      { label: 'Skincare',   href: '/products?category=skincare'  },
      { label: ' Makeup',    href: '/products?category=makeup'    },
      { label: ' Lip Care',  href: '/products?category=lip-care'  },
      { label: ' Eye Care',  href: '/products?category=eye-care'  },
      { label: ' Fragrance', href: '/products?category=fragrance' },
      { label: ' Hair Care', href: '/products?category=hair-care' },
      { label: ' Body Care', href: '/products?category=body-care' },
    ],
  },
  { label: 'About', href: '/about' },
];

function Logo() {
  return (
    <Link href="/" style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        style={{ display: 'flex', alignItems: 'center', gap: '11px' }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: '-4px', borderRadius: '16px',
              background: 'linear-gradient(135deg,rgba(183,110,121,0.35),rgba(232,164,176,0.35))',
              filter: 'blur(6px)',
            }}
          />
          <motion.div
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'relative', width: '42px', height: '42px', borderRadius: '14px',
              background: 'linear-gradient(135deg,#c2748a,#b76e79,#e8a4b0,#b76e79)',
              backgroundSize: '200% 200%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(183,110,121,0.45),inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            <motion.span
              animate={{ opacity: [0.6, 1, 0.6], y: [-1, 1, -1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ position: 'absolute', top: '4px', right: '5px', fontSize: '8px', color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}
            >✦</motion.span>
            <span style={{
              fontSize: '22px', fontWeight: 900, color: '#fff',
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1, letterSpacing: '-1px',
              textShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }}>G</span>
          </motion.div>
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif", color: '#3d1f25', lineHeight: 1, letterSpacing: '-0.3px' }}>
            GlowHive
          </div>
          <div style={{
            fontSize: '8.5px', fontWeight: 700, letterSpacing: '2.5px',
            textTransform: 'uppercase',
            background: 'linear-gradient(90deg,#b76e79,#c2748a)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', marginTop: '1px',
          }}>Beauty Essentials</div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdown,    setDropdown]    = useState(false);
  const [orders,      setOrders]      = useState([]);

  const { cartCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Load orders for badge count only
  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem('glowhive_orders') || '[]')); } catch (_) {}
  }, []);

  const activeOrders = orders.filter(o => o.status !== 'cancelled').length;

  return (
    <>
      {/* Announcement bar */}
      <div style={{
        background: 'linear-gradient(90deg,#b76e79,#c2748a,#b76e79)',
        color: '#fff', textAlign: 'center',
        fontSize: '12px', fontWeight: 600,
        letterSpacing: '1.5px', padding: '9px 16px',
      }}>
        ✨ FREE SHIPPING ON ORDERS OVER Rs.5000 &nbsp;|&nbsp; USE CODE: <strong>GLOWHIVE15</strong> FOR 15% OFF ✨
      </div>

      {/* Main header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'sticky', top: 0, zIndex: 1000,
          background: scrolled ? 'rgba(255,248,245,0.96)' : '#fff8f5',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: '1px solid #fde8ec',
          boxShadow: scrolled ? '0 4px 24px rgba(183,110,121,0.10)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '0 28px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '70px',
        }}>
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} style={{ position: 'relative' }}
                  onMouseEnter={() => setDropdown(true)}
                  onMouseLeave={() => setDropdown(false)}>
                  <button style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '8px 14px', borderRadius: '10px',
                    fontSize: '14px', fontWeight: 500, color: '#3d1f25',
                  }}>
                    {link.label}
                    <motion.span animate={{ rotate: dropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={13} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          position: 'absolute', top: 'calc(100% + 6px)',
                          left: '50%', transform: 'translateX(-50%)',
                          background: '#fff', borderRadius: '18px',
                          border: '1px solid #fde8ec', padding: '8px',
                          boxShadow: '0 20px 60px rgba(183,110,121,0.20)',
                          minWidth: '195px', zIndex: 200,
                        }}>
                        {link.children.map((child) => (
                          <Link key={child.href} href={child.href} style={{ textDecoration: 'none' }}>
                            <motion.div
                              whileHover={{ x: 5, background: '#fdf0f3' }}
                              transition={{ duration: 0.15 }}
                              style={{
                                padding: '10px 16px', borderRadius: '10px',
                                fontSize: '14px', fontWeight: 500,
                                color: '#3d1f25', cursor: 'pointer',
                              }}>
                              {child.label}
                            </motion.div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ background: '#fdf6f0' }}
                    style={{
                      padding: '8px 14px', borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: pathname === link.href ? 700 : 500,
                      color: pathname === link.href ? '#b76e79' : '#3d1f25',
                      background: pathname === link.href ? '#fdf0f3' : 'transparent',
                      transition: 'color 0.2s',
                    }}>
                    {link.label}
                  </motion.div>
                </Link>
              )
            )}
          </nav>

          {/* Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>

            {/* Search */}
            {[{ el: searchOpen ? <X size={20} /> : <Search size={20} />, action: () => setSearchOpen(s => !s) }].map((btn, i) => (
              <motion.button key={i}
                whileHover={{ background: '#fde8ec', scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                onClick={btn.action}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '9px', borderRadius: '50%', color: '#3d1f25',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}>
                {btn.el}
              </motion.button>
            ))}

            {/* Wishlist + Account */}
            {[
              { icon: <Heart size={20} />, href: '/wishlist' },
              { icon: <User size={20} />,  href: '/account'  },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ background: '#fde8ec', scale: 1.08 }}
                  whileTap={{ scale: 0.88 }}
                  style={{
                    padding: '9px', borderRadius: '50%', color: '#3d1f25',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}>
                  {item.icon}
                </motion.div>
              </Link>
            ))}

            {/* Orders — links directly to /orders page */}
            <Link href="/orders" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ background: '#fde8ec', scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                style={{
                  padding: '9px', borderRadius: '50%', color: '#3d1f25',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                }}>
                <Package size={20} />
                <AnimatePresence>
                  {activeOrders > 0 && (
                    <motion.span
                      key="obadge"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{
                        position: 'absolute', top: '2px', right: '2px',
                        background: 'linear-gradient(135deg,#b76e79,#c2748a)',
                        color: '#fff', fontSize: '10px', fontWeight: 700,
                        width: '17px', height: '17px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid #fff8f5',
                      }}>
                      {activeOrders > 9 ? '9+' : activeOrders}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Cart */}
            <Link href="/cart" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ background: '#fde8ec', scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                style={{
                  padding: '9px', borderRadius: '50%', color: '#3d1f25',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                }}>
                <ShoppingBag size={20} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      style={{
                        position: 'absolute', top: '2px', right: '2px',
                        background: '#b76e79', color: '#fff',
                        fontSize: '10px', fontWeight: 700,
                        width: '17px', height: '17px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid #fff8f5',
                      }}>
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Hamburger */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              className="flex md:hidden"
              onClick={() => setMobileOpen(o => !o)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '9px', borderRadius: '50%', color: '#3d1f25',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: '4px',
              }}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden', borderTop: '1px solid #fde8ec' }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 28px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: '#fdf6f0', borderRadius: '50px',
                  border: '1.5px solid #fde8ec', padding: '12px 20px',
                }}>
                  <Search size={16} color="#b76e79" />
                  <input autoFocus type="text" value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search skincare, makeup, fragrance…"
                    style={{
                      flex: 1, border: 'none', outline: 'none',
                      background: 'transparent', fontSize: '15px', color: '#3d1f25',
                    }} />
                  {searchQuery && (
                    <motion.button whileTap={{ scale: 0.85 }}
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#8c6468' }}>
                      <X size={14} />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(61,31,37,0.35)',
                backdropFilter: 'blur(4px)', zIndex: 1001,
              }} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(300px, 82vw)',
                background: '#fff8f5', zIndex: 1002,
                padding: '24px', display: 'flex', flexDirection: 'column',
                boxShadow: '-12px 0 48px rgba(183,110,121,0.18)',
                overflowY: 'auto',
              }}>

              {/* Drawer header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '11px',
                    background: 'linear-gradient(135deg,#c2748a,#b76e79,#e8a4b0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 14px rgba(183,110,121,0.5)', position: 'relative',
                  }}>
                    <span style={{ fontSize: '8px', position: 'absolute', top: '3px', right: '4px', color: 'rgba(255,255,255,0.85)' }}>✦</span>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff', fontFamily: "'Playfair Display', Georgia, serif" }}>G</span>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif" }}>GlowHive</span>
                </div>
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => setMobileOpen(false)}
                  style={{ background: '#fde8ec', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={17} color="#b76e79" />
                </motion.button>
              </div>

              {/* Nav links */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.label}>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: '#b76e79', letterSpacing: '2px', textTransform: 'uppercase', margin: '16px 0 6px 12px' }}>
                        {link.label}
                      </p>
                      {link.children.map((child) => (
                        <Link key={child.href} href={child.href} style={{ textDecoration: 'none' }}>
                          <motion.div whileHover={{ x: 4, background: '#fdf0f3' }}
                            style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '14px', color: '#3d1f25', fontWeight: 500 }}>
                            {child.label}
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                      <motion.div whileHover={{ x: 4, background: '#fdf6f0' }}
                        style={{
                          padding: '12px 14px', borderRadius: '12px',
                          fontSize: '16px', fontWeight: 600,
                          color: pathname === link.href ? '#b76e79' : '#3d1f25',
                          background: pathname === link.href ? '#fdf0f3' : 'transparent',
                        }}>
                        {link.label}
                      </motion.div>
                    </Link>
                  )
                )}
              </div>

              {/* Bottom links */}
              <div style={{ borderTop: '1px solid #fde8ec', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {[
                  { icon: <User size={17} color="#b76e79" />,  label: 'My Account', href: '/account'  },
                  { icon: <Heart size={17} color="#b76e79" />, label: 'Wishlist',   href: '/wishlist' },
                ].map(item => (
                  <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                    <motion.div whileHover={{ x: 4, background: '#fdf0f3' }}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', fontSize: '15px', color: '#3d1f25', fontWeight: 500 }}>
                      {item.icon} {item.label}
                    </motion.div>
                  </Link>
                ))}

                {/* My Orders — goes to /orders page */}
                <Link href="/orders" style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                  <motion.div whileHover={{ x: 4, background: '#fdf0f3' }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '10px', fontSize: '15px', color: '#3d1f25', fontWeight: 500, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Package size={17} color="#b76e79" /> My Orders
                    </div>
                    {activeOrders > 0 && (
                      <span style={{ background: '#b76e79', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '50px' }}>
                        {activeOrders}
                      </span>
                    )}
                  </motion.div>
                </Link>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}