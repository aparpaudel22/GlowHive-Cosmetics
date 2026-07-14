import React from 'react';

import AboutStory from '@/components/about/AboutStory';


export const metadata = {
  title: 'About GLOWHIVE | Premium Skincare & Makeup',
  description: 'Discover the story behind GLOWHIVE - premium skincare and makeup crafted for your natural beauty. 100% cruelty-free, always.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      
      <AboutStory />
      
    </main>
  );
}