import { NextResponse } from 'next/server';

// This will fetch Terms from your Terms page
const terms = {
  title: "Terms & Conditions",
  sections: [
    "You must be 16+ to create an account",
    "All orders are subject to availability",
    "Prices may change without notice",
    "30-day return policy applies",
    "We reserve the right to refuse orders",
    "Disputes governed by Nepal law"
  ]
};

export async function GET() {
  return NextResponse.json(terms);
}