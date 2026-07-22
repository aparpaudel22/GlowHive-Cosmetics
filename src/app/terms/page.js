'use client';

import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  RefreshCw, 
  AlertCircle, 
  Scale,
  Gem,
  Mail, 
  Phone,
  CheckCircle,
  Lock,
  Users
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const sections = [
  {
    id: 'introduction',
    icon: <FileText size={20} color="#b76e79" />,
    title: 'Introduction',
    content: `Welcome to GlowHive ("we", "our", "us"). By using our website and services, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before using our website or placing any orders.

    These terms apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.

    If you do not agree with any part of these terms, please do not use our website or services.`
  },
  {
    id: 'account',
    icon: <Users size={20} color="#b76e79" />,
    title: 'Account Registration',
    content: `To access certain features of our website, you may need to create an account. When you register, you agree to:
    • Provide accurate, current, and complete information
    • Maintain the security of your password and account
    • Accept responsibility for all activities that occur under your account
    • Notify us immediately of any unauthorized use of your account

    We reserve the right to refuse service, terminate accounts, or remove or edit content at our sole discretion.

    You must be at least 16 years old to create an account and use our services.`
  },
  {
    id: 'orders',
    icon: <ShoppingBag size={20} color="#b76e79" />,
    title: 'Orders and Pricing',
    content: `All orders placed through our website are subject to acceptance and availability. We reserve the right to:
    • Refuse or cancel any order for any reason
    • Limit the quantity of products purchased per person or household
    • Correct any errors, inaccuracies, or omissions in pricing and product information

    Prices are subject to change without notice. The price charged for an order will be the price in effect at the time the order is placed. We are not responsible for pricing errors.

    In the event that a product is listed at an incorrect price, we reserve the right to cancel or refuse orders placed at the incorrect price.`
  },
  {
    id: 'payment',
    icon: <CreditCard size={20} color="#b76e79" />,
    title: 'Payment Terms',
    content: `We accept the following payment methods:
    • Cash on Delivery (COD)
    • eSewa Wallet
    • Khalti Wallet
    • Bank Transfer

    By providing payment information, you represent and warrant that:
    • You have the legal right to use the payment method
    • The payment information you provide is accurate and complete
    • You authorize us to charge the total amount of your order to the payment method provided

    All transactions are processed securely through our trusted payment partners. We do not store your complete payment information on our servers.`
  },
  {
    id: 'shipping',
    icon: <Truck size={20} color="#b76e79" />,
    title: 'Shipping and Delivery',
    content: `We offer shipping within Nepal. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by:
    • Weather conditions
    • Natural disasters
    • Courier service delays
    • Customs clearance
    • Incorrect or incomplete shipping addresses

    Risk of loss and title for products pass to you upon delivery to the shipping carrier. We are not responsible for lost, stolen, or damaged packages once they have been handed over to the courier service.

    Please ensure your shipping address is accurate and complete to avoid delivery issues.`
  },
  {
    id: 'returns',
    icon: <RefreshCw size={20} color="#b76e79" />,
    title: 'Returns and Refunds',
    content: `We want you to be completely satisfied with your purchase. If you are not satisfied, you may return items within 30 days of delivery, subject to the following conditions:

    • Items must be unused and in their original packaging
    • Items must be in the same condition as received
    • Return shipping costs are the responsibility of the customer (unless the item is defective or incorrect)

    To initiate a return, please visit your "My Orders" page and click "Request Return". Our team will review your request and provide further instructions.

    Refunds will be processed to your original payment method within 3-5 business days after we receive and inspect the returned item. For Cash on Delivery orders, no refund is required as no payment was taken.`
  },
  {
    id: 'intellectual-property',
    icon: <Scale size={20} color="#b76e79" />,
    title: 'Intellectual Property',
    content: `All content on our website, including but not limited to:
    • Text, graphics, logos, and images
    • Product descriptions and reviews
    • Website design and layout
    • Software, code, and scripts
    • Trademarks and service marks

    is the property of GlowHive or our content suppliers and is protected by intellectual property laws. You may not use, reproduce, distribute, or create derivative works from any content without our express written permission.

    You may, however, share links to our website and share content for personal, non-commercial purposes, provided you give appropriate credit to GlowHive.`
  },
  {
    id: 'user-content',
    icon: <AlertCircle size={20} color="#b76e79" />,
    title: 'User-Generated Content',
    content: `You may have the opportunity to submit content, including reviews, comments, and feedback. By submitting content, you agree that:
    • You own or have the rights to the content
    • The content is accurate and not misleading
    • The content does not violate any third-party rights
    • The content is not harmful, offensive, or inappropriate

    By submitting content, you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.

    We reserve the right to remove or edit any user-generated content at our sole discretion.`
  },
  {
    id: 'privacy',
    icon: <Shield size={20} color="#b76e79" />,
    title: 'Privacy and Data Protection',
    content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our website, you consent to our data practices as described in our Privacy Policy.

    We implement appropriate security measures to protect your personal information. However, we cannot guarantee absolute security of any information transmitted over the internet.

    We do not sell or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website and fulfilling orders.`
  },
  {
    id: 'limitations',
    icon: <AlertCircle size={20} color="#b76e79" />,
    title: 'Limitations of Liability',
    content: `To the maximum extent permitted by law, GlowHive shall not be liable for any:
    • Direct, indirect, incidental, special, or consequential damages
    • Loss of profits, revenue, data, or goodwill
    • Damages arising from the use or inability to use our website
    • Damages resulting from any errors or omissions in our content

    Our total liability to you shall not exceed the total amount paid by you for the products giving rise to the claim.

    We do not warrant that our website will be uninterrupted, error-free, or free of viruses or other harmful components. You access and use our website at your own risk.`
  },
  {
    id: 'indemnification',
    icon: <Shield size={20} color="#b76e79" />,
    title: 'Indemnification',
    content: `You agree to indemnify, defend, and hold harmless GlowHive and our officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorney's fees, arising out of or in any way connected with:
    • Your use of our website and services
    • Your violation of these terms and conditions
    • Your violation of any third-party rights
    • Any content you submit to our website

    We reserve the right to assume the exclusive defense and control of any matter subject to indemnification by you, and you agree to cooperate with our defense of such claims.`
  },
  {
    id: 'termination',
    icon: <AlertCircle size={20} color="#b76e79" />,
    title: 'Termination',
    content: `We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without prior notice or liability, for any reason, including without limitation:
    • Breach of these terms and conditions
    • Fraudulent or illegal activities
    • Abusive or inappropriate behavior
    • Non-payment of dues

    Upon termination, your right to use our website and services will immediately cease. We may also delete your account and any associated data.

    All provisions of these terms which by their nature should survive termination shall survive termination, including intellectual property, warranty disclaimers, and limitations of liability.`
  },
  {
    id: 'governing-law',
    icon: <Scale size={20} color="#b76e79" />,
    title: 'Governing Law',
    content: `These terms and conditions shall be governed by and construed in accordance with the laws of Nepal. Any disputes arising out of or relating to these terms or your use of our website shall be subject to the exclusive jurisdiction of the courts located in Kathmandu, Nepal.

    We make no representation that our website or services are appropriate or available for use in other locations. Those who access or use our website from other jurisdictions do so at their own risk and are responsible for compliance with local laws.`
  },
  {
    id: 'changes',
    icon: <AlertCircle size={20} color="#b76e79" />,
    title: 'Changes to Terms',
    content: `We reserve the right to update or modify these terms and conditions at any time without prior notice. Any changes will be effective immediately upon posting on this page. Your continued use of our website after any changes indicates your acceptance of the updated terms.

    We encourage you to review these terms periodically for any updates. The most current version will always be available on this page.

    If you do not agree with any changes to these terms, you should discontinue using our website and services.

    Effective Date: January 1, 2026`
  },
  {
    id: 'contact',
    icon: <Mail size={20} color="#b76e79" />,
    title: 'Contact Us',
    content: `If you have any questions, concerns, or feedback regarding these Terms and Conditions, please contact us:

    📧 Email: support@glowhive.com
    📞 Phone: +977 984-1234567
    📍 Address: Kathmandu, Nepal

    Our customer support team is available 9 AM to 9 PM, 7 days a week to assist you.

    We value your feedback and are committed to providing you with the best possible experience.`
  }
];

const quickLinks = [
  { label: 'Introduction', id: 'introduction' },
  { label: 'Account Registration', id: 'account' },
  { label: 'Orders and Pricing', id: 'orders' },
  { label: 'Payment Terms', id: 'payment' },
  { label: 'Shipping and Delivery', id: 'shipping' },
  { label: 'Returns and Refunds', id: 'returns' },
  { label: 'Intellectual Property', id: 'intellectual-property' },
  { label: 'User-Generated Content', id: 'user-content' },
  { label: 'Privacy & Data Protection', id: 'privacy' },
  { label: 'Limitations of Liability', id: 'limitations' },
  { label: 'Indemnification', id: 'indemnification' },
  { label: 'Termination', id: 'termination' },
  { label: 'Governing Law', id: 'governing-law' },
  { label: 'Changes to Terms', id: 'changes' },
  { label: 'Contact Us', id: 'contact' },
];

export default function TermsPage() {
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
              <Scale size={18} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '3px', textTransform: 'uppercase' }}>
                Legal
              </span>
              <Scale size={18} color="rgba(255,255,255,0.8)" />
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 6vw, 44px)',
              fontWeight: 800,
              color: '#fff',
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: '12px',
            }}>
              Terms and Conditions
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Please read these terms carefully before using our website or placing any orders.
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
                  <Gem size={20} color="#b76e79" />
                  <span style={{
                    fontSize: 'clamp(13px, 1.2vw, 14px)',
                    fontWeight: 700,
                    color: '#3d1f25',
                  }}>
                    Shop with Confidence
                  </span>
                </div>
                <p style={{
                  fontSize: 'clamp(12px, 1.1vw, 13px)',
                  color: '#8c6468',
                  maxWidth: '500px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}>
                  By using GlowHive, you agree to these terms. We're here to provide you with a safe and enjoyable shopping experience.
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
                    Secure Checkout
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#b76e79',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Shield size={12} />
                    Protected Data
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#b76e79',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <RefreshCw size={12} />
                    30-Day Returns
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