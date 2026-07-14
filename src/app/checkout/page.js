'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, CreditCard, Truck,
  User, Edit3, Plus, CheckCircle, ChevronDown
} from 'lucide-react';
import { IoIosCash } from 'react-icons/io';
import { BsBank } from 'react-icons/bs';
import { useCart } from '@/context/CartContext';

const CITIES = [
  'Kathmandu','Pokhara','Lalitpur','Biratnagar','Bhaktapur',
  'Butwal','Dharan','Hetauda','Janakpur','Nepalgunj',
];
const PROVINCES = [
  'Bagmati','Lumbini','Province 1','Province 2',
  'Gandaki','Karnali','Sudurpashchim',
];
const PAYMENT_METHODS = [
  {
    id: 'cod', name: 'Cash on Delivery',
    desc: 'Pay when you receive your order',
    icon: <IoIosCash size={20} color="#b76e79" />,
  },
  {
    id: 'esewa', name: 'eSewa',
    desc: 'Pay via eSewa wallet',
    icon: <img src="/esewa.png" alt="esewa" style={{ width: 22, height: 22, objectFit: 'contain' }} />,
  },
  {
    id: 'khalti', name: 'Khalti',
    desc: 'Pay via Khalti wallet',
    icon: <img src="/khalti.png" alt="khalti" style={{ width: 22, height: 22, objectFit: 'contain' }} />,
  },
  {
    id: 'bank', name: 'Bank Transfer',
    desc: 'Direct bank transfer',
    icon: <BsBank size={18} color="#b76e79" />,
  },
];

const label = {
  display: 'block', fontSize: '12px', fontWeight: 700,
  color: '#3d1f25', marginBottom: '6px', textTransform: 'uppercase',
  letterSpacing: '0.5px',
};
const inp = (err) => ({
  width: '100%', padding: '11px 14px', fontFamily: 'inherit',
  border: `1.5px solid ${err ? '#f87171' : '#fde8ec'}`,
  borderRadius: '12px', fontSize: '14px', outline: 'none',
  background: '#fff', color: '#3d1f25', transition: 'border 0.2s',
});

const BLANK_ADDRESS = {
  address: '', city: '', province: '', postalCode: '',
};
const BLANK_PROFILE = {
  firstName: '', lastName: '', email: '', phone: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems = [], clearCart } = useCart?.() ?? { cartItems: [], clearCart: () => {} };

  const [step,             setStep]             = useState(1);
  const [savedProfile,     setSavedProfile]     = useState(null);
  const [savedAddresses,   setSavedAddresses]   = useState([]);
  const [selectedAddrIdx,  setSelectedAddrIdx]  = useState(0);
  const [editingProfile,   setEditingProfile]   = useState(false);
  const [addingAddress,    setAddingAddress]    = useState(false);
  const [profile,          setProfile]          = useState(BLANK_PROFILE);
  const [addrForm,         setAddrForm]         = useState(BLANK_ADDRESS);
  const [profileErrors,    setProfileErrors]    = useState({});
  const [addrErrors,       setAddrErrors]       = useState({});
  const [selectedMethod,   setSelectedMethod]   = useState(null);
  const [placing,          setPlacing]          = useState(false);

  // ── Load from localStorage on mount ──
  useEffect(() => {
    try {
      const p = localStorage.getItem('glowhive_profile');
      const a = localStorage.getItem('glowhive_addresses');
      if (p) {
        const parsed = JSON.parse(p);
        setSavedProfile(parsed);
        setProfile(parsed);
      } else {
        setEditingProfile(true);
      }
      if (a) {
        const addrs = JSON.parse(a);
        setSavedAddresses(addrs);
        if (addrs.length) setAddrForm(addrs[0]);
      } else {
        setAddingAddress(true);
      }
    } catch (_) {}
  }, []);

  // Use mock cart if context empty
  const items = cartItems.length
    ? cartItems
    : [
        { id: 1, name: 'Rose Glow Vitamin C Serum', price: 1999, quantity: 1 },
        { id: 2, name: 'Velvet Matte Lipstick',     price: 699,  quantity: 2 },
      ];

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = addrForm.city === 'Kathmandu' ? 0 : 150;
  const total    = subtotal + shipping;

  // ── Helpers ──
  const updateProfile = (k, v) => {
    setProfile(p => ({ ...p, [k]: v }));
    if (profileErrors[k]) setProfileErrors(e => ({ ...e, [k]: '' }));
  };
  const updateAddr = (k, v) => {
    setAddrForm(a => ({ ...a, [k]: v }));
    if (addrErrors[k]) setAddrErrors(e => ({ ...e, [k]: '' }));
  };

  const validateProfile = () => {
    const e = {};
    if (!profile.firstName.trim()) e.firstName = 'Required';
    if (!profile.lastName.trim())  e.lastName  = 'Required';
    if (!profile.email.trim())     e.email     = 'Required';
    else if (!/\S+@\S+\.\S+/.test(profile.email)) e.email = 'Invalid email';
    if (!profile.phone.trim())     e.phone     = 'Required';
    else if (profile.phone.replace(/\D/g, '').length < 10) e.phone = 'Must be 10 digits';
    setProfileErrors(e);
    return !Object.keys(e).length;
  };
  const validateAddr = () => {
    const e = {};
    if (!addrForm.address.trim()) e.address  = 'Required';
    if (!addrForm.city)           e.city     = 'Required';
    if (!addrForm.province)       e.province = 'Required';
    setAddrErrors(e);
    return !Object.keys(e).length;
  };

  // ── Continue to payment ──
  const handleNext = () => {
    const profileOk = editingProfile ? validateProfile() : true;
    const addrOk    = addingAddress  ? validateAddr()    : true;
    if (!profileOk || !addrOk) return;

    // Persist profile
    const finalProfile = editingProfile ? profile : savedProfile;
    localStorage.setItem('glowhive_profile', JSON.stringify(finalProfile));
    setSavedProfile(finalProfile);
    setEditingProfile(false);

    // Persist address
    let addrs = [...savedAddresses];
    if (addingAddress) {
      addrs = [addrForm, ...addrs.filter((_, i) => i < 4)]; // keep max 5
      localStorage.setItem('glowhive_addresses', JSON.stringify(addrs));
      setSavedAddresses(addrs);
      setSelectedAddrIdx(0);
      setAddingAddress(false);
    } else {
      setAddrForm(savedAddresses[selectedAddrIdx]);
    }
    setStep(2);
  };

  // ── Place order ──
  const handlePlaceOrder = () => {
    if (!selectedMethod) { alert('Please select a payment method'); return; }
    setPlacing(true);

    const fp = savedProfile ?? profile;
    const fa = addingAddress ? addrForm : (savedAddresses[selectedAddrIdx] ?? addrForm);

    const orderId = 'GH-' + Date.now();
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      items,
      profile: fp,
      address: fa,
      paymentMethod: selectedMethod.id,
      paymentName: selectedMethod.name,
      subtotal, shipping, total,
      status: 'placed',
      statusHistory: [
        { status: 'placed', label: 'Order Placed', time: new Date().toISOString() },
      ],
      estimatedDelivery: new Date(
        Date.now() + 4 * 24 * 60 * 60 * 1000
      ).toLocaleDateString('en-NP', { weekday: 'long', month: 'long', day: 'numeric' }),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('glowhive_orders') || '[]');
      localStorage.setItem('glowhive_orders', JSON.stringify([order, ...existing]));
    } catch (_) {}

    if (clearCart) clearCart();
    setTimeout(() => router.push('/checkout/success?id=' + orderId), 400);
  };

  // ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#fdf0f3,#fff8f5)',
        borderBottom: '1px solid #fde8ec', padding: '24px 28px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <button onClick={() => router.back()} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', color: '#b76e79',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginBottom: '12px',
          }}>
            <ArrowLeft size={15} /> Back
          </button>
          <h1 style={{
            fontSize: '26px', fontWeight: 800, color: '#3d1f25',
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>Checkout</h1>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
            {[{ n: 1, label: 'Delivery' }, { n: 2, label: 'Payment' }].map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: step >= s.n ? 'linear-gradient(135deg,#b76e79,#c2748a)' : '#fde8ec',
                  color: step >= s.n ? '#fff' : '#9ca3af',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 800,
                }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: step >= s.n ? '#3d1f25' : '#9ca3af' }}>
                  {s.label}
                </span>
                {i === 0 && (
                  <div style={{
                    width: '48px', height: '2px', borderRadius: '2px',
                    background: step >= 2 ? '#b76e79' : '#fde8ec',
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>

          {/* ── LEFT PANEL ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ════ STEP 1 — ADDRESS ════ */}
            {step === 1 && (
              <>
                {/* ── Profile Card ── */}
                <div style={{
                  background: '#fff', border: '1px solid #fde8ec',
                  borderRadius: '20px', padding: '24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: '#fde8ec', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <User size={17} color="#b76e79" />
                      </div>
                      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#3d1f25' }}>
                        {savedProfile && !editingProfile ? 'Your Profile' : 'Personal Details'}
                      </h2>
                    </div>
                    {savedProfile && !editingProfile && (
                      <button
                        onClick={() => setEditingProfile(true)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          background: '#fdf0f3', border: '1px solid #fde8ec',
                          borderRadius: '50px', padding: '6px 14px', cursor: 'pointer',
                          fontSize: '12px', fontWeight: 700, color: '#b76e79',
                        }}
                      >
                        <Edit3 size={11} /> Edit
                      </button>
                    )}
                  </div>

                  {/* Saved profile (read-only) */}
                  {savedProfile && !editingProfile ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {[
                        ['Name',  `${savedProfile.firstName} ${savedProfile.lastName}`],
                        ['Phone', savedProfile.phone],
                        ['Email', savedProfile.email, '1 / -1'],
                      ].map(([lbl, val, col]) => (
                        <div key={lbl} style={{
                          background: '#fdf6f0', borderRadius: '10px', padding: '10px 14px',
                          gridColumn: col,
                        }}>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: '#b76e79', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>{lbl}</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#3d1f25' }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Editable profile form */
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      {[
                        { key: 'firstName', label: 'First Name *', placeholder: 'Ram',           type: 'text' },
                        { key: 'lastName',  label: 'Last Name *',  placeholder: 'Sharma',         type: 'text' },
                        { key: 'email',     label: 'Email *',      placeholder: 'ram@email.com',  type: 'email', col: '1/-1' },
                        { key: 'phone',     label: 'Phone *',      placeholder: '98XXXXXXXX',     type: 'tel',   col: '1/-1' },
                      ].map(f => (
                        <div key={f.key} style={{ gridColumn: f.col }}>
                          <label style={label}>{f.label}</label>
                          <input
                            type={f.type}
                            value={profile[f.key]}
                            onChange={e => updateProfile(f.key, e.target.value)}
                            placeholder={f.placeholder}
                            style={inp(profileErrors[f.key])}
                          />
                          {profileErrors[f.key] && (
                            <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>
                              {profileErrors[f.key]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Delivery Address ── */}
                <div style={{
                  background: '#fff', border: '1px solid #fde8ec',
                  borderRadius: '20px', padding: '24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: '#fde8ec', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <MapPin size={17} color="#b76e79" />
                      </div>
                      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#3d1f25' }}>Delivery Location</h2>
                    </div>
                    {savedAddresses.length > 0 && !addingAddress && (
                      <button
                        onClick={() => setAddingAddress(true)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          background: 'linear-gradient(135deg,#b76e79,#c2748a)',
                          border: 'none', borderRadius: '50px', padding: '7px 14px',
                          cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: '#fff',
                        }}
                      >
                        <Plus size={11} /> New Address
                      </button>
                    )}
                  </div>

                  {/* Saved address cards */}
                  {savedAddresses.length > 0 && !addingAddress && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                      {savedAddresses.map((addr, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ y: -2 }}
                          onClick={() => { setSelectedAddrIdx(i); setAddrForm(addr); }}
                          style={{
                            border: `2px solid ${selectedAddrIdx === i ? '#b76e79' : '#fde8ec'}`,
                            borderRadius: '14px', padding: '14px 16px', cursor: 'pointer',
                            background: selectedAddrIdx === i ? '#fef5f7' : '#fff',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#3d1f25', marginBottom: '3px' }}>
                              {addr.address}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8c6468' }}>
                              {addr.city}, {addr.province} {addr.postalCode && `– ${addr.postalCode}`}
                            </div>
                          </div>
                          <div style={{
                            width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                            border: `2px solid ${selectedAddrIdx === i ? '#b76e79' : '#fde8ec'}`,
                            background: selectedAddrIdx === i ? '#b76e79' : '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {selectedAddrIdx === i && (
                              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff' }} />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* New address form */}
                  <AnimatePresence>
                    {addingAddress && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        {savedAddresses.length > 0 && (
                          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => setAddingAddress(false)}
                              style={{
                                background: 'none', border: 'none', color: '#8c6468',
                                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                              }}
                            >
                              ✕ Cancel
                            </button>
                          </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div style={{ gridColumn: '1/-1' }}>
                            <label style={label}>Street Address *</label>
                            <input
                              value={addrForm.address}
                              onChange={e => updateAddr('address', e.target.value)}
                              placeholder="Tole, Ward No., Street"
                              style={inp(addrErrors.address)}
                            />
                            {addrErrors.address && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{addrErrors.address}</p>}
                          </div>
                          <div>
                            <label style={label}>City *</label>
                            <select value={addrForm.city} onChange={e => updateAddr('city', e.target.value)} style={{ ...inp(addrErrors.city), cursor: 'pointer' }}>
                              <option value="">Select city</option>
                              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {addrErrors.city && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{addrErrors.city}</p>}
                          </div>
                          <div>
                            <label style={label}>Province *</label>
                            <select value={addrForm.province} onChange={e => updateAddr('province', e.target.value)} style={{ ...inp(addrErrors.province), cursor: 'pointer' }}>
                              <option value="">Select province</option>
                              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            {addrErrors.province && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{addrErrors.province}</p>}
                          </div>
                          <div>
                            <label style={label}>Postal Code</label>
                            <input value={addrForm.postalCode} onChange={e => updateAddr('postalCode', e.target.value)} placeholder="44600" style={inp()} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Continue button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 32px rgba(183,110,121,0.30)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  style={{
                    background: 'linear-gradient(135deg,#b76e79,#c2748a)',
                    color: '#fff', width: '100%', padding: '15px',
                    borderRadius: '14px', border: 'none', fontWeight: 800,
                    fontSize: '15px', cursor: 'pointer',
                  }}
                >
                  Continue to Payment →
                </motion.button>
              </>
            )}

            {/* ════ STEP 2 — PAYMENT ════ */}
            {step === 2 && (
              <div style={{
                background: '#fff', border: '1px solid #fde8ec',
                borderRadius: '20px', padding: '28px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fde8ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={17} color="#b76e79" />
                  </div>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#3d1f25' }}>Payment Method</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PAYMENT_METHODS.map(m => (
                    <motion.div
                      key={m.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMethod(m)}
                      style={{
                        border: `2px solid ${selectedMethod?.id === m.id ? '#b76e79' : '#fde8ec'}`,
                        borderRadius: '14px', padding: '16px', cursor: 'pointer',
                        background: selectedMethod?.id === m.id ? '#fef5f7' : '#fff',
                        display: 'flex', alignItems: 'center', gap: '14px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: '#fde8ec', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {m.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#3d1f25', fontSize: '14px' }}>{m.name}</div>
                        <div style={{ fontSize: '12px', color: '#8c6468', marginTop: '2px' }}>{m.desc}</div>
                      </div>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        border: `2px solid ${selectedMethod?.id === m.id ? '#b76e79' : '#fde8ec'}`,
                        background: selectedMethod?.id === m.id ? '#b76e79' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {selectedMethod?.id === m.id && (
                          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff' }} />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Info box */}
                <div style={{
                  marginTop: '20px', background: '#fdf6f0', borderRadius: '12px',
                  padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}>
                  <Truck size={16} color="#b76e79" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '12px', color: '#5a3a40', lineHeight: 1.6 }}>
                    Your order will be delivered within <strong>3–5 business days</strong>.
                    {addrForm.city === 'Kathmandu' ? ' Free shipping applies! 🎉' : ' A shipping charge of Rs. 150 applies.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <motion.button
                    whileHover={{ background: '#fde8ec' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(1)}
                    style={{
                      background: '#fff', color: '#b76e79', border: '1.5px solid #b76e79',
                      padding: '13px 20px', borderRadius: '12px',
                      fontWeight: 700, cursor: 'pointer', flex: 1, fontSize: '14px',
                    }}
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 32px rgba(183,110,121,0.30)' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    style={{
                      background: 'linear-gradient(135deg,#b76e79,#c2748a)',
                      color: '#fff', border: 'none', padding: '13px 20px',
                      borderRadius: '12px', fontWeight: 800, cursor: placing ? 'wait' : 'pointer',
                      flex: 2, fontSize: '15px',
                    }}
                  >
                    {placing ? 'Placing Order…' : 'Place Order 🛍️'}
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT — ORDER SUMMARY ── */}
          <div style={{
            background: '#fff', border: '1px solid #fde8ec',
            borderRadius: '20px', padding: '24px',
            position: 'sticky', top: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Truck size={17} color="#b76e79" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#3d1f25' }}>Order Summary</h3>
            </div>

            <div style={{ maxHeight: '260px', overflowY: 'auto', marginBottom: '14px' }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '10px', fontSize: '13px',
                }}>
                  <span style={{ color: '#8c6468', maxWidth: '160px', lineHeight: 1.4 }}>
                    {item.name} <span style={{ fontWeight: 700 }}>× {item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: 700, color: '#3d1f25', flexShrink: 0 }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #fde8ec', paddingTop: '14px' }}>
              {[
                ['Subtotal', `Rs. ${subtotal.toLocaleString()}`],
                ['Shipping', shipping === 0 ? 'FREE' : `Rs. ${shipping}`],
              ].map(([lbl, val]) => (
                <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#8c6468' }}>{lbl}</span>
                  <span style={{
                    fontWeight: 600,
                    color: lbl === 'Shipping' && shipping === 0 ? '#22c55e' : '#3d1f25',
                  }}>{val}</span>
                </div>
              ))}
              <div style={{
                borderTop: '2px solid #fde8ec', marginTop: '10px', paddingTop: '10px',
                display: 'flex', justifyContent: 'space-between',
                fontWeight: 800, fontSize: '17px', color: '#3d1f25',
              }}>
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Address preview */}
            {(addrForm.city || (savedAddresses[selectedAddrIdx]?.city)) && (
              <div style={{
                marginTop: '14px', background: '#fdf6f0', borderRadius: '10px',
                padding: '10px 12px', fontSize: '12px', color: '#5a3a40', lineHeight: 1.6,
              }}>
                <div style={{ fontWeight: 700, color: '#b76e79', marginBottom: '3px', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>Delivering to</div>
                📍 {(addingAddress ? addrForm : savedAddresses[selectedAddrIdx])?.address},
                {' '}{(addingAddress ? addrForm : savedAddresses[selectedAddrIdx])?.city},
                {' '}{(addingAddress ? addrForm : savedAddresses[selectedAddrIdx])?.province}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}