import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ChatbotProvider } from '@/context/ChatbotContext';
import Chatbot from '@/components/Chatbot';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GlowHive - Beauty & Cosmetics',
  description: 'Premium skincare & makeup crafted for your natural beauty',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ChatbotProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                {children}
                <Chatbot />
                <Toaster 
                  position="top-center"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#fff',
                      color: '#3d1f25',
                      border: '1px solid #fde8ec',
                      borderRadius: '12px',
                      padding: '12px 20px',
                      boxShadow: '0 8px 24px rgba(183,110,121,0.15)',
                    },
                    success: {
                      icon: '✨',
                      style: {
                        border: '1px solid #bbf7d0',
                        background: '#f0fdf4',
                      },
                    },
                    error: {
                      icon: '❌',
                      style: {
                        border: '1px solid #fecaca',
                        background: '#fef2f2',
                      },
                    },
                  }}
                />
              </WishlistProvider>
            </CartProvider>
          </ChatbotProvider>
        </AuthProvider>
      </body>
    </html>
  );
}