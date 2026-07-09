import Providers from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: 'GlowHive-Beauty',
  description: 'Premium skincare, makeup & beauty products.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}