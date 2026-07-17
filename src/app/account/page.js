'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User, Package, Truck, Heart, MapPin, Lock, LogOut, Camera,
} from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/AuthForm';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

const mockOrders = [
  { id: '#GH-1021', items: 'Vitamin C Serum, Lipstick +1', date: '10 Jun 26', total: 6697, status: 'Delivered' },
  { id: '#GH-0998', items: 'Midnight Bloom Perfume',       date: '28 May 26', total: 3800, status: 'Shipped'   },
  { id: '#GH-0945', items: 'Aveeno Moisturizing Lotion',   date: '15 Apr 26', total: 1299, status: 'Delivered' },
];

const statusStyle = (status) =>
  status === 'Delivered'
    ? { color: '#16a34a', background: '#f0fdf4' }
    : { color: '#b45309', background: '#fffbeb' };

export default function AccountPage() {
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, hydrated, logout, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '+977-98XXXXXXXX',
    email: user?.email || '',
  });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = () => {
    updateProfile({ name: form.name, email: form.email });
    toast.success('Profile updated 💾');
  };

  const handleCancel = () => setForm({ name: user?.name || '', phone: form.phone, email: user?.email || '' });

  if (!hydrated) return null;

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  const sidebarItems = [
    { key: 'profile',   label: 'Profile',           icon: User,    href: null },
    { key: 'orders',    label: 'My Orders',         icon: Package, href: null, badge: mockOrders.length },
    { key: 'shipping',  label: 'Shipping',          icon: Truck,   href: null },
    { key: 'wishlist',  label: 'Wishlist',          icon: Heart,   href: '/wishlist', badge: wishlistCount || null },
    { key: 'addresses', label: 'Addresses',         icon: MapPin,  href: null },
    { key: 'password',  label: 'Change Password',   icon: Lock,    href: null },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #fdf0f3, #fff8f5)', borderBottom: '1px solid #fde8ec', padding: '32px 28px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif" }}>
            My Account
          </h1>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '32px 28px',
        display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px',
        alignItems: 'start',
      }}
      className="account-grid"
      >
        {/* ── Sidebar ── */}
        <div style={{
          background: '#fff', border: '1px solid #fde8ec',
          borderRadius: '20px', overflow: 'hidden', height: 'fit-content',
        }}>
          <div style={{ textAlign: 'center', padding: '32px 20px 20px', borderBottom: '1px solid #fde8ec' }}>
            <div style={{
              width: '88px', height: '88px', borderRadius: '50%',
              background: '#fde8ec', margin: '0 auto 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {user?.picture ? (
                <img src={user.picture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={38} color="#b76e79" />
              )}
              <div style={{
                position: 'absolute', bottom: '0', right: '0',
                width: '28px', height: '28px', borderRadius: '50%',
                background: '#b76e79', border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <Camera size={13} color="#fff" />
              </div>
            </div>
            <p style={{ fontWeight: 700, color: '#3d1f25', fontSize: '15px', marginBottom: '3px' }}>
              {user?.name}
            </p>
            <p style={{ color: '#8c6468', fontSize: '13px' }}>{user?.email}</p>
          </div>

          <div style={{ padding: '10px' }}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              const content = (
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 14px', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    color: isActive ? '#fff' : '#3d1f25',
                    background: isActive ? '#b76e79' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                  {!!item.badge && (
                    <span style={{
                      marginLeft: 'auto',
                      background: isActive ? 'rgba(255,255,255,0.25)' : '#fde8ec',
                      color: isActive ? '#fff' : '#b76e79',
                      fontSize: '11px', fontWeight: 700,
                      padding: '2px 8px', borderRadius: '12px',
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
              return item.href ? (
                <Link key={item.key} href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
                  {content}
                </Link>
              ) : (
                <div key={item.key} onClick={() => setActiveTab(item.key)}>
                  {content}
                </div>
              );
            })}

            <div style={{ borderTop: '1px solid #fde8ec', margin: '10px 0', paddingTop: '6px' }}>
              <div
                onClick={() => { logout(); toast('Logged out 👋'); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  color: '#d32f2f',
                }}
              >
                <LogOut size={16} /> Logout
              </div>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{
          background: '#fff', border: '1px solid #fde8ec',
          borderRadius: '20px', padding: '28px',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#3d1f25', marginBottom: '22px' }}>
            Personal Information
          </h2>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px',
            marginBottom: '24px',
          }}
          className="form-grid"
          >
            {[
              { field: 'name',  label: 'Full Name',      type: 'text'  },
              { field: 'phone', label: 'Phone Number',   type: 'tel'   },
              { field: 'email', label: 'Email Address',  type: 'email' },
            ].map(({ field, label, type }) => (
              <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#3d1f25' }}>{label}</label>
                <input
                  type={type}
                  value={form[field]}
                  onChange={handleChange(field)}
                  style={{
                    padding: '11px 14px', borderRadius: '10px',
                    border: '1.5px solid #fde8ec', fontSize: '14px',
                    color: '#3d1f25', outline: 'none', background: '#fdf6f0',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#b76e79'}
                  onBlur={e => e.currentTarget.style.borderColor = '#fde8ec'}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
            <button
              onClick={handleSave}
              style={{
                background: '#b76e79', color: '#fff', border: 'none',
                borderRadius: '10px', padding: '12px 28px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              }}>
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              style={{
                background: '#fdf6f0', color: '#3d1f25', border: '1px solid #fde8ec',
                borderRadius: '10px', padding: '12px 28px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              }}>
              Cancel
            </button>
          </div>

          {/* Recent Orders */}
          <div style={{ marginTop: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#3d1f25' }}>Recent Orders</h2>
              <Link href="/products" style={{ fontSize: '13px', fontWeight: 700, color: '#b76e79', textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            <div style={{ border: '1px solid #fde8ec', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '520px' }}>
                  <thead>
                    <tr style={{ background: '#fdf6f0' }}>
                      {['Order ID', 'Items', 'Date', 'Total', 'Status'].map((h) => (
                        <th key={h} style={{
                          textAlign: 'left', padding: '12px 16px',
                          fontSize: '12px', fontWeight: 700, color: '#8c6468',
                          textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order, i) => {
                      const s = statusStyle(order.status);
                      return (
                        <tr key={order.id} style={{ borderTop: '1px solid #fde8ec' }}>
                          <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 700, color: '#3d1f25' }}>{order.id}</td>
                          <td style={{ padding: '14px 16px', fontSize: '13px', color: '#3d1f25' }}>{order.items}</td>
                          <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8c6468' }}>{order.date}</td>
                          <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 700, color: '#3d1f25' }}>Rs. {order.total.toLocaleString()}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              fontSize: '12px', fontWeight: 700, padding: '4px 10px',
                              borderRadius: '20px', color: s.color, background: s.background,
                            }}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .account-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Footer />
    </div>
  );
}
