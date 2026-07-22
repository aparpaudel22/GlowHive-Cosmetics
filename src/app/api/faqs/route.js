import { NextResponse } from 'next/server';

// This will fetch FAQs from your FAQs page data
// You can also read from a database or file
const faqs = [
  {
    id: 1,
    question: "How do I track my order?",
    answer: "You can track your order by logging into your account and visiting the 'My Orders' section. You'll also receive email notifications with tracking information."
  },
  {
    id: 2,
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy on all products. Items must be unused and in original packaging. Refunds are processed within 3-5 business days."
  },
  {
    id: 3,
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days. Express shipping delivers in 1-2 business days. Free shipping on orders over Rs. 5000."
  },
  {
    id: 4,
    question: "What payment methods do you accept?",
    answer: "We accept Cash on Delivery, eSewa, Khalti, and Bank Transfer. All transactions are secure."
  },
  {
    id: 5,
    question: "How do I reset my password?",
    answer: "Click 'Forgot Password' on the login page. You'll receive a reset link via email to create a new password."
  },
  {
    id: 6,
    question: "How do I delete my account?",
    answer: "To delete your account: Log in, go to 'My Account', scroll down and click 'Delete Account', type 'DELETE' to confirm, then click 'Delete Permanently'. This action is permanent and cannot be undone."
  },
  {
    id: 7,
    question: "How do I create an account?",
    answer: "To create an account: Click 'Sign In' in the top right corner, select 'Register', fill in your name, email, phone number, and create a password, upload a profile photo (optional), agree to Terms & Conditions, then click 'Create Account'. You can also sign up with Google for faster registration."
  },
  {
    id: 8,
    question: "How do I change my password?",
    answer: "To change your password: Log in, go to 'My Account', click 'Edit' on Personal Details, update your password, then click 'Save Details'. Or use 'Forgot Password' on the login page to reset it."
  },
  {
    id: 9,
    question: "How do I update my profile?",
    answer: "To update your profile: Log in, go to 'My Account', click 'Edit' on Personal Details, update your information (name, phone, photo), then click 'Save Details'."
  }
];

export async function GET() {
  return NextResponse.json(faqs);
}