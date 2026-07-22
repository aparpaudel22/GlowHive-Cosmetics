'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, ShoppingBag, User,
  Menu, X, ChevronDown, Package,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop All', href: '/products' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  {
    label: 'Categories',
    href: '#',
    children: [
      { label: 'Skincare', href: '/products?category=skincare' },
      { label: 'Makeup', href: '/products?category=makeup' },
      { label: 'Lip Care', href: '/products?category=lip-care' },
      { label: 'Eye Care', href: '/products?category=eye-care' },
      { label: 'Fragrance', href: '/products?category=fragrance' },
      { label: 'Hair Care', href: '/products?category=hair-care' },
      { label: 'Body Care', href: '/products?category=body-care' },
    ],
    
  },
  { label: 'Best Sellers', href: '/best-seller' },
  { label: 'About', href: '/about' },
];

function Logo() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = (e) => {
    e.preventDefault();
    
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  return (
    <a 
      href="/" 
      onClick={handleLogoClick}
      style={{ textDecoration: 'none', cursor: 'pointer' }}
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(6px, 1.5vw, 11px)' 
        }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: '-4px', borderRadius: 'clamp(10px, 1.5vw, 16px)',
              background: 'linear-gradient(135deg,rgba(183,110,121,0.35),rgba(232,164,176,0.35))',
              filter: 'blur(6px)',
            }}
          />
          <motion.div
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'relative', 
              width: 'clamp(32px, 4vw, 42px)',
              height: 'clamp(32px, 4vw, 42px)', 
              borderRadius: 'clamp(10px, 1.5vw, 14px)',
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
              fontSize: 'clamp(16px, 2vw, 22px)',
              fontWeight: 900, color: '#fff',
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1, letterSpacing: '-1px',
              textShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }}>G</span>
          </motion.div>
        </div>
        <div>
          <div style={{ 
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            fontWeight: 800, 
            fontFamily: "'Playfair Display', Georgia, serif", 
            color: '#3d1f25', 
            lineHeight: 1, 
            letterSpacing: '-0.3px' 
          }}>
            GlowHive
          </div>
          <div style={{
            fontSize: 'clamp(6px, 0.7vw, 8.5px)',
            fontWeight: 700, letterSpacing: 'clamp(1.5px, 0.3vw, 2.5px)',
            textTransform: 'uppercase',
            background: 'linear-gradient(90deg,#b76e79,#c2748a)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', marginTop: '1px',
            display: 'none',
          }}
          className="logo-subtitle"
          >
            Beauty Essentials
          </div>
        </div>
      </motion.div>
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [orders, setOrders] = useState([]);

  const { cartCount } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const loadOrders = () => {
    try {
      const stored = localStorage.getItem('glowhive_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        const active = parsed.filter(o => o.status !== 'cancelled');
        setOrders(active);
      } else {
        setOrders([]);
      }
    } catch (_) {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const handleOrderUpdate = () => loadOrders();
    
    window.addEventListener('ordersUpdated', handleOrderUpdate);
    window.addEventListener('userLoggedIn', handleOrderUpdate);
    window.addEventListener('userLoggedOut', handleOrderUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'glowhive_orders') {
        loadOrders();
      }
    });

    return () => {
      window.removeEventListener('ordersUpdated', handleOrderUpdate);
      window.removeEventListener('userLoggedIn', handleOrderUpdate);
      window.removeEventListener('userLoggedOut', handleOrderUpdate);
    };
  }, []);

  const activeOrders = orders.length;

  return (
    <>
      {/* Announcement bar - Responsive */}
      <div style={{
        background: 'linear-gradient(90deg,#b76e79,#c2748a,#b76e79)',
        color: '#fff', textAlign: 'center',
        fontSize: 'clamp(9px, 1.2vw, 12px)',
        fontWeight: 600,
        letterSpacing: 'clamp(0.5px, 0.15vw, 1.5px)',
        padding: 'clamp(6px, 1vh, 9px) clamp(8px, 2vw, 16px)',
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
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 clamp(12px, 2.5vw, 28px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'clamp(56px, 8vh, 70px)',
        }}>
          <Logo />

          {/* Desktop nav - Hidden on mobile */}
          <nav style={{ 
            display: 'none',
            alignItems: 'center', 
            gap: 'clamp(2px, 0.5vw, 8px)',
          }}
          className="desktop-nav"
          >
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} style={{ position: 'relative' }}
                  onMouseEnter={() => setDropdown(true)}
                  onMouseLeave={() => setDropdown(false)}>
                  <button style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '3px',
                    padding: 'clamp(4px, 0.8vw, 8px) clamp(8px, 1.2vw, 14px)',
                    borderRadius: '10px',
                    fontSize: 'clamp(12px, 1.2vw, 14px)',
                    fontWeight: 500, color: '#3d1f25',
                  }}>
                    {link.label}
                    <motion.span animate={{ rotate: dropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={12} />
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
                          minWidth: 'clamp(160px, 18vw, 195px)',
                          zIndex: 200,
                        }}>
                        {link.children.map((child) => (
                          <Link key={child.href} href={child.href} style={{ textDecoration: 'none' }}>
                            <motion.div
                              whileHover={{ x: 5, background: '#fdf0f3' }}
                              transition={{ duration: 0.15 }}
                              style={{
                                padding: 'clamp(8px, 1vw, 10px) clamp(12px, 1.5vw, 16px)',
                                borderRadius: '10px',
                                fontSize: 'clamp(12px, 1.2vw, 14px)',
                                fontWeight: 500,
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
                      padding: 'clamp(4px, 0.8vw, 8px) clamp(8px, 1.2vw, 14px)',
                      borderRadius: '10px',
                      fontSize: 'clamp(12px, 1.2vw, 14px)',
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

          {/* Icons - Responsive */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(1px, 0.5vw, 8px)' 
          }}>

            {/* Search */}
            <motion.button
              whileHover={{ background: '#fde8ec', scale: 1.08 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => setSearchOpen(s => !s)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 'clamp(6px, 0.8vw, 9px)',
                borderRadius: '50%', color: '#3d1f25',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}>
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </motion.button>

            {/* Account */}
            <Link href={user ? "/account" : "/auth"} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ background: '#fde8ec', scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                style={{
                  padding: 'clamp(6px, 0.8vw, 9px)',
                  borderRadius: '50%', color: '#3d1f25',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'background 0.2s',
                  position: 'relative',
                }}>
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt="Profile" 
                    style={{
                      width: 'clamp(16px, 2vw, 20px)',
                      height: 'clamp(16px, 2vw, 20px)',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <User size={18} />
                )}
              </motion.div>
            </Link>

            {/* Wishlist - After Account */}
            <Link href="/wishlist" style={{ 
              textDecoration: 'none',
            }}>
              <motion.div
                whileHover={{ background: '#fde8ec', scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                style={{
                  padding: 'clamp(6px, 0.8vw, 9px)',
                  borderRadius: '50%', color: '#3d1f25',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'background 0.2s',
                }}>
                <Heart size={18} />
              </motion.div>
            </Link>

            {/* Orders */}
            <Link href="/orders" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ background: '#fde8ec', scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                style={{
                  padding: 'clamp(6px, 0.8vw, 9px)',
                  borderRadius: '50%', color: '#3d1f25',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                }}>
                <Package size={18} />
                <AnimatePresence>
                  {activeOrders > 0 && (
                    <motion.span
                      key="obadge"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{
                        position: 'absolute', top: '0px', right: '0px',
                        background: 'linear-gradient(135deg,#b76e79,#c2748a)',
                        color: '#fff',
                        fontSize: 'clamp(8px, 0.8vw, 10px)',
                        fontWeight: 700,
                        width: 'clamp(14px, 1.5vw, 17px)',
                        height: 'clamp(14px, 1.5vw, 17px)',
                        borderRadius: '50%',
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
                  padding: 'clamp(6px, 0.8vw, 9px)',
                  borderRadius: '50%', color: '#3d1f25',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                }}>
                <ShoppingBag size={18} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      style={{
                        position: 'absolute', top: '0px', right: '0px',
                        background: '#b76e79', color: '#fff',
                        fontSize: 'clamp(8px, 0.8vw, 10px)',
                        fontWeight: 700,
                        width: 'clamp(14px, 1.5vw, 17px)',
                        height: 'clamp(14px, 1.5vw, 17px)',
                        borderRadius: '50%',
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
              onClick={() => setMobileOpen(o => !o)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 'clamp(6px, 0.8vw, 9px)',
                borderRadius: '50%', color: '#3d1f25',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: '2px',
              }}
              className="hamburger-btn"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Search bar - Responsive */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden', borderTop: '1px solid #fde8ec' }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(10px, 1.5vh, 14px) clamp(12px, 2.5vw, 28px)' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1vw, 12px)',
                  background: '#fdf6f0', borderRadius: '50px',
                  border: '1.5px solid #fde8ec', padding: 'clamp(8px, 1vw, 12px) clamp(12px, 1.5vw, 20px)',
                }}>
                  <Search size={14} color="#b76e79" />
                  <input 
                    autoFocus 
                    type="text" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search skincare, makeup, fragrance…"
                    style={{
                      flex: 1, border: 'none', outline: 'none',
                      background: 'transparent', 
                      fontSize: 'clamp(13px, 1.5vw, 15px)', 
                      color: '#3d1f25',
                      minWidth: '80px',
                    }} />
                  {searchQuery && (
                    <motion.button whileTap={{ scale: 0.85 }}
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#8c6468', padding: '4px' }}>
                      <X size={12} />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile drawer - Responsive */}
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
                padding: 'clamp(16px, 2vh, 24px)',
                display: 'flex', flexDirection: 'column',
                boxShadow: '-12px 0 48px rgba(183,110,121,0.18)',
                overflowY: 'auto',
              }}>

              {/* Drawer header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(20px, 3vh, 32px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{
                    width: 'clamp(30px, 4vw, 34px)',
                    height: 'clamp(30px, 4vw, 34px)',
                    borderRadius: '11px',
                    background: 'linear-gradient(135deg,#c2748a,#b76e79,#e8a4b0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 14px rgba(183,110,121,0.5)', position: 'relative',
                  }}>
                    <span style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', fontWeight: 900, color: '#fff', fontFamily: "'Playfair Display', Georgia, serif" }}>G</span>
                  </div>
                  <span style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif" }}>GlowHive</span>
                </div>
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => setMobileOpen(false)}
                  style={{ background: '#fde8ec', border: 'none', borderRadius: '50%', width: 'clamp(32px, 4vw, 36px)', height: 'clamp(32px, 4vw, 36px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={15} color="#b76e79" />
                </motion.button>
              </div>

              {/* Nav links - Responsive */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.label}>
                      <p style={{ fontSize: 'clamp(9px, 1.2vw, 10px)', fontWeight: 700, color: '#b76e79', letterSpacing: '2px', textTransform: 'uppercase', margin: 'clamp(12px, 1.5vh, 16px) 0 6px 12px' }}>
                        {link.label}
                      </p>
                      {link.children.map((child) => (
                        <Link key={child.href} href={child.href} style={{ textDecoration: 'none' }}>
                          <motion.div whileHover={{ x: 4, background: '#fdf0f3' }}
                            style={{ padding: 'clamp(8px, 1.2vw, 10px) clamp(10px, 1.5vw, 14px)', borderRadius: '10px', fontSize: 'clamp(13px, 1.5vw, 14px)', color: '#3d1f25', fontWeight: 500 }}>
                            {child.label}
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                      <motion.div whileHover={{ x: 4, background: '#fdf6f0' }}
                        style={{
                          padding: 'clamp(10px, 1.5vw, 12px) clamp(10px, 1.5vw, 14px)',
                          borderRadius: '12px',
                          fontSize: 'clamp(14px, 1.8vw, 16px)',
                          fontWeight: 600,
                          color: pathname === link.href ? '#b76e79' : '#3d1f25',
                          background: pathname === link.href ? '#fdf0f3' : 'transparent',
                        }}>
                        {link.label}
                      </motion.div>
                    </Link>
                  )
                )}
              </div>

              {/* Bottom links - Responsive */}
              <div style={{ borderTop: '1px solid #fde8ec', paddingTop: 'clamp(12px, 1.5vh, 16px)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Link href="/wishlist" style={{ textDecoration: 'none' }}>
                  <motion.div whileHover={{ x: 4, background: '#fdf0f3' }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: 'clamp(10px, 1.5vw, 12px) clamp(10px, 1.5vw, 14px)', borderRadius: '10px', fontSize: 'clamp(13px, 1.5vw, 15px)', color: '#3d1f25', fontWeight: 500 }}>
                    <Heart size={14} color="#b76e79" /> Wishlist
                  </motion.div>
                </Link>

                <Link href={user ? "/account" : "/auth"} style={{ textDecoration: 'none' }}>
                  <motion.div whileHover={{ x: 4, background: '#fdf0f3' }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: 'clamp(10px, 1.5vw, 12px) clamp(10px, 1.5vw, 14px)', borderRadius: '10px', fontSize: 'clamp(13px, 1.5vw, 15px)', color: '#3d1f25', fontWeight: 500 }}>
                    <User size={14} color="#b76e79" /> {user ? 'My Account' : 'Sign In'}
                  </motion.div>
                </Link>

                <Link href="/orders" style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                  <motion.div whileHover={{ x: 4, background: '#fdf0f3' }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(10px, 1.5vw, 12px) clamp(10px, 1.5vw, 14px)', borderRadius: '10px', fontSize: 'clamp(13px, 1.5vw, 15px)', color: '#3d1f25', fontWeight: 500, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Package size={14} color="#b76e79" /> My Orders
                    </div>
                    {activeOrders > 0 && (
                      <span style={{ background: '#b76e79', color: '#fff', fontSize: 'clamp(10px, 1.2vw, 11px)', fontWeight: 700, padding: '2px 8px', borderRadius: '50px' }}>
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

      {/* Responsive styles */}
      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .hamburger-btn {
            display: none !important;
          }
          .logo-subtitle {
            display: block !important;
          }
        }
        @media (max-width: 767px) {
          .wishlist-icon {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}