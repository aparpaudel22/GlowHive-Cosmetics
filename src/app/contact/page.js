'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatbot } from '@/context/ChatbotContext';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const { toggleChat } = useChatbot();
  const router = useRouter();

  useEffect(() => {
    toggleChat();
  }, []);

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#fdf8f4' }}>
        {/* Hero Section */}
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
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '16px' }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <MessageCircle size={18} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '3px', textTransform: 'uppercase' }}>
                Contact Us
              </span>
              <MessageCircle size={18} color="rgba(255,255,255,0.8)" />
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 6vw, 44px)',
              fontWeight: 800,
              color: '#fff',
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: '12px',
            }}>
              How Can We Help?
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Our chatbot is ready to assist you. Start a conversation by clicking the chat icon below.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'clamp(24px, 4vw, 40px) clamp(16px, 3vw, 20px) 60px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: '#fff',
              borderRadius: '20px',
              border: '1px solid #fde8ec',
              padding: 'clamp(24px, 4vw, 32px)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fdf0f3, #fde8ec)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Sparkles size={36} color="#b76e79" />
            </div>
            
            <h2 style={{
              fontSize: 'clamp(18px, 2.5vw, 22px)',
              fontWeight: 800,
              color: '#3d1f25',
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: '12px',
            }}>
              Chat with GlowHive Assistant
            </h2>
            
            <p style={{
              fontSize: 'clamp(13px, 1.1vw, 14px)',
              color: '#8c6468',
              lineHeight: 1.7,
              marginBottom: '24px',
            }}>
              Our beauty assistant is here to answer your questions about orders, shipping, returns, products, and more. Just click the button below to start chatting!
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleChat}
              style={{
                padding: 'clamp(12px, 1.5vw, 14px) clamp(24px, 4vw, 40px)',
                background: 'linear-gradient(135deg, #b76e79, #c2748a)',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                fontSize: 'clamp(14px, 1.2vw, 16px)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(183,110,121,0.3)',
                transition: 'all 0.3s',
              }}
            >
              <MessageCircle size={20} />
              Start Chatting
            </motion.button>

            <div style={{
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid #fde8ec',
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 480 ? '1fr' : '1fr 1fr 1fr',
              gap: '16px',
            }}>
              <div>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>📞</div>
                <div style={{ fontSize: '12px', color: '#5a3a40', fontWeight: 600 }}>Phone</div>
                <div style={{ fontSize: '12px', color: '#8c6468' }}>+977 984-1234567</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>✉️</div>
                <div style={{ fontSize: '12px', color: '#5a3a40', fontWeight: 600 }}>Email</div>
                <div style={{ fontSize: '12px', color: '#8c6468' }}>support@glowhive.com</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>🕐</div>
                <div style={{ fontSize: '12px', color: '#5a3a40', fontWeight: 600 }}>Hours</div>
                <div style={{ fontSize: '12px', color: '#8c6468' }}>9AM - 9PM Daily</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}