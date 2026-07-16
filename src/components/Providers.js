'use client';

import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  return (
    
      <CartProvider>
        <WishlistProvider>
          <Navbar />
          {children}
          <Toaster position="bottom-right" />
        </WishlistProvider>
      </CartProvider>
  
  );
}