'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Search, 
  HelpCircle, 
  Truck, 
  RefreshCw, 
  CreditCard, 
  Shield, 
  Package, 
  Mail, 
  Phone, 
  MessageCircle,
  Sparkles,
  ArrowRight,
  Gem
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions', icon: <HelpCircle size={16} /> },
  { id: 'orders', label: 'Orders', icon: <Package size={16} /> },
  { id: 'shipping', label: 'Shipping', icon: <Truck size={16} /> },
  { id: 'returns', label: 'Returns & Refunds', icon: <RefreshCw size={16} /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard size={16} /> },
  { id: 'account', label: 'Account', icon: <Shield size={16} /> },
];

const FAQS = [
  { id: 1, category: 'orders', question: 'How do I track my order?', answer: 'You can track your order by logging into your account and visiting the "My Orders" section. Click on the specific order to see real-time tracking updates. You\'ll also receive email notifications with tracking information once your order ships.' },
  { id: 2, category: 'orders', question: 'Can I modify or cancel my order?', answer: 'Orders can be modified or cancelled within 1 hour of placing them. After that, the order enters our processing system and cannot be changed. To request a cancellation, please contact our support team immediately at support@glowhive.com or call +977 984-1234567.' },
  { id: 3, category: 'orders', question: 'How do I know my order has been confirmed?', answer: 'You\'ll receive a confirmation email with your order details immediately after placing your order. You can also check the status of your order in the "My Orders" section of your account.' },
  { id: 4, category: 'shipping', question: 'How long does shipping take?', answer: 'We offer fast delivery across Nepal. Standard shipping takes 3-5 business days, while express shipping delivers in 1-2 business days. Delivery times may vary based on your location and any ongoing promotions.' },
  { id: 5, category: 'shipping', question: 'Do you offer free shipping?', answer: 'Yes! We offer free shipping on all orders over Rs. 5000. For orders below this amount, a flat shipping fee of Rs. 200 applies. Use code GLOWHIVE15 for additional discounts on your order.' },
  { id: 6, category: 'shipping', question: 'Do you ship internationally?', answer: 'Currently, we ship only within Nepal. We\'re working on expanding our delivery network to serve our international customers soon. Stay tuned for updates!' },
  { id: 7, category: 'returns', question: 'What is your return policy?', answer: 'We offer a 30-day return policy on all products. Items must be unused, in their original packaging, and in the same condition as received. To initiate a return, go to your orders page and click "Request Return" on the eligible order.' },
  { id: 8, category: 'returns', question: 'How do I request a return?', answer: 'Visit your "My Orders" page, select the order with the item you wish to return, and click "Request Return". Follow the simple steps to select a reason and submit your request. Our team will review and approve your return within 2 business days.' },
  { id: 9, category: 'returns', question: 'How do I get a refund?', answer: 'Once your return is approved and we receive the item, refunds are processed within 3-5 business days. Refunds are credited to your original payment method (eSewa, Khalti, or Bank Transfer). For Cash on Delivery orders, no refund is needed as no payment was taken.' },
  { id: 10, category: 'payment', question: 'What payment methods do you accept?', answer: 'We accept multiple payment methods for your convenience: Cash on Delivery (COD), eSewa Wallet, Khalti Wallet, and Bank Transfer. Choose the option that works best for you during checkout.' },
  { id: 11, category: 'payment', question: 'Is Cash on Delivery available?', answer: 'Yes, Cash on Delivery (COD) is available for all orders. Simply select "Cash on Delivery" during checkout and pay when you receive your package. No advance payment is required.' },
  { id: 12, category: 'payment', question: 'Is my payment secure?', answer: 'Absolutely! We use industry-standard encryption to protect your payment information. All transactions are processed securely through trusted payment gateways. Your financial information is never stored on our servers.' },
  { id: 13, category: 'account', question: 'How do I create an account?', answer: 'Click the "Sign In" button in the top right corner of our website, then select "Register" to create your account. You can also sign up with Google for a faster registration process. Fill in your name, email, and phone number to get started.' },
  { id: 14, category: 'account', question: 'How do I reset my password?', answer: 'On the login page, click "Forgot Password?" and enter your registered email address. We\'ll send you a link to reset your password. Follow the instructions in the email to create a new secure password.' },
  { id: 15, category: 'account', question: 'Can I delete my account?', answer: 'Yes, you can delete your account from the "Account" page. Scroll down and click "Delete Account". You\'ll need to type "DELETE" to confirm. This action is permanent and all your data will be removed from our system.' },
  { id: 16, category: 'all', question: 'How do I contact customer support?', answer: 'You can reach our customer support team through multiple channels: Email us at support@glowhive.com, Call us at +977 984-1234567 (9 AM to 9 PM, 7 days a week), or Use the chat button in the bottom right corner of our website for instant assistance.' },
  { id: 17, category: 'all', question: 'Can I get help with my order?', answer: 'Yes! Our support team is here to help with any issues related to your order. Whether you need assistance with tracking, returns, or product information, just reach out to us and we\'ll resolve your query within 24 hours.' },
  { id: 18, category: 'all', question: 'Are your products authentic and safe?', answer: '100% yes! We source all our products directly from authorized brands and distributors. Our products are dermatologically tested and safe for all skin types. We stand behind the quality of every product we sell on GlowHive.' },
];

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);

  const filteredFAQs = FAQS.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

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
              <Sparkles size={18} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '3px', textTransform: 'uppercase' }}>
                Help Center
              </span>
              <Sparkles size={18} color="rgba(255,255,255,0.8)" />
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 6vw, 44px)',
              fontWeight: 800,
              color: '#fff',
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: '12px',
            }}>
              Frequently Asked Questions
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '480px',
              margin: '0 auto 24px',
            }}>
              Find answers to the most common questions about ordering, shipping, returns, and more.
            </p>

            {/* ─── Search Bar ─── */}
            <div style={{
              maxWidth: '480px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '50px',
              padding: '6px 6px 6px 20px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <Search size={18} color="rgba(255,255,255,0.6)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: 'clamp(13px, 1.2vw, 14px)',
                  fontFamily: "'Inter', sans-serif",
                  padding: '10px 0',
                  minWidth: '80px',
                }}
                onFocus={(e) => e.currentTarget.parentElement.style.borderColor = 'rgba(255,255,255,0.6)'}
                onBlur={(e) => e.currentTarget.parentElement.style.borderColor = 'rgba(255,255,255,0.2)'}
              />
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50px',
                  color: '#fff',
                  fontSize: 'clamp(11px, 1vw, 13px)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: searchQuery ? 'block' : 'none',
                  flexShrink: 0,
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* ─── Main Content ─── */}
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: 'clamp(24px, 4vw, 32px) clamp(16px, 3vw, 20px) 60px' }}>

          {/* ─── Category Tabs ─── */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '24px',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            flexWrap: 'nowrap',
          }}>
            {FAQ_CATEGORIES.map(cat => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  padding: '8px 16px',
                  borderRadius: '50px',
                  fontSize: 'clamp(12px, 1.1vw, 13px)',
                  fontWeight: activeCategory === cat.id ? 700 : 600,
                  cursor: 'pointer',
                  border: `1.5px solid ${activeCategory === cat.id ? '#b76e79' : '#fde8ec'}`,
                  background: activeCategory === cat.id ? '#b76e79' : '#fff',
                  color: activeCategory === cat.id ? '#fff' : '#3d1f25',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {cat.icon}
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* ─── Results Count ─── */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <span style={{ fontSize: 'clamp(12px, 1.1vw, 13px)', color: '#8c6468' }}>
              {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'}
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#b76e79',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Clear search
              </button>
            )}
          </div>

          {/* ─── FAQ List ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredFAQs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  textAlign: 'center',
                  padding: 'clamp(40px, 8vw, 60px) 20px',
                  background: '#fff',
                  borderRadius: '20px',
                  border: '1px solid #fde8ec',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '14px' }}>🔍</div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#3d1f25', marginBottom: '8px' }}>
                  No questions found
                </p>
                <p style={{ fontSize: '13px', color: '#8c6468' }}>
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {filteredFAQs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: '#fff',
                      borderRadius: '16px',
                      border: `1px solid ${openFAQ === faq.id ? '#b76e79' : '#fde8ec'}`,
                      overflow: 'hidden',
                      boxShadow: openFAQ === faq.id ? '0 4px 20px rgba(183,110,121,0.12)' : '0 2px 8px rgba(183,110,121,0.04)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Question */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleFAQ(faq.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        padding: 'clamp(14px, 2.5vw, 18px) clamp(14px, 2.5vw, 20px)',
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#fdf0f3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}>
                          <HelpCircle size={16} color="#b76e79" />
                        </div>
                        <span style={{
                          fontSize: 'clamp(14px, 1.3vw, 15px)',
                          fontWeight: openFAQ === faq.id ? 700 : 600,
                          color: '#3d1f25',
                          lineHeight: 1.5,
                        }}>
                          {faq.question}
                        </span>
                      </div>
                      <motion.span
                        animate={{ rotate: openFAQ === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#b76e79',
                          flexShrink: 0,
                        }}
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                    </motion.button>

                    {/* Answer */}
                    <AnimatePresence>
                      {openFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{
                            padding: '0 clamp(14px, 2.5vw, 20px) clamp(16px, 2.5vw, 20px) clamp(14px, 2.5vw, 20px)',
                            borderTop: '1px solid #fde8ec',
                            paddingTop: '16px',
                          }}>
                            <div style={{
                              display: 'flex',
                              gap: '12px',
                              alignItems: 'flex-start',
                            }}>
                              <div style={{
                                width: '4px',
                                height: '100%',
                                minHeight: '24px',
                                borderRadius: '2px',
                                background: 'linear-gradient(135deg, #b76e79, #c2748a)',
                                flexShrink: 0,
                              }} />
                              <p style={{
                                fontSize: 'clamp(13px, 1.1vw, 14px)',
                                color: '#5a3a40',
                                lineHeight: 1.8,
                                margin: 0,
                              }}>
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* ─── Still Need Help? ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              marginTop: '40px',
              background: 'linear-gradient(135deg, #fdf0f3, #fff8f5)',
              borderRadius: '20px',
              border: '1px solid #fde8ec',
              padding: 'clamp(24px, 4vw, 32px)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fde8ec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <MessageCircle size={28} color="#b76e79" />
            </div>
            <h3 style={{
              fontSize: 'clamp(18px, 2.5vw, 20px)',
              fontWeight: 800,
              color: '#3d1f25',
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: '8px',
            }}>
              Still Need Help?
            </h3>
            <p style={{
              fontSize: 'clamp(13px, 1.1vw, 14px)',
              color: '#8c6468',
              maxWidth: '400px',
              margin: '0 auto 20px',
              lineHeight: 1.6,
            }}>
              Our support team is ready to assist you with any questions or concerns.
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}>
              <a
                href="mailto:support@glowhive.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  background: '#b76e79',
                  color: '#fff',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontSize: 'clamp(13px, 1.1vw, 14px)',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = '#c2748a'}
                onMouseLeave={(e) => e.target.style.background = '#b76e79'}
              >
                <Mail size={16} /> Email Us
              </a>
              <a
                href="tel:+9779841234567"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  background: '#fff',
                  color: '#b76e79',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontSize: 'clamp(13px, 1.1vw, 14px)',
                  fontWeight: 700,
                  border: '1.5px solid #b76e79',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.target.style.background = '#fdf0f3'; }}
                onMouseLeave={(e) => { e.target.style.background = '#fff'; }}
              >
                <Phone size={16} /> Call Us
              </a>
            </div>
            <div style={{
              marginTop: '16px',
              fontSize: '12px',
              color: '#b76e79',
            }}>
              Available 9 AM - 9 PM, 7 days a week
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}