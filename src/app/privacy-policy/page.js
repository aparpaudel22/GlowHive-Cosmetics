'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  Mail, 
  Phone, 
  Sparkles,
  Gem,
  CheckCircle,
  FileText,
  Users,
  Database,
  Cookie,
  Share2,
  AlertCircle,
  Handshake
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const sections = [
  {
    id: 'introduction',
    icon: <FileText size={20} color="#b76e79" />,
    title: 'Introduction',
    content: `At GlowHive ("we", "our", "us"), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.`
  },
  {
    id: 'information-collect',
    icon: <Database size={20} color="#b76e79" />,
    title: 'Information We Collect',
    content: `We collect information that you provide directly to us when you:
    • Create an account or register for our services
    • Place an order for products
    • Subscribe to our newsletter
    • Fill out a contact form
    • Participate in surveys or promotions
    • Communicate with our customer support team

    The types of information we may collect include:
    • Personal identification information (name, email address, phone number, shipping address)
    • Payment information (processed securely through our payment partners)
    • Order history and preferences
    • Device and browser information
    • IP address and location data`
  },
  {
    id: 'how-use',
    icon: <Users size={20} color="#b76e79" />,
    title: 'How We Use Your Information',
    content: `We use the information we collect to:
    • Process and fulfill your orders
    • Send you order confirmations and updates
    • Provide customer support
    • Personalize your shopping experience
    • Send you marketing communications (you can opt-out at any time)
    • Improve our website and services
    • Prevent fraudulent activities
    • Comply with legal obligations`
  },
  {
    id: 'sharing',
    icon: <Share2 size={20} color="#b76e79" />,
    title: 'Information Sharing',
    content: `We do not sell, trade, or rent your personal information to third parties. However, we may share your information with:
    • Service providers who assist us with payment processing, shipping, and marketing
    • Law enforcement or government agencies when required by law
    • Third parties in connection with a business transaction (merger, acquisition, or asset sale)

    We ensure that any third party we share your information with maintains appropriate security measures and uses your information only for the purposes specified.`
  },
  {
    id: 'cookies',
    icon: <Cookie size={20} color="#b76e79" />,
    title: 'Cookies and Tracking',
    content: `We use cookies and similar tracking technologies to enhance your browsing experience. Cookies help us:
    • Remember your preferences and settings
    • Understand how you use our website
    • Personalize content and advertisements
    • Improve website performance

    You can control cookie preferences through your browser settings. However, disabling cookies may affect some features of our website.

    Types of cookies we use:
    • Essential cookies (required for website functionality)
    • Performance cookies (to analyze usage)
    • Functional cookies (to remember preferences)
    • Targeting cookies (for personalized advertising)`
  },
  {
    id: 'security',
    icon: <Lock size={20} color="#b76e79" />,
    title: 'Data Security',
    content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
    • SSL/TLS encryption for all data transmission
    • Secure storage of sensitive information
    • Regular security audits and updates
    • Access controls and authentication protocols
    • Employee training on data protection

    While we take reasonable steps to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.`
  },
  {
    id: 'your-rights',
    icon: <Shield size={20} color="#b76e79" />,
    title: 'Your Rights',
    content: `You have the right to:
    • Access your personal information
    • Correct inaccurate or incomplete data
    • Request deletion of your personal data
    • Object to processing of your data
    • Request data portability
    • Withdraw consent at any time
    • Lodge a complaint with a supervisory authority

    To exercise any of these rights, please contact us at support@glowhive.com. We will respond to your request within 30 days.`
  },
  {
    id: 'children',
    icon: <Users size={20} color="#b76e79" />,
    title: 'Children\'s Privacy',
    content: `Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete that information. If you believe a child has provided us with personal information, please contact us immediately.`
  },
  {
    id: 'changes',
    icon: <AlertCircle size={20} color="#b76e79" />,
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new policy on this page and updating the effective date.

    We encourage you to review this Privacy Policy periodically for any updates. Your continued use of our services after any changes indicates your acceptance of the updated policy.

    Effective Date: January 1, 2026`
  },
  {
    id: 'contact',
    icon: <Mail size={20} color="#b76e79" />,
    title: 'Contact Us',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

    📧 Email: support@glowhive.com
    📞 Phone: +977 984-1234567
    📍 Address: Kathmandu, Nepal

    Our customer support team is available 9 AM to 9 PM, 7 days a week to assist you with any privacy-related concerns.`
  }
];

const quickLinks = [
  { label: 'Introduction', id: 'introduction' },
  { label: 'Information We Collect', id: 'information-collect' },
  { label: 'How We Use Your Information', id: 'how-use' },
  { label: 'Information Sharing', id: 'sharing' },
  { label: 'Cookies & Tracking', id: 'cookies' },
  { label: 'Data Security', id: 'security' },
  { label: 'Your Rights', id: 'your-rights' },
  { label: 'Children\'s Privacy', id: 'children' },
  { label: 'Changes to Policy', id: 'changes' },
  { label: 'Contact Us', id: 'contact' },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <div style={{ minHeight: '100vh', background: '#fdf8f4' }}>

        {/* ─── Hero Section ─── */}
        <div style={{
          background: 'linear-gradient(135deg, #3d1f25 0%, #b76e79 60%, #e8a4b0 100%)',
          padding: '60px 28px 50px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <Shield size={18} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '3px', textTransform: 'uppercase' }}>
                Privacy & Security
              </span>
              <Shield size={18} color="rgba(255,255,255,0.8)" />
            </div>
            <h1 style={{
              fontSize: '44px',
              fontWeight: 800,
              color: '#fff',
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: '12px',
            }}>
              Privacy Policy
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Your privacy matters to us. Learn how we collect, use, and protect your personal information.
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
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px 60px' }}>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: '32px',
          }}>

            {/* ─── Sidebar ─── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'sticky',
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
                        fontSize: '13px',
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
                {sections.map((section, index) => (
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
                      padding: '16px 20px',
                      background: '#fdf8f5',
                      borderBottom: '1px solid #fde8ec',
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
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#3d1f25',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        margin: 0,
                      }}>
                        {section.title}
                      </h2>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <div style={{
                        fontSize: '14px',
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

              {/* ─── Bottom Note ─── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                style={{
                  marginTop: '32px',
                  background: 'linear-gradient(135deg, #fdf0f3, #fff8f5)',
                  borderRadius: '16px',
                  border: '1px solid #fde8ec',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}>
                  <Handshake size={20} color="#b76e79" />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#3d1f25',
                  }}>
                    Your Trust Matters to Us
                  </span>
                </div>
                <p style={{
                  fontSize: '13px',
                  color: '#8c6468',
                  maxWidth: '500px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}>
                  We're committed to protecting your privacy and ensuring a safe shopping experience at GlowHive.
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
                    SSL Encrypted
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#b76e79',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Shield size={12} />
                    Data Protected
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#b76e79',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Eye size={12} />
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