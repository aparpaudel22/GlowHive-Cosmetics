'use client';

import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Lock, Mail, User as UserIcon, Gem } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const inputStyle = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: '14px',
  border: '1.5px solid #fde8ec',
  background: '#fdf6f0',
  fontSize: '14px',
  color: '#3d1f25',
  outline: 'none',
};

function Field({ icon: Icon, label, action, ...inputProps }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#3d1f25' }}>{label}</label>
        {action}
      </div>
      <div style={{ position: 'relative' }}>
        <input
          {...inputProps}
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#b76e79')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#fde8ec')}
        />
        {Icon && (
          <Icon
            size={16}
            color="#c9a3a9"
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
        )}
      </div>
    </div>
  );
}

function GoogleButton() {
  const { loginWithGoogle } = useAuth();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoGoogle = () => {
    setDemoLoading(true);
    setTimeout(() => {
      loginWithGoogle({
        name: 'Demo Google User',
        email: 'demo.user@gmail.com',
        picture: null,
      });
      toast.success('Signed in with Google (demo) ✨');
      setDemoLoading(false);
    }, 900);
  };

  if (!GOOGLE_CLIENT_ID) {
    // No Client ID configured yet — falls back to a labeled demo flow
    // instead of crashing. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local
    // (from Google Cloud Console → APIs & Services → Credentials) to
    // enable real Google Sign-In.
    return (
      <button
        onClick={handleDemoGoogle}
        disabled={demoLoading}
        style={{
          width: '100%', border: '1.5px solid #fde8ec', background: '#fff',
          padding: '13px', borderRadius: '14px', fontSize: '14px', fontWeight: 600,
          color: '#3d1f25', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '10px', opacity: demoLoading ? 0.7 : 1,
        }}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="" width={18} height={18} />
        {demoLoading ? 'Signing in…' : 'Continue with Google'}
      </button>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          width="100%"
          shape="pill"
          onSuccess={(credentialResponse) => {
            try {
              const profile = jwtDecode(credentialResponse.credential);
              loginWithGoogle({
                name: profile.name,
                email: profile.email,
                picture: profile.picture,
              });
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

export default function AuthForm() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', password: '', confirm: '', agree: false });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill in both fields.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    await login(loginData);
    toast.success('Signed in successfully 🎉');
    setLoading(false);
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
    if (!regData.agree) {
      toast.error('Please agree to the Terms & Conditions.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    await register(regData);
    toast.success('Account created — welcome to GlowHive ✨');
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #fdf0f3, #fff8f5 45%, #fdf6f0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{
          background: '#fff', borderRadius: '24px', overflow: 'hidden',
          border: '1px solid #fde8ec', boxShadow: '0 30px 60px rgba(183,110,121,0.14)',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #fde8ec' }}>
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '18px', fontSize: '13px', fontWeight: 700,
                  letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer',
                  border: 'none', background: tab === t ? '#fff' : '#fdf6f0',
                  color: tab === t ? '#3d1f25' : '#9ca3af',
                  borderBottom: tab === t ? '3px solid #b76e79' : '3px solid transparent',
                }}
              >
                {t === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '26px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%', background: '#fde8ec',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Gem size={20} color="#b76e79" />
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: 700, color: '#3d1f25' }}>
                  GlowHive
                </p>
                <p style={{ fontSize: '13px', color: '#8c6468' }}>
                  {tab === 'login' ? 'Welcome back! Sign in to continue.' : 'Join GlowHive for exclusive offers.'}
                </p>
              </div>
            </div>

            {tab === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <Field
                  icon={Mail} label="Email Address" type="email" placeholder="your@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData((d) => ({ ...d, email: e.target.value }))}
                />
                <Field
                  icon={Lock} label="Password" type="password" placeholder="••••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData((d) => ({ ...d, password: e.target.value }))}
                  action={<span style={{ fontSize: '12px', color: '#b76e79', cursor: 'pointer', fontWeight: 600 }}>Forgot password?</span>}
                />
                <button type="submit" disabled={loading} style={{
                  background: '#3d1f25', color: '#fff', border: 'none', borderRadius: '14px',
                  padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  opacity: loading ? 0.75 : 1,
                }}>
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#fde8ec' }} />
                  <span style={{ fontSize: '11px', color: '#c9a3a9', fontWeight: 600 }}>OR</span>
                  <div style={{ flex: 1, height: '1px', background: '#fde8ec' }} />
                </div>

                <GoogleButton />

                <p style={{ textAlign: 'center', fontSize: '13px', color: '#8c6468', marginTop: '6px' }}>
                  Don&apos;t have an account?{' '}
                  <span onClick={() => setTab('register')} style={{ color: '#b76e79', fontWeight: 700, cursor: 'pointer' }}>
                    Sign up →
                  </span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <Field
                  icon={UserIcon} label="Full Name" type="text" placeholder="Your full name"
                  value={regData.name}
                  onChange={(e) => setRegData((d) => ({ ...d, name: e.target.value }))}
                />
                <Field
                  icon={Mail} label="Email Address" type="email" placeholder="your@email.com"
                  value={regData.email}
                  onChange={(e) => setRegData((d) => ({ ...d, email: e.target.value }))}
                />
                <Field
                  icon={Lock} label="Password" type="password" placeholder="Create a strong password"
                  value={regData.password}
                  onChange={(e) => setRegData((d) => ({ ...d, password: e.target.value }))}
                />
                <Field
                  icon={Lock} label="Confirm Password" type="password" placeholder="••••••••••"
                  value={regData.confirm}
                  onChange={(e) => setRegData((d) => ({ ...d, confirm: e.target.value }))}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#8c6468', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={regData.agree}
                    onChange={(e) => setRegData((d) => ({ ...d, agree: e.target.checked }))}
                    style={{ width: '16px', height: '16px', accentColor: '#b76e79' }}
                  />
                  I agree to <span style={{ color: '#b76e79', fontWeight: 600 }}>Terms &amp; Conditions</span>
                </label>
                <button type="submit" disabled={loading} style={{
                  background: '#b76e79', color: '#fff', border: 'none', borderRadius: '14px',
                  padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  opacity: loading ? 0.75 : 1,
                }}>
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '13px', color: '#8c6468' }}>
                  Already have an account?{' '}
                  <span onClick={() => setTab('login')} style={{ color: '#b76e79', fontWeight: 700, cursor: 'pointer' }}>
                    Sign in →
                  </span>
                </p>
              </form>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#c9a3a9', marginTop: '24px' }}>
          © 2026 GlowHive • Premium Skincare &amp; Makeup
        </p>
      </div>
    </div>
  );
}
