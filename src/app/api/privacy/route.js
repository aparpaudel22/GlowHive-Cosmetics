import { NextResponse } from 'next/server';

// This will fetch Privacy Policy from your Privacy page
const privacy = {
  title: "Privacy Policy",
  sections: [
    "We collect information you provide (name, email, phone, address)",
    "We use it to process orders and improve your experience",
    "We DO NOT sell or rent your personal information",
    "SSL encryption protects your data during transmission",
    "You can request data deletion at any time"
  ]
};

export async function GET() {
  return NextResponse.json(privacy);
}