'use client';

import { motion } from 'framer-motion';
import { 
  Cookie, 
  Shield, 
  Eye, 
  Settings, 
  Lock, 
  CheckCircle,
  AlertCircle,
  Gem,
  Mail, 
  Phone,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const sections = [
  {
    id: 'introduction',
    icon: <Cookie size={20} color="#b76e79" />,
    title: 'What Are Cookies?',
    content: `Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.

    Cookies help us:
    • Remember your preferences and settings
    • Understand how you use our website
    • Improve your browsing experience
    • Personalize content and advertisements

    This Cookies Policy explains what cookies are, how we use them, and how you can control them.`
  },
  {
    id: 'how-we-use',
    icon: <Settings size={20} color="#b76e79" />,
    title: 'How We Use Cookies',
    content: `We use cookies for the following purposes:

    • Essential Cookies: These are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.

    • Performance Cookies: These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website.

    • Functional Cookies: These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.

    • Targeting/Advertising Cookies: These cookies are used to deliver advertisements that are more relevant to you and your interests. They also help us measure the effectiveness of advertising campaigns.`
  },
  {
    id: 'types',
    icon: <Eye size={20} color="#b76e79" />,
    title: 'Types of Cookies We Use',
    content: `We use both session and persistent cookies on our website:

    • Session Cookies: These are temporary cookies that are erased when you close your browser. They are used to remember your actions during a single browsing session.

    • Persistent Cookies: These remain on your device for a set period or until you delete them. They are used to remember your preferences and actions across multiple visits.

    • First-Party Cookies: These are set by us directly and are used to remember your preferences and settings on our website.

    • Third-Party Cookies: These are set by third-party services we use, such as analytics providers and advertising partners.`
  },
  {
    id: 'third-party',
    icon: <Shield size={20} color="#b76e79" />,
    title: 'Third-Party Cookies',
    content: `We use third-party services that may place cookies on your device:

    • Google Analytics: Helps us understand how visitors use our website. The data collected is anonymous and used for statistical purposes.

    • Payment Processors: Our payment partners (eSewa, Khalti) may use cookies to process payments securely.

    • Social Media: If you interact with our social media buttons, platforms like Instagram, Facebook, and YouTube may place cookies on your device.

    • Advertising Partners: We may work with advertising networks to display relevant ads based on your browsing behavior.

    We do not control the cookies placed by third parties and recommend reviewing their respective privacy policies.`
  },
  {
    id: 'control',
    icon: <Settings size={20} color="#b76e79" />,
    title: 'How to Control Cookies',
    content: `You can control and manage cookies in various ways:

    • Browser Settings: Most browsers allow you to control cookies through their settings. You can choose to accept all cookies, reject all cookies, or be notified when a cookie is set.

    • Browser Extensions: Some browser extensions can help you manage cookies and block tracking.

    • Opt-Out Tools: Many third-party services offer opt-out tools that allow you to prevent their cookies from being set.

    Please note that restricting or disabling cookies may affect the functionality of our website and your user experience.

    To manage cookies in your browser:
    • Chrome: Settings → Privacy and Security → Cookies and other site data
    • Firefox: Options → Privacy & Security → Cookies and Site Data
    • Safari: Preferences → Privacy → Cookies and website data
    • Edge: Settings → Cookies and site permissions → Manage and delete cookies and site data`
  },
  {
    id: 'consent',
    icon: <CheckCircle size={20} color="#b76e79" />,
    title: 'Your Consent',
    content: `By using our website, you consent to our use of cookies in accordance with this Cookies Policy. When you first visit our website, you will see a cookie banner that allows you to:

    • Accept all cookies
    • Customize your cookie preferences
    • Reject non-essential cookies

    You can change your cookie preferences at any time by clicking the "Cookie Settings" link in our footer or by adjusting your browser settings.

    We respect your privacy and give you control over your cookie preferences. Your choices will be remembered for future visits.`
  },
  {
    id: 'changes',
    icon: <AlertCircle size={20} color="#b76e79" />,
    title: 'Changes to This Policy',
    content: `We may update this Cookies Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new policy on this page and updating the effective date.

    We encourage you to review this Cookies Policy periodically for any updates. Your continued use of our services after any changes indicates your acceptance of the updated policy.

    Effective Date: January 1, 2026`
  },
  {
    id: 'contact',
    icon: <Mail size={20} color="#b76e79" />,
    title: 'Contact Us',
    content: `If you have any questions, concerns, or requests regarding this Cookies Policy or our use of cookies, please contact us:

    📧 Email: support@glowhive.com
    📞 Phone: +977 984-1234567
    📍 Address: Kathmandu, Nepal

    Our customer support team is available 9 AM to 9 PM, 7 days a week to assist you with any cookie-related questions.`
  }
];

const quickLinks = [
  { label: 'What Are Cookies?', id: 'introduction' },
  { label: 'How We Use Cookies', id: 'how-we-use' },
  { label: 'Types of Cookies', id: 'types' },
  { label: 'Third-Party Cookies', id: 'third-party' },
  { label: 'How to Control Cookies', id: 'control' },
  { label: 'Your Consent', id: 'consent' },
  { label: 'Changes to Policy', id: 'changes' },
  { label: 'Contact Us', id: 'contact' },
];

export default function CookiesPage() {
  return (
    <>
      <div style={{ minHeight: '100vh', background: '#fdf8f4' }}>

        {/* ─── Hero Section ─── */}
        <div style={{
          background: 'linear-gradient(135deg, #3d1f25 0%, #b76e79 60%, #e8a4b0 100%)',
          padding: 'clamp(40px, 8vw, 60px) clamp(16px, 4vw, 28px) clamp(40px, 6vw, 50px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <Cookie size={18} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '3px', textTransform: 'uppercase' }}>
                Cookie Policy
              </span>
              <Cookie size={18} color="rgba(255,255,255,0.8)" />
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 6vw, 44px)',
              fontWeight: 800,
              color: '#fff',
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: '12px',
            }}>
              Cookies Policy
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Learn how we use cookies to enhance your browsing experience and protect your privacy.
            </p>
            <div style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}>
              <span style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <CheckCircle size={14} color="rgba(255,255,255,0.6)" />
                Last Updated: January 2026
              </span>
              <span style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <Gem size={14} color="rgba(255,255,255,0.6)" />
                GlowHive
              </span>
            </div>
          </div>
        </div>

        {/* ─── Main Content ─── */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(24px, 4vw, 32px) clamp(16px, 3vw, 20px) 60px' }}>

          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '260px 1fr',
            gap: '32px',
          }}>

            {/* ─── Sidebar ─── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: window.innerWidth < 768 ? 'relative' : 'sticky',
                top: '24px',
                alignSelf: 'start',
              }}
            >
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #fde8ec',
                padding: '20px',
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#b76e79',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #fde8ec',
                }}>
                  On This Page
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {quickLinks.map((link) => (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      style={{
                        display: 'block',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: 'clamp(12px, 1.1vw, 13px)',
                        fontWeight: 500,
                        color: '#5a3a40',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#fdf0f3';
                        e.target.style.color = '#b76e79';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#5a3a40';
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                {/* Contact Quick */}
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #fde8ec',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#8c6468',
                    flexWrap: 'wrap',
                  }}>
                    <Mail size={14} color="#b76e79" />
                    support@glowhive.com
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#8c6468',
                    marginTop: '4px',
                    flexWrap: 'wrap',
                  }}>
                    <Phone size={14} color="#b76e79" />
                    +977 984-1234567
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ─── Content ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                {sections.map((section) => (
                  <div
                    key={section.id}
                    id={section.id}
                    style={{
                      background: '#fff',
                      borderRadius: '16px',
                      border: '1px solid #fde8ec',
                      overflow: 'hidden',
                      scrollMarginTop: '24px',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: 'clamp(14px, 2.5vw, 16px) clamp(14px, 2.5vw, 20px)',
                      background: '#fdf8f5',
                      borderBottom: '1px solid #fde8ec',
                      flexWrap: 'wrap',
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#fdf0f3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {section.icon}
                      </div>
                      <h2 style={{
                        fontSize: 'clamp(16px, 2vw, 18px)',
                        fontWeight: 800,
                        color: '#3d1f25',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        margin: 0,
                      }}>
                        {section.title}
                      </h2>
                    </div>
                    <div style={{ padding: 'clamp(16px, 3vw, 20px)' }}>
                      <div style={{
                        fontSize: 'clamp(13px, 1.1vw, 14px)',
                        color: '#5a3a40',
                        lineHeight: 1.9,
                        whiteSpace: 'pre-line',
                      }}>
                        {section.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ─── Cookie Settings Info ─── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                style={{
                  marginTop: '32px',
                  background: 'linear-gradient(135deg, #fdf0f3, #fff8f5)',
                  borderRadius: '16px',
                  border: '1px solid #fde8ec',
                  padding: 'clamp(20px, 3vw, 24px)',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  flexWrap: 'wrap',
                }}>
                  <Shield size={20} color="#b76e79" />
                  <span style={{
                    fontSize: 'clamp(13px, 1.2vw, 14px)',
                    fontWeight: 700,
                    color: '#3d1f25',
                  }}>
                    We Value Your Privacy
                  </span>
                </div>
                <p style={{
                  fontSize: 'clamp(12px, 1.1vw, 13px)',
                  color: '#8c6468',
                  maxWidth: '500px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}>
                  We use cookies to enhance your experience on GlowHive. You can manage your preferences at any time.
                </p>
                <div style={{
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#b76e79',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Lock size={12} />
                    Secure & Encrypted
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#b76e79',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Shield size={12} />
                    Privacy Protected
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#b76e79',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <CheckCircle size={12} />
                    GDPR Compliant
                  </span>
                </div>
              </motion.div>

              {/* ─── Back to Top ─── */}
              <div style={{
                marginTop: '24px',
                textAlign: 'center',
              }}>
                <a
                  href="#top"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#b76e79',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '50px',
                    background: '#fff',
                    border: '1px solid #fde8ec',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#fdf0f3';
                    e.target.style.borderColor = '#b76e79';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.borderColor = '#fde8ec';
                  }}
                >
                  ↑ Back to Top
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}