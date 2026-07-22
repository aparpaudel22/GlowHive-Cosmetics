import { NextResponse } from 'next/server';

// About page content - Update this with your actual About page content
const aboutContent = {
  title: "About GlowHive",
  description: "GlowHive is a premium beauty and cosmetics brand dedicated to bringing you the finest skincare, makeup, and beauty products.",
  mission: "Our mission is to empower individuals to feel confident and beautiful in their own skin through high-quality, cruelty-free beauty products.",
  story: "Founded in 2024, GlowHive was born from a passion for clean, effective beauty. We believe that beauty should be accessible, sustainable, and kind to both you and the planet.",
  values: [
    "100% Cruelty-Free - We never test on animals",
    "Premium Quality - Only the finest ingredients",
    "Sustainable Practices - Eco-friendly packaging",
    "Customer First - Your satisfaction is our priority"
  ],
  team: "Our team of beauty experts and skincare enthusiasts works tirelessly to curate the best products from around the world, ensuring every item meets our high standards.",
  contact: {
    email: "support@glowhive.com",
    phone: "+977 984-1234567",
    address: "Kathmandu, Nepal"
  },
  social: {
    instagram: "https://instagram.com/glowhive",
    facebook: "https://facebook.com/glowhive",
    twitter: "https://twitter.com/glowhive",
    youtube: "https://youtube.com/@glowhive"
  }
};

export async function GET() {
  return NextResponse.json(aboutContent);
}