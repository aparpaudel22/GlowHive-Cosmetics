'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Trash2,
  Sparkles,
  ChevronUp,
  ShoppingBag,
  Heart,
  Star,
  Package,
  CreditCard,
  Shield,
  FileText
} from 'lucide-react';
import { useChatbot } from '@/context/ChatbotContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Helper function for responsive sizes (can't use clamp() in JS)
const responsiveSize = (min, preferred, max) => {
  if (typeof window === 'undefined') return preferred;
  const vw = window.innerWidth;
  const size = Math.max(min, Math.min(max, vw * (preferred / 100)));
  return Math.round(size);
};

export default function Chatbot() {
  const { 
    isOpen, 
    setIsOpen,
    messages, 
    isTyping,
    isMinimized,
    sendMessage,
    toggleChat,
    minimizeChat,
    maximizeChat,
    clearChat,
  } = useChatbot();

  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get responsive icon sizes - use fixed values to avoid issues
  const iconSize = 20;
  const smallIconSize = 16;
  const largeIconSize = 24;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot' && !lastMessage.read) {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
    setUnreadCount(0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleToggle = () => {
    toggleChat();
    setUnreadCount(0);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Render product card
  const renderProductCard = (product) => {
    if (!product) return null;
    const discount = product.originalPrice 
      ? Math.round((1 - product.price / product.originalPrice) * 100) 
      : 0;

    return (
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
        <motion.div
          whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(183,110,121,0.15)' }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(8px, 1vw, 12px)',
            padding: 'clamp(8px, 1vw, 10px)',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #fde8ec',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          <div style={{
            width: 'clamp(50px, 6vw, 60px)',
            height: 'clamp(50px, 6vw, 60px)',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#fdf6f0',
            flexShrink: 0,
          }}>
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&q=80'} 
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 'clamp(12px, 1.2vw, 13px)',
              fontWeight: 700,
              color: '#3d1f25',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {product.name}
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(4px, 0.5vw, 8px)',
              marginTop: '2px',
              flexWrap: 'wrap',
            }}>
              <span style={{
                fontSize: 'clamp(13px, 1.3vw, 15px)',
                fontWeight: 800,
                color: '#b76e79',
                lineHeight: 1.2,
              }}>
                Rs. {product.price?.toLocaleString()}
              </span>
              
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{
                  fontSize: 'clamp(10px, 1vw, 12px)',
                  color: '#aaa',
                  textDecoration: 'line-through',
                  lineHeight: 1.2,
                }}>
                  Rs. {product.originalPrice?.toLocaleString()}
                </span>
              )}
              
              {discount > 0 && (
                <span style={{
                  fontSize: 'clamp(8px, 0.8vw, 10px)',
                  fontWeight: 700,
                  color: '#fff',
                  background: '#22c55e',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  lineHeight: 1.4,
                }}>
                  -{discount}%
                </span>
              )}
            </div>
            
            <div style={{
              fontSize: 'clamp(9px, 0.9vw, 10px)',
              color: '#8c6468',
              marginTop: '1px',
            }}>
              ⭐ {product.rating || '4.5'} • {product.category}
            </div>
          </div>
          
          <div style={{
            padding: 'clamp(4px, 0.5vw, 6px) clamp(8px, 0.8vw, 10px)',
            background: '#fdf0f3',
            borderRadius: '20px',
            fontSize: 'clamp(9px, 0.9vw, 10px)',
            fontWeight: 700,
            color: '#b76e79',
            whiteSpace: 'nowrap',
          }}>
            View →
          </div>
        </motion.div>
      </Link>
    );
  };

  // Render message
  const renderMessage = (msg) => {
    return (
      <div style={{
        display: 'flex',
        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
        marginBottom: '4px',
        maxWidth: '100%',
        flexDirection: 'column',
        alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
      }}>
        <div style={{
          maxWidth: '92%',
          padding: 'clamp(8px, 1vw, 10px) clamp(10px, 1.2vw, 14px)',
          borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: msg.sender === 'user' ? '#b76e79' : '#fff',
          color: msg.sender === 'user' ? '#fff' : '#3d1f25',
          border: msg.sender === 'bot' ? '1px solid #fde8ec' : 'none',
          boxShadow: msg.sender === 'bot' ? '0 2px 8px rgba(183,110,121,0.08)' : '0 2px 8px rgba(183,110,121,0.15)',
          fontSize: 'clamp(13px, 1.2vw, 14px)',
          lineHeight: 1.6,
          wordBreak: 'break-word',
          width: '100%',
        }}>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {msg.text.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <div key={i} style={{ fontWeight: 700, fontSize: 'clamp(14px, 1.3vw, 15px)', marginBottom: '4px' }}>{line.slice(2, -2)}</div>;
              }
              if (line.startsWith('•') || line.startsWith('-')) {
                return <div key={i} style={{ paddingLeft: '12px', marginBottom: '2px' }}>{line}</div>;
              }
              if (line.trim() === '') {
                return <div key={i} style={{ height: '4px' }} />;
              }
              return <div key={i} style={{ marginBottom: '2px' }}>{line}</div>;
            })}
          </div>
          
          {msg.products && msg.products.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              {msg.products.map((product, idx) => (
                <div key={idx}>
                  {renderProductCard(product)}
                </div>
              ))}
            </div>
          )}
          
          <div style={{
            fontSize: 'clamp(8px, 0.8vw, 9px)',
            color: msg.sender === 'user' ? 'rgba(255,255,255,0.6)' : '#aaa',
            marginTop: '6px',
            textAlign: 'right',
          }}>
            {formatTime(msg.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={handleToggle}
        style={{
          position: 'fixed',
          bottom: 'clamp(16px, 3vh, 24px)',
          right: 'clamp(16px, 3vw, 24px)',
          width: 'clamp(50px, 6vw, 60px)',
          height: 'clamp(50px, 6vw, 60px)',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #b76e79, #c2748a)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(183,110,121,0.4)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
        }}
        whileHover={{ scale: 1.08, boxShadow: '0 12px 40px rgba(183,110,121,0.5)' }}
        whileTap={{ scale: 0.92 }}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageCircle size={24} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: 'clamp(10px, 1vw, 11px)',
                  fontWeight: 700,
                  width: 'clamp(20px, 2.5vw, 22px)',
                  height: 'clamp(20px, 2.5vw, 22px)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </>
        )}
        <div style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(183,110,121,0.2), rgba(194,116,138,0.2))',
          filter: 'blur(12px)',
          zIndex: -1,
        }} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : 'clamp(400px, 60vh, 600px)',
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: 'clamp(76px, 10vh, 96px)',
              right: 'clamp(16px, 3vw, 24px)',
              width: 'clamp(320px, 25vw, 420px)',
              maxWidth: 'calc(100vw - 32px)',
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 20px 80px rgba(61,31,37,0.25)',
              border: '1px solid #fde8ec',
              overflow: 'hidden',
              zIndex: 10001,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #3d1f25, #b76e79)',
              padding: 'clamp(12px, 1.5vh, 16px) clamp(16px, 2vw, 20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1vw, 10px)' }}>
                <div style={{
                  width: 'clamp(30px, 3.5vw, 36px)',
                  height: 'clamp(30px, 3.5vw, 36px)',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Sparkles size={18} color="#fff" />
                </div>
                <div>
                  <div style={{
                    fontSize: 'clamp(13px, 1.3vw, 15px)',
                    fontWeight: 700,
                    color: '#fff',
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}>
                    GlowHive Assistant
                  </div>
                  <div style={{
                    fontSize: 'clamp(10px, 1vw, 11px)',
                    color: 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      display: 'inline-block',
                    }} />
                    Online
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={isMinimized ? maximizeChat : minimizeChat}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: 'clamp(4px, 0.5vw, 6px)',
                    cursor: 'pointer',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggle}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: 'clamp(4px, 0.5vw, 6px)',
                    cursor: 'pointer',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: 'clamp(12px, 1.5vh, 16px) clamp(16px, 2vw, 20px)',
                  background: '#fdf8f5',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: 'clamp(280px, 40vh, 440px)',
                  minHeight: 'clamp(160px, 20vh, 200px)',
                }}>
                  {messages.map((msg, index) => (
                    <div key={msg.id || index}>
                      {renderMessage(msg)}
                    </div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ display: 'flex', justifyContent: 'flex-start' }}
                    >
                      <div style={{
                        padding: 'clamp(10px, 1.2vw, 12px) clamp(12px, 1.5vw, 16px)',
                        borderRadius: '16px 16px 16px 4px',
                        background: '#fff',
                        border: '1px solid #fde8ec',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#b76e79',
                          animation: 'bounce 1.4s infinite ease-in-out',
                          animationDelay: '0s',
                        }} />
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#b76e79',
                          animation: 'bounce 1.4s infinite ease-in-out',
                          animationDelay: '0.2s',
                        }} />
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#b76e79',
                          animation: 'bounce 1.4s infinite ease-in-out',
                          animationDelay: '0.4s',
                        }} />
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} style={{
                  padding: 'clamp(10px, 1.5vh, 12px) clamp(12px, 2vw, 16px)',
                  borderTop: '1px solid #fde8ec',
                  background: '#fff',
                  display: 'flex',
                  gap: 'clamp(6px, 0.8vw, 8px)',
                  alignItems: 'flex-end',
                  flexShrink: 0,
                }}>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearChat}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#aaa',
                      padding: 'clamp(6px, 0.8vw, 8px)',
                      borderRadius: '8px',
                      transition: 'color 0.2s',
                    }}
                    title="Clear chat"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me ..."
                    rows={1}
                    style={{
                      flex: 1,
                      padding: 'clamp(8px, 1vw, 10px) clamp(12px, 1.5vw, 14px)',
                      borderRadius: '12px',
                      border: '1.5px solid #fde8ec',
                      fontSize: 'clamp(13px, 1.2vw, 14px)',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'inherit',
                      background: '#fdf8f5',
                      color: '#3d1f25',
                      transition: 'border-color 0.2s',
                      minHeight: 'clamp(40px, 5vh, 44px)',
                      maxHeight: '100px',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#b76e79'}
                    onBlur={(e) => e.target.style.borderColor = '#fde8ec'}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05, background: '#c2748a' }}
                    whileTap={{ scale: 0.9 }}
                    disabled={!input.trim()}
                    style={{
                      padding: 'clamp(8px, 1vw, 10px) clamp(14px, 1.5vw, 16px)',
                      borderRadius: '12px',
                      background: input.trim() ? 'linear-gradient(135deg, #b76e79, #c2748a)' : '#fde8ec',
                      color: input.trim() ? '#fff' : '#aaa',
                      border: 'none',
                      cursor: input.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      height: 'clamp(40px, 5vh, 44px)',
                      flexShrink: 0,
                    }}
                  >
                    <Send size={18} />
                  </motion.button>
                </form>
              </>
            )}

            {/* Minimized state */}
            {isMinimized && (
              <div style={{
                padding: 'clamp(10px, 1.5vh, 12px) clamp(14px, 2vw, 16px)',
                background: '#fdf8f5',
                borderTop: '1px solid #fde8ec',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onClick={maximizeChat}
              >
                <span style={{ 
                  fontSize: 'clamp(12px, 1.2vw, 13px)', 
                  color: '#8c6468',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '70%',
                }}>
                  {messages.length > 0 ? messages[messages.length - 1].text.slice(0, 50) + '...' : 'Start a conversation'}
                </span>
                <ChevronUp size={16} color="#b76e79" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @media (max-width: 480px) {
          .chatbot-window {
            width: calc(100vw - 32px) !important;
            bottom: 80px !important;
            right: 16px !important;
            max-height: 80vh !important;
          }
        }
      `}</style>
    </>
  );
}