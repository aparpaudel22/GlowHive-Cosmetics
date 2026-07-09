import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import NewsletterBanner from '@/components/NewsletterBanner';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <CategoryGrid />
      <FeaturedProducts />
      <NewsletterBanner />
      <Testimonials />
      <Footer />
    </main>
  );
}