'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, LogOut, ShoppingBag, Heart, Package, Gem,
  Phone, Edit3, Check, X, Camera, ChevronDown, ArrowRight,
  Truck, CreditCard, Trash2, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/AuthForm';
import toast from 'react-hot-toast';

const BLANK_PROFILE = { firstName: '', lastName: '', phone: '' };

const inp = {
  width: '100%', padding: '11px 14px', fontFamily: 'inherit',
  border: '1.5px solid #f9e4ea', borderRadius: '12px',
  fontSize: '14px', outline: 'none', background: '#fdf8f4',
  color: '#1a0a0f', transition: 'border 0.2s',
};

// ─── Compress Image Helper ───
const compressImage = (base64String) => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 150; // Max width/height in pixels
        
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_SIZE || height > MAX_SIZE) {
          const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 70% quality
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressed);
      };
      img.onerror = () => {
        resolve(base64String);
      };
    } catch (e) {
      resolve(base64String);
    }
  });
};

export default function AccountPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const from         = searchParams.get('from');
  const { user, isAuthenticated, hydrated, logout, deleteAccount } = useAuth();
  const fileRef      = useRef(null);

  const [profile,        setProfile]        = useState(BLANK_PROFILE);
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [avatar,         setAvatar]         = useState(null);   // base64 string
  const [ordersOpen,     setOrdersOpen]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  // ── Load profile + avatar ──
  useEffect(() => {
    if (!hydrated || !isAuthenticated) return;
    try {
      // Load profile
      const saved = localStorage.getItem('glowhive_profile');
      if (saved) {
        const p = JSON.parse(saved);
        setProfile({ 
          firstName: p.firstName || '', 
          lastName: p.lastName || '', 
          phone: p.phone || user?.phone || '' 
        });
      } else if (user) {
        const parts = (user.name || '').trim().split(' ');
        setProfile({ 
          firstName: parts[0] || '', 
          lastName: parts.slice(1).join(' ') || '', 
          phone: user.phone || '' 
        });
      }
      
      // Load avatar - check multiple sources
      const av = localStorage.getItem('glowhive_avatar');
      if (av && av.length < 400000) {
        setAvatar(av);
      } else if (user?.picture && typeof user.picture === 'string' && user.picture.length < 400000) {
        setAvatar(user.picture);
      } else if (user?.email) {
        // Check if avatar exists in scoped storage
        try {
          const scopedAvatar = localStorage.getItem(`glowhive_${encodeURIComponent(user.email)}_avatar`);
          if (scopedAvatar && scopedAvatar.length < 400000) {
            setAvatar(scopedAvatar);
            // Also set it in generic storage for future use
            try {
              localStorage.setItem('glowhive_avatar', scopedAvatar);
            } catch (_) {}
          }
        } catch (_) {}
      }
    } catch (_) {}
  }, [hydrated, isAuthenticated, user]);

  // ── Redirect after login ──
  useEffect(() => {
    if (hydrated && isAuthenticated && from === 'checkout') router.replace('/checkout');
  }, [hydrated, isAuthenticated, from]);

  if (!hydrated) return (
    <div style={{ minHeight: '100vh', background: '#fdf8f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#f43f68', fontWeight: 600 }}>Loading…</p>
    </div>
  );

  if (!isAuthenticated) return (
    <AuthForm redirectMessage={from === 'checkout' ? 'Please sign in to complete your purchase.' : null} />
  );

  // ── Photo upload with compression and size limit ──
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 3 * 1024 * 1024) { 
      toast.error('Photo must be under 3 MB.'); 
      return; 
    }
    
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target.result;
        
        // Compress the image to reduce size
        let compressed = base64;
        try {
          compressed = await compressImage(base64);
        } catch (_) {
          compressed = base64;
        }
        
        // Check if compressed image is still too large
        if (compressed.length > 300000) {
          toast.error('Image is still too large after compression. Please try a smaller image.');
          return;
        }
        
        setAvatar(compressed);
        
        // Save to generic storage
        try {
          localStorage.setItem('glowhive_avatar', compressed);
        } catch (_) {
          toast.error('Failed to save avatar. Image too large.');
          return;
        }
        
        // Save to scoped storage
        if (user?.email) {
          try {
            localStorage.setItem(`glowhive_${encodeURIComponent(user.email)}_avatar`, compressed);
          } catch (_) {
            // Scoped storage failed, but generic worked
            console.warn('Failed to save to scoped storage');
          }
        }
        
        // Update in users list
        try {
          const users = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
          const updatedUsers = users.map(u => {
            if (u.email === user.email) {
              return { ...u, picture: compressed };
            }
            return u;
          });
          localStorage.setItem('glowhive_users', JSON.stringify(updatedUsers));
        } catch (_) {}
        
        toast.success('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload photo. Please try again.');
    }
  };

  // ── Save personal details ──
  const handleSaveProfile = () => {
    if (!avatar) { toast.error('Please add a profile photo first.'); return; }
    if (!profile.firstName.trim()) { toast.error('First name is required.'); return; }
    if (!profile.phone.trim())     { toast.error('Phone number is required.'); return; }
    if (profile.phone.replace(/\D/g, '').length < 10) { toast.error('Enter a valid 10-digit phone number.'); return; }
    setSaving(true);
    try {
      const existing = JSON.parse(localStorage.getItem('glowhive_profile') || '{}');
      const updatedProfile = {
        ...existing,
        firstName: profile.firstName.trim(),
        lastName:  profile.lastName.trim(),
        phone:     profile.phone.trim(),
        email:     user.email,
      };
      localStorage.setItem('glowhive_profile', JSON.stringify(updatedProfile));
      
      // Also save in scoped storage
      if (user?.email) {
        localStorage.setItem(`glowhive_${encodeURIComponent(user.email)}_profile`, JSON.stringify(updatedProfile));
        
        // Update in users list
        const users = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
        const updatedUsers = users.map(u => {
          if (u.email === user.email) {
            return { 
              ...u, 
              name: `${profile.firstName.trim()} ${profile.lastName.trim()}`.trim(),
              phone: profile.phone.trim()
            };
          }
          return u;
        });
        localStorage.setItem('glowhive_users', JSON.stringify(updatedUsers));
      }
      
      toast.success('Profile saved!');
      setEditingProfile(false);
    } catch (_) { toast.error('Failed to save.'); }
    setSaving(false);
  };

  // ── Handle Account Deletion ──
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm.');
      return;
    }

    setDeleting(true);

    try {
      await deleteAccount();
      setShowDeleteModal(false);
      setDeleteConfirmText('');
      toast.success('Account deleted successfully.');
      router.push('/');
    } catch (error) {
      console.error('Deletion error:', error);
      toast.error(error.message || 'Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => { logout(); router.push('/'); };
  const isProfileComplete = profile.firstName && profile.phone;

  // ── Order sub-links ──
  const orderSubLinks = [
    { icon: <Truck size={14} color="#f43f68" />,      label: 'To Ship',    desc: 'Being prepared',        href: '/orders',           bg: '#fef1f4' },
    { icon: <CreditCard size={14} color="#c9a87c" />, label: 'To Pay',     desc: 'Cash on delivery',      href: '/orders/to-pay',    bg: '#fdf8ef' },
    { icon: <Package size={14} color="#5b8dd9" />,    label: 'To Receive', desc: 'On its way to you',     href: '/orders/to-receive', bg: '#eef3fd' },
    { icon: <RefreshCw size={14} color="#b76e79" />,  label: 'Returns',    desc: 'Manage your returns',   href: '/returns',          bg: '#fdf0f3' },
  ];

  const otherLinks = [
    { icon: <Heart size={20} color="#f43f68" />,       label: 'Wishlist',          href: '/wishlist'  },
    { icon: <ShoppingBag size={20} color="#f43f68" />, label: 'Continue Shopping', href: '/products'  },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fdf8f4', padding: '48px 20px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ═══ ACCOUNT CARD ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ background: '#fff', borderRadius: '24px', border: '1px solid #f9e4ea', boxShadow: '0 30px 60px rgba(244,63,104,0.08)', overflow: 'hidden' }}
        >
          {/* Banner + Avatar */}
          <div style={{ background: 'linear-gradient(135deg,#f43f68,#e11d50,#c9a87c)', height: '90px', position: 'relative' }}>
            {/* Hidden file input */}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />

            {/* Avatar circle — click to upload */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => fileRef.current?.click()}
              title="Click to change photo"
              style={{
                position: 'absolute', bottom: '-38px', left: '32px',
                width: '76px', height: '76px', borderRadius: '50%',
                background: '#fff', border: '4px solid #fff',
                boxShadow: '0 4px 20px rgba(244,63,104,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden',
              }}
            >
              {avatar && avatar.length < 400000 ? (
                <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : user?.picture && typeof user.picture === 'string' && user.picture.length < 400000 ? (
                <img src={user.picture} alt={user.name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#f9e4ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={30} color="#f43f68" />
                </div>
              )}
              {/* Camera overlay on hover */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'rgba(244,63,104,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <Camera size={20} color="#fff" />
              </div>
            </motion.div>

            {/* Change photo label */}
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                position: 'absolute', bottom: '10px', right: '16px',
                background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.35)', borderRadius: '50px',
                padding: '4px 12px', fontSize: '11px', fontWeight: 700,
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
              }}
            >
              <Camera size={11} /> {avatar ? 'Change Photo' : 'Add Photo'}
            </button>
          </div>

          <div style={{ padding: '52px 32px 32px' }}>

            {/* No-photo warning */}
            <AnimatePresence>
              {!avatar && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{
                    background: '#fff8f0', border: '1.5px solid #fcd98a',
                    borderRadius: '12px', padding: '11px 14px', marginBottom: '16px',
                    fontSize: '13px', color: '#92400e', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  <Camera size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
                  Profile photo is required — tap the avatar to add one.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name + badge */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a0a0f', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '4px' }}>
                  {user?.name || 'Welcome!'}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} color="#888" />
                  <p style={{ fontSize: '13px', color: '#888' }}>{user?.email || ''}</p>
                </div>
                {/* Display phone number if available */}
                {(profile.phone || user?.phone) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <Phone size={13} color="#888" />
                    <p style={{ fontSize: '13px', color: '#888' }}>{profile.phone || user?.phone || ''}</p>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef1f4', borderRadius: '50px', padding: '6px 12px' }}>
                <Gem size={13} color="#f43f68" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#f43f68', letterSpacing: '0.5px' }}>MEMBER</span>
              </div>
            </div>

            <div style={{ height: '1px', background: '#f9e4ea', margin: '24px 0' }} />

            {/* ═══ PERSONAL DETAILS CARD ═══ */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f9e4ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={17} color="#f43f68" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1a0a0f' }}>Personal Details</h2>
                    
                  </div>
                </div>
                {!editingProfile && (
                  <button onClick={() => setEditingProfile(true)} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: '#fef1f4', border: '1px solid #f9e4ea',
                    borderRadius: '50px', padding: '6px 14px', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 700, color: '#f43f68',
                  }}>
                    <Edit3 size={11} /> Edit
                  </button>
                )}
              </div>

              {!isProfileComplete && !editingProfile && (
                <div style={{ background: '#fff8f0', border: '1px solid #fcd98a', borderRadius: '12px', padding: '11px 14px', marginBottom: '16px', fontSize: '13px', color: '#92400e', fontWeight: 600 }}>
                  ⚠️ Add your phone number so checkout can be pre-filled.
                </div>
              )}

              <AnimatePresence mode="wait">
                {editingProfile ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { key: 'firstName', label: 'First Name *', placeholder: 'Ram'    },
                        { key: 'lastName',  label: 'Last Name',    placeholder: 'Sharma'  },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1a0a0f', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                          <input
                            value={profile[f.key]}
                            onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            style={inp}
                            onFocus={e => e.target.style.borderColor = '#f43f68'}
                            onBlur={e  => e.target.style.borderColor = '#f9e4ea'}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1a0a0f', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="tel" value={profile.phone}
                          onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                          placeholder="98XXXXXXXX"
                          style={{ ...inp, paddingRight: '44px' }}
                          onFocus={e => e.target.style.borderColor = '#f43f68'}
                          onBlur={e  => e.target.style.borderColor = '#f9e4ea'}
                        />
                        <Phone size={15} color="#ccc" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setEditingProfile(false)}
                        style={{ flex: 1, padding: '12px', background: '#fff', border: '1.5px solid #f9e4ea', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, color: '#888', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <X size={14} /> Cancel
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={handleSaveProfile} disabled={saving}
                        style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg,#f43f68,#e11d50)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, color: '#fff', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: saving ? 0.75 : 1 }}>
                        <Check size={14} /> {saving ? 'Saving…' : 'Save Details'}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      ['First Name', profile.firstName || '—'],
                      ['Last Name',  profile.lastName  || '—'],
                      ['Phone',      profile.phone     || '—', '1/-1'],
                      ['Email',      user?.email       || '—', '1/-1'],
                    ].map(([lbl, val, col]) => (
                      <div key={lbl} style={{ background: '#fdf8f4', borderRadius: '10px', padding: '10px 14px', gridColumn: col }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#f43f68', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>{lbl}</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: val === '—' ? '#ccc' : '#1a0a0f' }}>{val}</div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ height: '1px', background: '#f9e4ea', margin: '0 0 24px 0' }} />

            {/* ── My Orders (expandable) ── */}
            <div style={{ marginBottom: '8px' }}>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setOrdersOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px',
                  borderRadius: ordersOpen ? '14px 14px 0 0' : '14px',
                  border: '1px solid #f9e4ea',
                  background: ordersOpen ? '#fef1f4' : '#fdf8f4',
                  cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s',
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f9e4ea', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={20} color="#f43f68" />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a0a0f', flex: 1 }}>My Orders</span>
                <motion.span animate={{ rotate: ordersOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={18} color="#f43f68" />
                </motion.span>
              </motion.button>

              <AnimatePresence initial={false}>
                {ordersOpen && (
                  <motion.div
                    key="sub"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ border: '1px solid #f9e4ea', borderTop: 'none', borderRadius: '0 0 14px 14px', background: '#fffafc', padding: '6px' }}>
                      {orderSubLinks.map(sub => (
                        <motion.button
                          key={sub.href}
                          whileHover={{ x: 3, background: sub.bg }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => router.push(sub.href)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '11px 14px', borderRadius: '10px',
                            border: 'none', background: 'transparent',
                            cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.18s',
                          }}
                        >
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: sub.bg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {sub.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a0a0f' }}>{sub.label}</div>
                            <div style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>{sub.desc}</div>
                          </div>
                          <ArrowRight size={14} color="#ccc" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {otherLinks.map(link => (
                <motion.button
                  key={link.href}
                  whileHover={{ x: 4, background: '#fef1f4' }} whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(link.href)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 16px', borderRadius: '14px',
                    border: '1px solid #f9e4ea', background: '#fdf8f4',
                    cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f9e4ea', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {link.icon}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a0a0f' }}>{link.label}</span>
                  <span style={{ marginLeft: 'auto', color: '#f43f68', fontSize: '16px' }}>→</span>
                </motion.button>
              ))}
            </div>

            <div style={{ height: '1px', background: '#f9e4ea', margin: '24px 0' }} />

            {/* Delete Account Button */}
            <motion.button
              whileHover={{ scale: 1.02, background: '#fff0f3' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowDeleteModal(true)}
              style={{
                width: '100%', padding: '13px', background: '#fff',
                border: '1.5px solid #fde2e2', borderRadius: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontSize: '14px', fontWeight: 700, color: '#e11d50', transition: 'all 0.2s',
              }}
            >
              <Trash2 size={16} /> Delete Account
            </motion.button>

            <div style={{ height: '1px', background: '#f9e4ea', margin: '16px 0' }} />

            {/* Sign out */}
            <motion.button
              whileHover={{ scale: 1.02, background: '#fff0f3' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              style={{
                width: '100%', padding: '13px', background: '#fff',
                border: '1.5px solid #f9e4ea', borderRadius: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontSize: '14px', fontWeight: 700, color: '#888', transition: 'all 0.2s',
              }}
            >
              <LogOut size={16} /> Sign Out
            </motion.button>
          </div>
        </motion.div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#ccc' }}>
          © 2026 GlowHive • Made with ❤️ for your GLOW.
        </p>
      </div>

      {/* ═══ DELETE ACCOUNT CONFIRMATION MODAL ═══ */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px',
            }}
            onClick={() => !deleting && setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: '#fff',
                borderRadius: '24px',
                maxWidth: '440px',
                width: '100%',
                padding: '32px',
                boxShadow: '0 40px 80px rgba(0,0,0,0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '64px', height: '64px',
                  borderRadius: '50%',
                  background: '#fef1f4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <AlertTriangle size={32} color="#e11d50" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a0a0f', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '8px' }}>
                  Delete Account?
                </h2>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}>
                  This action is <strong style={{ color: '#e11d50' }}>permanent</strong> and cannot be undone. 
                  All your data including orders, wishlist, and profile information will be deleted.
                </p>
              </div>

              <div style={{ background: '#fdf8f4', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
                  Please type <strong style={{ color: '#e11d50' }}>DELETE</strong> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: '1.5px solid #f9e4ea',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#fff',
                    color: '#1a0a0f',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#e11d50'}
                  onBlur={(e) => e.target.style.borderColor = '#f9e4ea'}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                  }}
                  disabled={deleting}
                  style={{
                    flex: 1,
                    padding: '13px',
                    background: '#fdf8f4',
                    border: '1.5px solid #f9e4ea',
                    borderRadius: '12px',
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    color: '#888',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                    opacity: deleting ? 0.6 : 1,
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmText !== 'DELETE'}
                  style={{
                    flex: 2,
                    padding: '13px',
                    background: deleteConfirmText === 'DELETE' ? 'linear-gradient(135deg,#e11d50,#c0392b)' : '#f9e4ea',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: (deleting || deleteConfirmText !== 'DELETE') ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    color: deleteConfirmText === 'DELETE' ? '#fff' : '#aaa',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {deleting ? (
                    <>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #fff',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }} />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} /> Delete Permanently
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add spin animation for loading state */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}