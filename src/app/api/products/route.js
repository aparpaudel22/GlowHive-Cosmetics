import { NextResponse } from 'next/server';
import { products } from '@/data/mockData';

export async function GET() {
  // Return only necessary product data (not admin data)
  const productData = products.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    category: product.category,
    description: product.description || 'Premium quality product from GlowHive.',
    ingredients: product.ingredients || 'Please check the product page for detailed ingredients.',
    rating: product.rating || 4.5,
    image: product.image,
    brand: product.brand || 'GlowHive'
  }));
  
  return NextResponse.json(productData);
}