'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Changed from 'next/router'
import Link from 'next/link';
import { CheckCircle, ArrowLeft, MapPin, CreditCard, Truck } from 'lucide-react';
import { IoIosCash } from "react-icons/io";
import { BsBank } from "react-icons/bs";

// Cities and Provinces data
const CITIES = ['Kathmandu', 'Pokhara', 'Lalitpur', 'Biratnagar', 'Bhaktapur', 'Butwal', 'Dharan', 'Hetauda', 'Janakpur', 'Nepalgunj'];
const PROVINCES = ['Bagmati', 'Lumbini', 'Province 1', 'Province 2', 'Gandaki', 'Karnali', 'Sudurpashchim'];

// Payment methods
const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', logo: (size = 'sm') => <span style={{ fontSize: size === 'sm' ? '14px' : '18px' }}><IoIosCash /></span> },
  { id: 'esewa', name: 'eSewa', logo: (size = 'sm') => <span style={{ fontSize: size === 'sm' ? '14px' : '18px' }}><img src="/esewa.png" alt="esewa" style={{ width: size === 'sm' ? '16px' : '20px',height: size === 'sm' ? '16px' : '20px',objectFit: 'contain',display: 'block'}} /></span> },
  { id: 'khalti', name: 'Khalti', logo: (size = 'sm') => <span style={{ fontSize: size === 'sm' ? '14px' : '18px' }}><img src="/khalti.png" alt="khalti" style={{ width: size === 'sm' ? '120px' : '120px',height: size === 'sm' ? '120px' : '120px',objectFit: 'contain',display: 'block'}} /></span> },
  { id: 'bank', name: 'Bank Transfer', logo: (size = 'sm') => <span style={{ fontSize: size === 'sm' ? '14px' : '18px' }}><BsBank /></span> }
];

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#3d1f25',
  marginBottom: '6px'
};

const inputStyle = (field, errors = {}) => ({
  width: '100%',
  padding: '10px 12px',
  border: `1.5px solid ${errors[field] ? '#f87171' : '#fde8ec'}`,
  borderRadius: '10px',
  fontSize: '14px',
  outline: 'none',
  transition: 'all 0.2s',
  fontFamily: 'inherit'
});

export default function Checkout() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedMethod, setSelectedMethod] = useState(null);
  
  // Mock cart data - replace with actual cart context
  const [cartItems] = useState([
    { id: 1, name: 'Product 1', price: 1500, quantity: 2 },
    { id: 2, name: 'Product 2', price: 2500, quantity: 1 }
  ]);
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = form.city === 'Kathmandu' ? 0 : 150;
  const total = subtotal + shipping;

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone number must be 10 digits';
    if (!form.address.trim()) newErrors.address = 'Street address is required';
    if (!form.city) newErrors.city = 'City is required';
    if (!form.province) newErrors.province = 'Province is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    setStep(3);
    // Here you would typically send order data to your backend
  };

  // ── Order confirmed ──
  if (step === 3) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #b76e79, #e8a4b0)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(183,110,121,0.3)' }}>
            <CheckCircle size={48} color="#fff" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '12px' }}>Order Confirmed! 🎉</h1>
          <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.7, marginBottom: '8px' }}>
            Thank you, <strong style={{ color: '#3d1f25' }}>{form.firstName}!</strong> Your order has been placed successfully.
          </p>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
            Confirmation sent to <strong>{form.email}</strong>. Expected delivery: <strong>3–5 business days</strong>.
          </p>
          <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '16px', padding: '20px', marginBottom: '28px', textAlign: 'left' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#b76e79', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px' }}>Order Summary</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              <span>Subtotal</span><span style={{ fontWeight: 600, color: '#3d1f25' }}>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              <span>Shipping</span><span style={{ fontWeight: 600, color: shipping === 0 ? '#22c55e' : '#3d1f25' }}>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
            </div>
            <div style={{ borderTop: '1px solid #fde8ec', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#3d1f25' }}>
              <span>Total Paid</span><span>Rs. {total.toLocaleString()}</span>
            </div>
            <div style={{ marginTop: '10px', background: '#fdf6f0', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#3d1f25' }}>
              📦 Delivering to: <strong>{form.address}, {form.city}, {form.province}</strong>
            </div>
            <div style={{ marginTop: '8px', background: '#fdf6f0', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#3d1f25', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💳 Payment: {selectedMethod && selectedMethod.logo('sm')} {selectedMethod?.name}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{ background: '#b76e79', color: '#fff', padding: '13px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>Back to Home</Link>
            <Link href="/products" style={{ background: '#fff', color: '#b76e79', border: '1.5px solid #b76e79', padding: '13px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #fdf0f3, #fff8f5)', borderBottom: '1px solid #fde8ec', padding: '28px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#b76e79', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginBottom: '14px', padding: 0 }}>
            <ArrowLeft size={15} /> Back
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif" }}>Checkout</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
            {[{ n: 1, label: 'Address' }, { n: 2, label: 'Payment' }].map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= s.n ? '#b76e79' : '#fde8ec', color: step >= s.n ? '#fff' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: step >= s.n ? '#3d1f25' : '#9ca3af' }}>{s.label}</span>
                {i === 0 && <div style={{ width: '40px', height: '2px', background: step >= 2 ? '#b76e79' : '#fde8ec', borderRadius: '2px' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
          {/* ── Left panel ── */}
          <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '20px', padding: '28px' }}>
            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fde8ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={18} color="#b76e79" /></div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#3d1f25' }}>Delivery Address</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>First Name *</label>
                    <input value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Ram" style={inputStyle('firstName', errors)} />
                    {errors.firstName && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.firstName}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name *</label>
                    <input value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Sharma" style={inputStyle('lastName', errors)} />
                    {errors.lastName && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.lastName}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="ram@email.com" style={inputStyle('email', errors)} />
                    {errors.email && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.email}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="98XXXXXXXX" style={inputStyle('phone', errors)} />
                    {errors.phone && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.phone}</p>}
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Street Address *</label>
                    <input value={form.address} onChange={e => update('address', e.target.value)} placeholder="Tole, Ward No., Street" style={inputStyle('address', errors)} />
                    {errors.address && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.address}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>City *</label>
                    <select value={form.city} onChange={e => update('city', e.target.value)} style={{ ...inputStyle('city', errors), cursor: 'pointer' }}>
                      <option value="">Select city</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.city && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.city}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Province *</label>
                    <select value={form.province} onChange={e => update('province', e.target.value)} style={{ ...inputStyle('province', errors), cursor: 'pointer' }}>
                      <option value="">Select province</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.province && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.province}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Postal Code</label>
                    <input value={form.postalCode} onChange={e => update('postalCode', e.target.value)} placeholder="44600" style={inputStyle('postalCode', errors)} />
                  </div>
                </div>
                <button onClick={handleNext} style={{ background: '#b76e79', color: '#fff', width: '100%', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '15px', marginTop: '28px', cursor: 'pointer' }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fde8ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CreditCard size={18} color="#b76e79" /></div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#3d1f25' }}>Payment Method</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {PAYMENT_METHODS.map(method => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method)}
                      style={{
                        border: `2px solid ${selectedMethod?.id === method.id ? '#b76e79' : '#fde8ec'}`,
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        background: selectedMethod?.id === method.id ? '#fef5f7' : '#fff',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fde8ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {method.logo()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#3d1f25', marginBottom: '4px' }}>{method.name}</div>
                          {method.id === 'cod' && <div style={{ fontSize: '12px', color: '#6b7280' }}>Pay when you receive your order</div>}
                          {method.id === 'esewa' && <div style={{ fontSize: '12px', color: '#6b7280' }}>Pay via eSewa wallet</div>}
                          {method.id === 'khalti' && <div style={{ fontSize: '12px', color: '#6b7280' }}>Pay via Khalti wallet</div>}
                          {method.id === 'bank' && <div style={{ fontSize: '12px', color: '#6b7280' }}>Direct bank transfer</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                  <button onClick={() => setStep(1)} style={{ background: '#fff', color: '#b76e79', border: '1.5px solid #b76e79', padding: '12px 20px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', flex: 1 }}>
                    ← Back
                  </button>
                  <button onClick={handlePlaceOrder} style={{ background: '#b76e79', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', flex: 1 }}>
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right panel (Order Summary) ── */}
          <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '20px', padding: '24px', position: 'sticky', top: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Truck size={18} color="#b76e79" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#3d1f25' }}>Order Summary</h3>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                  <span style={{ color: '#6b7280' }}>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600, color: '#3d1f25' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #fde8ec', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>Shipping</span>
                <span style={{ color: shipping === 0 ? '#22c55e' : '#3d1f25', fontWeight: shipping === 0 ? 600 : 400 }}>
                  {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
                </span>
              </div>
              <div style={{ borderTop: '2px solid #fde8ec', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '18px', color: '#3d1f25' }}>
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}