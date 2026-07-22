'use client';

import { useState, useRef } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Lock, Mail, User as UserIcon, Eye, EyeOff, X, KeyRound, Phone, Camera, Scale } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const inputStyle = {
  width: '100%', padding: '13px 16px', borderRadius: '14px',
  border: '1.5px solid #fde8ec', background: '#fdf6f0',
  fontSize: '14px', color: '#3d1f25', outline: 'none', boxSizing: 'border-box',
};

/* ─── Field component — eye-toggle built-in for password fields ─── */
function Field({ icon: Icon, label, action, type = 'text', ...inputProps }) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword ? (showPw ? 'text' : 'password') : type;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#3d1f25' }}>{label}</label>
        {action}
      </div>
      <div style={{ position: 'relative' }}>
        <input
          {...inputProps}
          type={actualType}
          style={{ ...inputStyle, paddingRight: '42px' }}
          onFocus={e => (e.currentTarget.style.borderColor = '#b76e79')}
          onBlur={e  => (e.currentTarget.style.borderColor = '#fde8ec')}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            tabIndex={-1}
            style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
              display: 'flex', alignItems: 'center', color: '#c9a3a9',
            }}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : Icon ? (
          <Icon size={16} color="#c9a3a9"
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        ) : null}
      </div>
    </div>
  );
}

/* ─── Forgot-password modal ─── */
function ForgotPasswordModal({ onClose }) {
  const [step,    setStep]    = useState(1);
  const [email,   setEmail]   = useState('');
  const [newPw,   setNewPw]   = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const findAccount = (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Enter your email address.'); return; }
    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
      const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      setLoading(false);
      if (!found) {
        toast.error('No account found for that email.');
        return;
      }
      setEmail(found.email);
      setStep(2);
    }, 600);
  };

  const resetPassword = (e) => {
    e.preventDefault();
    if (newPw.length < 6)       { toast.error('Password must be at least 6 characters.');  return; }
    if (newPw !== confirm)       { toast.error('Passwords do not match.');                   return; }
    setLoading(true);
    setTimeout(() => {
      const users   = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
      const updated = users.map(u => u.email === email ? { ...u, password: newPw } : u);
      localStorage.setItem('glowhive_users', JSON.stringify(updated));
      setLoading(false);
      setStep(3);
    }, 600);
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(61,31,37,0.5)', backdropFilter: 'blur(6px)', zIndex: 9000 }}
      />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9001,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}>
        <div style={{
          background: '#fff', borderRadius: '24px', padding: '32px',
          width: 'min(420px, 96vw)', boxShadow: '0 32px 80px rgba(61,31,37,0.24)',
          position: 'relative',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: '16px', right: '16px',
            background: '#fdf6f0', border: 'none', borderRadius: '50%',
            width: '34px', height: '34px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={15} color="#8c6468" />
          </button>

          <div style={{
            width: '56px', height: '56px', borderRadius: '50%', background: '#fde8ec',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
          }}>
            <KeyRound size={24} color="#b76e79" />
          </div>

          {step === 1 && (
            <form onSubmit={findAccount} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '6px' }}>
                  Forgot Password?
                </h2>
                <p style={{ fontSize: '13px', color: '#8c6468', lineHeight: 1.6, margin: 0 }}>
                  Enter your registered email and we'll let you set a new password.
                </p>
              </div>
              <Field
                icon={Mail} label="Registered Email" type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading} style={{
                background: 'linear-gradient(135deg,#b76e79,#c2748a)', color: '#fff',
                border: 'none', borderRadius: '14px', padding: '14px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Looking up account…' : 'Continue →'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={resetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '6px' }}>
                  Set New Password
                </h2>
                <p style={{ fontSize: '13px', color: '#8c6468', lineHeight: 1.6, margin: 0 }}>
                  Account: <strong style={{ color: '#3d1f25' }}>{email}</strong>
                </p>
              </div>
              <Field
                label="New Password" type="password"
                placeholder="At least 6 characters"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                required
              />
              <Field
                label="Confirm New Password" type="password"
                placeholder="••••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
              <button type="submit" disabled={loading} style={{
                background: 'linear-gradient(135deg,#b76e79,#c2748a)', color: '#fff',
                border: 'none', borderRadius: '14px', padding: '14px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Saving…' : 'Reset Password →'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '14px' }}>🎉</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '8px' }}>
                Password Reset!
              </h2>
              <p style={{ fontSize: '13px', color: '#8c6468', lineHeight: 1.6, marginBottom: '22px' }}>
                Your password has been updated. You can now sign in with your new password.
              </p>
              <button onClick={onClose} style={{
                background: 'linear-gradient(135deg,#3d1f25,#5a3a40)', color: '#fff',
                border: 'none', borderRadius: '14px', padding: '13px 28px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer', width: '100%',
              }}>
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Terms & Conditions Modal ─── */
function TermsModal({ onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ 
          position: 'fixed', inset: 0, 
          background: 'rgba(61,31,37,0.6)', 
          backdropFilter: 'blur(8px)', 
          zIndex: 10000 
        }}
      />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 10001,
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        padding: '20px',
      }}>
        <div style={{
          background: '#fff', borderRadius: '24px', padding: '32px',
          width: 'min(700px, 96vw)', 
          maxHeight: '90vh',
          boxShadow: '0 32px 80px rgba(61,31,37,0.3)',
          position: 'relative',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Close button */}
          <button onClick={onClose} style={{
            position: 'sticky', top: 0, alignSelf: 'flex-end',
            background: '#fdf6f0', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            zIndex: 10,
            marginBottom: '16px',
          }}>
            <X size={18} color="#8c6468" />
          </button>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: '#fdf0f3',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Scale size={24} color="#b76e79" />
              </div>
              <h2 style={{
                fontSize: '24px', fontWeight: 800, color: '#3d1f25',
                fontFamily: "'Playfair Display', Georgia, serif",
                margin: 0,
              }}>
                Terms & Conditions
              </h2>
            </div>

            <div style={{ 
              fontSize: '14px', 
              color: '#5a3a40', 
              lineHeight: 1.9,
              maxHeight: 'calc(90vh - 200px)',
              overflowY: 'auto',
              paddingRight: '8px',
            }}>
              <p style={{ marginBottom: '16px' }}>
                <strong>Welcome to GlowHive!</strong> By using our website and services, you agree to the following terms and conditions.
              </p>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginTop: '20px', marginBottom: '8px' }}>
                1. Account Registration
              </h3>
              <p style={{ marginBottom: '12px' }}>
                To access certain features, you may need to create an account. You agree to provide accurate information and maintain the security of your account. You must be at least 16 years old to use our services.
              </p>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginTop: '16px', marginBottom: '8px' }}>
                2. Orders and Pricing
              </h3>
              <p style={{ marginBottom: '12px' }}>
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel orders. Prices are subject to change without notice.
              </p>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginTop: '16px', marginBottom: '8px' }}>
                3. Payment Terms
              </h3>
              <p style={{ marginBottom: '12px' }}>
                We accept Cash on Delivery, eSewa, Khalti, and Bank Transfer. By providing payment information, you authorize us to charge the total amount of your order.
              </p>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginTop: '16px', marginBottom: '8px' }}>
                4. Shipping and Delivery
              </h3>
              <p style={{ marginBottom: '12px' }}>
                We ship within Nepal. Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery to the shipping carrier.
              </p>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginTop: '16px', marginBottom: '8px' }}>
                5. Returns and Refunds
              </h3>
              <p style={{ marginBottom: '12px' }}>
                You may return items within 30 days of delivery if unused and in original packaging. Refunds are processed within 3-5 business days.
              </p>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginTop: '16px', marginBottom: '8px' }}>
                6. Intellectual Property
              </h3>
              <p style={{ marginBottom: '12px' }}>
                All content on our website is the property of GlowHive and is protected by intellectual property laws. You may not use our content without permission.
              </p>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginTop: '16px', marginBottom: '8px' }}>
                7. User-Generated Content
              </h3>
              <p style={{ marginBottom: '12px' }}>
                By submitting content, you grant us a non-exclusive, royalty-free license to use, reproduce, and distribute such content.
              </p>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginTop: '16px', marginBottom: '8px' }}>
                8. Privacy and Data Protection
              </h3>
              <p style={{ marginBottom: '12px' }}>
                Your privacy is important to us. We collect and use your personal information as described in our Privacy Policy.
              </p>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginTop: '16px', marginBottom: '8px' }}>
                9. Limitations of Liability
              </h3>
              <p style={{ marginBottom: '12px' }}>
                GlowHive shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website.
              </p>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginTop: '16px', marginBottom: '8px' }}>
                10. Governing Law
              </h3>
              <p style={{ marginBottom: '12px' }}>
                These terms are governed by the laws of Nepal. Any disputes shall be subject to the jurisdiction of courts in Kathmandu.
              </p>

              <div style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #fde8ec',
                fontSize: '12px',
                color: '#8c6468',
                textAlign: 'center',
              }}>
                <p>Effective Date: January 1, 2026</p>
                <p style={{ marginTop: '4px' }}>
                  For full details, please visit our{' '}
                  <Link href="/terms" style={{ color: '#b76e79', fontWeight: 600, textDecoration: 'underline' }}>
                    Terms & Conditions page
                  </Link>
                </p>
              </div>
            </div>

            {/* Accept Button */}
            <div style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #fde8ec',
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 32px',
                  background: 'linear-gradient(135deg, #b76e79, #c2748a)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Google button ─── */
function GoogleButton() {
  const { loginWithGoogle } = useAuth();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoGoogle = () => {
    setDemoLoading(true);
    setTimeout(() => {
      loginWithGoogle({ name: 'Demo Google User', email: 'demo.user@gmail.com', picture: null });
      toast.success('Signed in with Google ✨');
      setDemoLoading(false);
    }, 900);
  };

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button onClick={handleDemoGoogle} disabled={demoLoading} style={{
        width: '100%', border: '1.5px solid #fde8ec', background: '#fff',
        padding: '13px', borderRadius: '14px', fontSize: '14px', fontWeight: 600,
        color: '#3d1f25', cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '10px', opacity: demoLoading ? 0.7 : 1,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
            alt="Google" 
            width={18} 
            height={18} 
            style={{ display: 'inline-block' }}
          />
          {demoLoading ? 'Signing in…' : 'Continue with Google'}
        </span>
      </button>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          width="100%" shape="pill"
          onSuccess={(credentialResponse) => {
            try {
              const profile = jwtDecode(credentialResponse.credential);
              loginWithGoogle({ name: profile.name, email: profile.email, picture: profile.picture });
              toast.success(`Welcome, ${profile.given_name || profile.name}! 💗`);
            } catch {
              toast.error('Could not read your Google profile.');
            }
          }}
          onError={() => toast.error('Google sign-in failed. Try again.')}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

/* ─── Main AuthForm ─── */
export default function AuthForm({ redirectMessage }) {
  const { login, register } = useAuth();
  const fileRef = useRef(null);

  const [tab,           setTab]           = useState('login');
  const [loading,       setLoading]       = useState(false);
  const [showForgot,    setShowForgot]    = useState(false);
  const [showTerms,     setShowTerms]     = useState(false);
  const [loginData,     setLoginData]     = useState({ email: '', password: '' });
  const [regData,       setRegData]       = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirm: '', 
    agree: false,
    phone: '',
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Photo must be under 3 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target.result;
      setRegData(d => ({ ...d, avatar: b64 }));
      setAvatarPreview(b64);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setRegData(d => ({ ...d, avatar: null }));
    setAvatarPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill in both fields.');
      return;
    }
    setLoading(true);
    const result = await login(loginData.email, loginData.password);
    setLoading(false);
    
    if (result && typeof result === 'object') {
      if (!result.error) {
        toast.success('Signed in successfully 🎉');
      } else if (result.error === 'NO_ACCOUNT') {
        toast.error('No account found. Please register first!');
        setTab('register');
        setRegData(d => ({ ...d, email: loginData.email }));
      } else if (result.error === 'WRONG_PASSWORD') {
        toast.error('Incorrect password. Try again or reset it.');
      } else {
        toast.error('Sign in failed. Please try again.');
      }
    } else {
      toast.error('Sign in failed. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (regData.password !== regData.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (regData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (!regData.phone || regData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!regData.agree) {
      toast.error('Please agree to the Terms & Conditions.');
      return;
    }
    
    setLoading(true);
    const result = await register(
      regData.name, 
      regData.email, 
      regData.password, 
      regData.phone, 
      regData.avatar
    );
    setLoading(false);
    
    if (result && typeof result === 'object') {
      if (!result.error) {
        toast.success('Account created — welcome to GlowHive ✨');
      } else if (result.error === 'ALREADY_EXISTS') {
        toast.error('Email already registered. Please sign in.');
        setTab('login');
        setLoginData(d => ({ ...d, email: regData.email }));
      } else if (result.error === 'INVALID_PHONE') {
        toast.error('Invalid phone number. Please check and try again.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } else {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg,#fdf0f3,#fff8f5 45%,#fdf6f0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px',
      }}>
        <div style={{ maxWidth: '440px', width: '100%' }}>

          {redirectMessage && (
            <div style={{
              background: '#fef9ec', border: '1px solid #fde68a', borderRadius: '14px',
              padding: '12px 16px', marginBottom: '16px', fontSize: '13px',
              color: '#92400e', fontWeight: 600, textAlign: 'center',
            }}>
              🔒 {redirectMessage}
            </div>
          )}

          <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #fde8ec', boxShadow: '0 30px 60px rgba(183,110,121,0.14)' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #fde8ec' }}>
              {['login', 'register'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1, padding: '18px', fontSize: '13px', fontWeight: 700,
                  letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer',
                  border: 'none', background: tab === t ? '#fff' : '#fdf6f0',
                  color: tab === t ? '#3d1f25' : '#9ca3af',
                  borderBottom: tab === t ? '3px solid #b76e79' : '3px solid transparent',
                }}>
                  {t === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

            <div style={{ padding: '32px' }}>
              {/* ─── Logo Section - Using your logo image ─── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '26px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: '#fde8ec', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  overflow: 'hidden',
                  padding: '6px',
                }}>
                  <img 
                    src="/Logo-full.png" 
                    alt="GlowHive Logo" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span style="font-size:24px;font-weight:900;color:#b76e79;font-family:\'Playfair Display\',Georgia,serif;">G</span>';
                    }}
                  />
                </div>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: 700, color: '#3d1f25', margin: 0 }}>
                    GlowHive
                  </p>
                  <p style={{ fontSize: '13px', color: '#8c6468', margin: 0 }}>
                    {tab === 'login' ? 'Welcome back! Sign in to continue.' : 'Join GlowHive for exclusive offers.'}
                  </p>
                </div>
              </div>

              {tab === 'login' ? (
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <Field
                    icon={Mail} label="Email Address" type="email" placeholder="your@email.com"
                    value={loginData.email}
                    onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))}
                  />
                  <Field
                    label="Password" type="password" placeholder="••••••••••"
                    value={loginData.password}
                    onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))}
                    action={
                      <span
                        onClick={() => setShowForgot(true)}
                        style={{ fontSize: '12px', color: '#b76e79', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Forgot password?
                      </span>
                    }
                  />
                  <button type="submit" disabled={loading} style={{
                    background: '#3d1f25', color: '#fff', border: 'none', borderRadius: '14px',
                    padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.75 : 1,
                  }}>
                    {loading ? 'Signing in…' : 'Sign In →'}
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: '#fde8ec' }} />
                    <span style={{ fontSize: '11px', color: '#c9a3a9', fontWeight: 600 }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: '#fde8ec' }} />
                  </div>
                  <GoogleButton />
                  <p style={{ textAlign: 'center', fontSize: '13px', color: '#8c6468', marginTop: '6px', margin: 0 }}>
                    Don&apos;t have an account?{' '}
                    <span onClick={() => setTab('register')} style={{ color: '#b76e79', fontWeight: 700, cursor: 'pointer' }}>Sign up →</span>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Profile Photo Upload - OPTIONAL */}
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#3d1f25', display: 'block', marginBottom: '6px' }}>
                      Profile Photo <span style={{ color: '#c9a3a9', fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: avatarPreview ? 'transparent' : '#fdf6f0',
                        border: '2px dashed #fde8ec',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', position: 'relative', flexShrink: 0,
                      }}>
                        {avatarPreview ? (
                          <>
                            <img 
                              src={avatarPreview} 
                              alt="Profile" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button
                              type="button"
                              onClick={removeAvatar}
                              style={{
                                position: 'absolute', top: '-2px', right: '-2px',
                                background: '#b76e79', border: '2px solid #fff',
                                borderRadius: '50%', width: '20px', height: '20px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#fff', padding: 0,
                              }}
                            >
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <UserIcon size={24} color="#c9a3a9" />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleAvatarChange}
                        />
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          style={{
                            padding: '10px 16px', background: '#fdf6f0',
                            border: '1.5px solid #fde8ec', borderRadius: '10px',
                            cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                            color: '#b76e79', display: 'flex', alignItems: 'center',
                            gap: '8px', width: '100%', justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                        >
                          <Camera size={16} />
                          {avatarPreview ? 'Change Photo' : 'Upload Photo (Optional)'}
                        </button>
                        <p style={{ fontSize: '10px', color: '#c9a3a9', marginTop: '4px' }}>
                          Max 3MB • JPG, PNG, GIF • Not required
                        </p>
                      </div>
                    </div>
                  </div>

                  <Field
                    icon={UserIcon} label="Full Name *" type="text" placeholder="Your full name"
                    value={regData.name}
                    onChange={e => setRegData(d => ({ ...d, name: e.target.value }))}
                  />
                  <Field
                    icon={Mail} label="Email Address *" type="email" placeholder="your@email.com"
                    value={regData.email}
                    onChange={e => setRegData(d => ({ ...d, email: e.target.value }))}
                  />
                  
                  <Field
                    icon={Phone} label="Phone Number *" type="tel" placeholder="98XXXXXXXX"
                    value={regData.phone}
                    onChange={e => setRegData(d => ({ ...d, phone: e.target.value }))}
                  />
                  
                  <Field
                    label="Password *" type="password" placeholder="Create a strong password"
                    value={regData.password}
                    onChange={e => setRegData(d => ({ ...d, password: e.target.value }))}
                  />
                  <Field
                    label="Confirm Password *" type="password" placeholder="••••••••••"
                    value={regData.confirm}
                    onChange={e => setRegData(d => ({ ...d, confirm: e.target.value }))}
                  />
                  
                  {/* ─── TERMS & CONDITIONS CHECKBOX ─── */}
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    fontSize: '13px', 
                    color: '#8c6468', 
                    cursor: 'pointer' 
                  }}>
                    <input 
                      type="checkbox" 
                      checked={regData.agree}
                      onChange={e => setRegData(d => ({ ...d, agree: e.target.checked }))}
                      style={{ width: '16px', height: '16px', accentColor: '#b76e79' }} 
                    />
                    I agree to{' '}
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowTerms(true);
                      }}
                      style={{ 
                        color: '#b76e79', 
                        fontWeight: 600, 
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#c2748a'}
                      onMouseLeave={(e) => e.target.style.color = '#b76e79'}
                    >
                      Terms &amp; Conditions
                    </span>
                  </label>
                  
                  <button type="submit" disabled={loading} style={{
                    background: '#b76e79', color: '#fff', border: 'none', borderRadius: '14px',
                    padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.75 : 1,
                  }}>
                    {loading ? 'Creating account…' : 'Create Account'}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '13px', color: '#8c6468', margin: 0 }}>
                    Already have an account?{' '}
                    <span onClick={() => setTab('login')} style={{ color: '#b76e79', fontWeight: 700, cursor: 'pointer' }}>Sign in →</span>
                  </p>
                </form>
              )}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#c9a3a9', marginTop: '24px' }}>
            © 2026 GlowHive • Made with ❤️ for your GLOW.
          </p>
        </div>
      </div>
    </>
  );
}