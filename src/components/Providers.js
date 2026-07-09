'use client';

import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  return (
    <CartProvider>
      <Navbar />
      {children}
      <Toaster position="bottom-right" />
    </CartProvider>
  );
}