'use client';

import { motion } from 'framer-motion';

export default function Testimonials() {
  const reviews = [
    {
      name: "Aisha Khan", location: "Karachi", avatar: "AK", rating: 5,
      product: "Vitamin C Brightening Serum",
      review: "I've been using this serum for 3 weeks and the difference is unreal! My skin looks so much brighter and my dark spots have faded significantly. Will definitely repurchase!",
      date: "May 2026",
    },
    {
      name: "Fatima Raza", location: "Lahore", avatar: "FR", rating: 5,
      product: "Matte Liquid Foundation",
      review: "Best foundation I've ever used in Pakistan! Full coverage, doesn't oxidize, and stays on all day even in the heat. The shade range is amazing too.",
      date: "April 2026",
    },
    {
      name: "Zara Malik", location: "Islamabad", avatar: "ZM", rating: 5,
      product: "Rose Oud Eau de Parfum",
      review: "The fragrance is absolutely divine — very long lasting and I get compliments every time I wear it. The packaging is beautiful and it arrived so quickly!",
      date: "June 2026",
    },
    {
      name: "Hina Tariq", location: "Faisalabad", avatar: "HT", rating: 4,
      product: "Niacinamide 10% + Zinc Serum",
      review: "My skin has cleared up so much since I started using this. Pores look smaller and my skin feels so smooth. Great price for the quality.",
      date: "May 2026",
    },
    {
      name: "Sara Ahmed", location: "Multan", avatar: "SA", rating: 5,
      product: "Hyaluronic Acid Moisturizer",
      review: "This moisturizer is a game-changer for dry skin. It absorbs so fast and my skin feels plump and hydrated all day. Perfect for our dry weather!",
      date: "March 2026",
    },
    {
      name: "Maryam Ali", location: "Peshawar", avatar: "MA", rating: 5,
      product: "Matte Liquid Lipstick Set",
      review: "The colours are so pigmented and they stay on for hours without drying out my lips. I ordered two sets! Fast delivery and great packaging.",
      date: "June 2026",
    },
  ];

  return (
    <section style={{ 
      maxWidth: '1280px', 
      margin: '0 auto', 
      padding: 'clamp(40px, 8vh, 64px) clamp(16px, 3vw, 28px)' 
    }}>
      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vh, 48px)' }}>
        <p style={{ 
          fontSize: 'clamp(10px, 1vw, 12px)', 
          fontWeight: 700, 
          letterSpacing: 'clamp(2px, 0.3vw, 3px)', 
          textTransform: 'uppercase', 
          color: '#b76e79', 
          marginBottom: '8px' 
        }}>
          Testimonials
        </p>
        <h2 style={{ 
          fontSize: 'clamp(22px, 3.5vw, 28px)', 
          fontWeight: 800, 
          fontFamily: "'Playfair Display', Georgia, serif", 
          color: '#1a1a1a', 
          marginBottom: '12px' 
        }}>
          What Our Customers Say
        </h2>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 'clamp(2px, 0.3vw, 4px)',
          flexWrap: 'wrap',
        }}>
          {[1,2,3,4,5].map(i => (
            <svg key={i} width={16} height={16} viewBox="0 0 24 24" fill="#f59e0b">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          ))}
          <span style={{ 
            fontSize: 'clamp(12px, 1.2vw, 14px)', 
            fontWeight: 700, 
            color: '#1a1a1a', 
            marginLeft: 'clamp(4px, 0.5vw, 8px)' 
          }}>4.9 / 5</span>
          <span style={{ 
            fontSize: 'clamp(11px, 1vw, 14px)', 
            color: '#6b7280', 
            marginLeft: 'clamp(2px, 0.3vw, 4px)' 
          }}>from 50,000+ reviews</span>
        </div>
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'clamp(16px, 2vw, 24px)',
      }}
      className="testimonials-grid"
      >
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            style={{
              background: '#fff',
              border: '1px solid #f0e6e6',
              borderRadius: 'clamp(14px, 1.5vw, 16px)',
              padding: 'clamp(16px, 2vw, 24px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(12px, 1.5vh, 16px)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {/* Stars */}
            <div style={{ display: 'flex', gap: 'clamp(2px, 0.3vw, 3px)' }}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width={14} height={14} viewBox="0 0 24 24" fill={s <= review.rating ? '#f59e0b' : '#e5e7eb'}>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>

            {/* Review text */}
            <p style={{ 
              fontSize: 'clamp(13px, 1.2vw, 14px)', 
              color: '#6b7280', 
              lineHeight: 1.7, 
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              "{review.review}"
            </p>

            {/* Product badge */}
            <span style={{
              display: 'inline-block', 
              alignSelf: 'flex-start',
              fontSize: 'clamp(10px, 1vw, 11px)', 
              fontWeight: 600,
              background: 'rgba(183,110,121,0.10)', 
              color: '#b76e79',
              padding: 'clamp(3px, 0.5vw, 4px) clamp(8px, 1vw, 10px)', 
              borderRadius: '999px',
            }}>
              {review.product}
            </span>

            {/* Reviewer row */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'clamp(10px, 1.2vw, 12px)', 
              paddingTop: 'clamp(10px, 1vh, 12px)', 
              borderTop: '1px solid #f3e8e8' 
            }}>
              <div style={{
                width: 'clamp(32px, 4vw, 36px)',
                height: 'clamp(32px, 4vw, 36px)',
                borderRadius: '50%',
                background: 'rgba(183,110,121,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ 
                  fontSize: 'clamp(10px, 1vw, 11px)', 
                  fontWeight: 700, 
                  color: '#b76e79' 
                }}>{review.avatar}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ 
                  fontSize: 'clamp(12px, 1.2vw, 13px)', 
                  fontWeight: 600, 
                  color: '#1a1a1a', 
                  margin: 0 
                }}>{review.name}</p>
                <p style={{ 
                  fontSize: 'clamp(10px, 0.9vw, 11px)', 
                  color: '#9ca3af', 
                  margin: 0 
                }}>{review.location} · {review.date}</p>
              </div>
              {/* Verified tick */}
              <svg width={18} height={18} viewBox="0 0 24 24" fill="#22c55e">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
            max-width: 400px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}