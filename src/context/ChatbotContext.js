'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ChatbotContext = createContext(null);

// ─── Data Fetcher ───
class DataFetcher {
  static async fetchProducts() {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.error('Failed to fetch products:', e);
    }
    return [];
  }

  static async fetchFAQs() {
    try {
      const response = await fetch('/api/faqs');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.error('Failed to fetch FAQs:', e);
    }
    return [];
  }

  static async fetchTerms() {
    try {
      const response = await fetch('/api/terms');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.error('Failed to fetch terms:', e);
    }
    return null;
  }

  static async fetchPrivacy() {
    try {
      const response = await fetch('/api/privacy');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.error('Failed to fetch privacy:', e);
    }
    return null;
  }

  static async fetchAbout() {
    try {
      const response = await fetch('/api/about');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.error('Failed to fetch about:', e);
    }
    return null;
  }
}

// ─── Product Search Engine ───
class ProductSearchEngine {
  constructor(products) {
    this.products = products;
    this.buildIndex();
  }

  buildIndex() {
    this.index = this.products.map(product => ({
      ...product,
      searchText: [
        product.name,
        product.category,
        product.description || '',
        product.ingredients || '',
        product.brand || ''
      ].join(' ').toLowerCase(),
      nameLower: product.name.toLowerCase(),
      categoryLower: product.category.toLowerCase()
    }));
  }

  search(query) {
    if (!query || query.trim().length === 0) return [];
    
    const q = query.toLowerCase().trim();
    const words = q.split(' ').filter(w => w.length > 1);
    
    const scored = this.index.map(product => {
      let score = 0;
      const searchText = product.searchText;
      
      if (product.nameLower === q) score += 100;
      if (product.nameLower.includes(q)) score += 60;
      if (product.categoryLower.includes(q)) score += 30;
      if (searchText.includes(q)) score += 20;
      
      words.forEach(word => {
        if (product.nameLower.includes(word)) score += 15;
        if (product.categoryLower.includes(word)) score += 10;
        if (searchText.includes(word)) score += 5;
        
        const nameWords = product.nameLower.split(' ');
        nameWords.forEach(nw => {
          if (nw.includes(word) || word.includes(nw)) score += 8;
        });
      });
      
      return { product, score };
    });
    
    return scored
      .filter(item => item.score > 3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.product);
  }

  getFeaturedProducts(limit = 6) {
    return this.products.slice(0, limit);
  }

  getProductsByCategory(category) {
    const cat = category.toLowerCase();
    return this.products.filter(p => 
      p.category.toLowerCase().includes(cat) || 
      cat.includes(p.category.toLowerCase())
    );
  }
}

// ─── Response Generator ───
class ResponseGenerator {
  constructor() {
    this.products = [];
    this.faqs = [];
    this.terms = null;
    this.privacy = null;
    this.about = null;
    this.productEngine = null;
    this.isReady = false;
  }

  async initialize() {
    try {
      const [products, faqs, terms, privacy, about] = await Promise.all([
        DataFetcher.fetchProducts(),
        DataFetcher.fetchFAQs(),
        DataFetcher.fetchTerms(),
        DataFetcher.fetchPrivacy(),
        DataFetcher.fetchAbout()
      ]);

      this.products = products || [];
      this.faqs = faqs || [];
      this.terms = terms;
      this.privacy = privacy;
      this.about = about;
      this.productEngine = new ProductSearchEngine(this.products);
      this.isReady = true;
      
      return true;
    } catch (error) {
      console.error('Failed to initialize chatbot:', error);
      return false;
    }
  }

  generateResponse(message) {
    if (!this.isReady) {
      return {
        type: 'loading',
        text: "⏳ Loading data... Please wait a moment.",
        products: []
      };
    }

    const msg = message.toLowerCase().trim();
    
    // ─── 1. Check if asking about the chatbot itself ───
    if (this.isAboutChatbotQuery(msg)) {
      return {
        type: 'about',
        text: `🤖 **About Me:**\n\nI'm GlowHive's Beauty Assistant, your personal guide to all things beauty!\n\n✨ **What I Can Help With:**\n• Product information (prices, ingredients, how to use)\n• Order tracking and returns\n• Account management\n• Payment methods\n• FAQs, Terms, and Privacy Policy\n\n📋 **About GlowHive:**\n${this.about ? this.about.description : 'Premium beauty and cosmetics brand.'}\n\n💡 Feel free to ask me anything about GlowHive, our products, or your orders!`,
        products: []
      };
    }
    
    // ─── 2. Check if asking about "About GlowHive" or company info ───
    if (this.isAboutCompanyQuery(msg) && this.about) {
      return this.generateAboutResponse();
    }
    
    // ─── 3. Product Listing Queries ───
    if (this.isProductListingQuery(msg)) {
      return this.generateProductListingResponse(msg);
    }
    
    // ─── 4. Check for "how to order" ───
    if (msg.includes('how to order') || msg.includes('place order') || msg.includes('make order')) {
      return {
        type: 'order',
        text: `🛍️ **How to Place an Order:**\n\n1️⃣ Browse our products and add items to your cart\n2️⃣ Click the cart icon to review your items\n3️⃣ Click **'Proceed to Checkout'**\n4️⃣ Enter your shipping address\n5️⃣ Choose a payment method (COD, eSewa, Khalti, Bank Transfer)\n6️⃣ Review your order details\n7️⃣ Click **'Place Order'**\n\n📦 You'll receive a confirmation email with your order details.\n\n✅ Need help? Contact us at support@glowhive.com`,
        products: []
      };
    }
    
    // ─── 5. Account Queries ───
    const accountResponse = this.getAccountResponse(msg);
    if (accountResponse) {
      return accountResponse;
    }
    
    // ─── 6. FAQ Queries ───
    const faqMatch = this.matchFAQ(msg);
    if (faqMatch) {
      return {
        type: 'faq',
        text: `📋 **FAQ:**\n\n${faqMatch}`,
        products: []
      };
    }
    
    // ─── 7. Product Queries ───
    if (this.isProductQuery(msg)) {
      const productResults = this.productEngine.search(msg);
      if (productResults.length > 0) {
        return this.generateProductResponse(productResults, msg);
      } else {
        return this.generateNoProductResponse();
      }
    }
    
    // ─── 8. Terms & Conditions ───
    if (this.isTermsQuery(msg) && this.terms) {
      return {
        type: 'terms',
        text: `📋 **${this.terms.title}:**\n\n${this.terms.sections.map((s, i) => `${i+1}. ${s}`).join('\n')}\n\n📖 For full details, visit our Terms & Conditions page.`,
        products: []
      };
    }
    
    // ─── 9. Privacy Policy ───
    if (this.isPrivacyQuery(msg) && this.privacy) {
      return {
        type: 'privacy',
        text: `🔒 **${this.privacy.title}:**\n\n${this.privacy.sections.map((s, i) => `${i+1}. ${s}`).join('\n')}\n\n📖 For full details, visit our Privacy Policy page.`,
        products: []
      };
    }
    
    // ─── 10. Greetings ───
    if (this.isGreeting(msg)) {
      return {
        type: 'greeting',
        text: `👋 Hello! Welcome to GlowHive Beauty Assistant!\n\nI can help you with:\n\n🛍️ **Products** - What's available, prices, ingredients, how to use\n📦 **Orders** - How to place, track, cancel, returns\n👤 **Account** - Create, delete, reset password, update profile\n💳 **Payments** - Methods, refunds\n📋 **Policies** - FAQs, Terms, Privacy\n🏢 **About** - Learn about GlowHive\n\nWhat would you like to know today? ✨`,
        products: []
      };
    }
    
    // ─── 11. Unknown ───
    return {
      type: 'unknown',
      text: `🌸 I appreciate your question! I don't have specific information about that topic yet.\n\nHere's what I can help with:\n• About GlowHive\n• What products are available\n• How to place an order\n• Product details (prices, ingredients, how to use)\n• Order tracking and returns\n• Account management (create, delete, reset password)\n• Payment methods\n• FAQs, Terms, and Privacy Policy\n\nOur team will get back to you if you need more specific assistance. You can also reach us at support@glowhive.com ✨`,
      products: []
    };
  }

  // ─── About Chatbot Query ───
  isAboutChatbotQuery(msg) {
    const aboutKeywords = [
      'who are you', 'what are you', 'about you', 'tell me about yourself',
      'what is your name', 'who made you', 'what can you do', 'your purpose',
      'what is this chatbot', 'about this chatbot', 'what do you do'
    ];
    return aboutKeywords.some(keyword => msg.includes(keyword));
  }

  // ─── About Company Query ───
  isAboutCompanyQuery(msg) {
    const aboutCompanyKeywords = [
      'about glowhive', 'what is glowhive', 'tell me about glowhive',
      'about the company', 'what is your company', 'who are you guys',
      'about your brand', 'what is your brand', 'glowhive story',
      'about us', 'what do you sell', 'what is this website'
    ];
    return aboutCompanyKeywords.some(keyword => msg.includes(keyword));
  }

  // ─── Generate About Response ───
  generateAboutResponse() {
    const about = this.about;
    if (!about) {
      return {
        type: 'about',
        text: `🏢 **About GlowHive**\n\nGlowHive is a premium beauty and cosmetics brand dedicated to bringing you the finest skincare, makeup, and beauty products.\n\n💡 Visit our About page for more information!`,
        products: []
      };
    }

    const valuesList = about.values ? about.values.map(v => `• ${v}`).join('\n') : '';
    
    return {
      type: 'about',
      text: `🏢 **${about.title || 'About GlowHive'}**\n\n${about.description || ''}\n\n📖 **Our Story:**\n${about.story || ''}\n\n🎯 **Our Mission:**\n${about.mission || ''}\n\n💎 **Our Values:**\n${valuesList}\n\n👥 **Our Team:**\n${about.team || ''}\n\n📧 **Contact:**\n• Email: ${about.contact?.email || 'support@glowhive.com'}\n• Phone: ${about.contact?.phone || '+977 984-1234567'}\n• Address: ${about.contact?.address || 'Kathmandu, Nepal'}\n\n✨ Follow us on social media for updates and exclusive offers!`,
      products: []
    };
  }

  // ─── Product Listing Query Detection ───
  isProductListingQuery(msg) {
    const listingKeywords = [
      'what products are available',
      'what products do you have',
      'show me products',
      'list products',
      'all products',
      'available products',
      'product list',
      'what do you sell',
      'what items are available',
      'featured products',
      'popular products',
      'top products',
      'best products',
      'new products',
      'latest products',
      'trending products',
      'what\'s available',
      'what is available',
      'products'
    ];
    
    return listingKeywords.some(keyword => msg.includes(keyword));
  }

  // ─── Generate product listing response ───
  generateProductListingResponse(msg) {
    const products = this.productEngine.getFeaturedProducts(6);
    
    if (products.length === 0) {
      return {
        type: 'general',
        text: "🌸 We're currently updating our product collection. Please check back soon! In the meantime, feel free to browse our website for the latest arrivals. ✨",
        products: []
      };
    }
    
    const productList = products.map(p => `• **${p.name}** - Rs. ${p.price.toLocaleString()}`).join('\n');
    
    // Check if user asked for specific category
    const categories = ['skincare', 'makeup', 'lip', 'eye', 'fragrance', 'hair', 'body'];
    let categoryFound = null;
    for (const cat of categories) {
      if (msg.includes(cat)) {
        categoryFound = cat;
        break;
      }
    }
    
    if (categoryFound) {
      const categoryProducts = this.productEngine.getProductsByCategory(categoryFound);
      if (categoryProducts.length > 0) {
        const catList = categoryProducts.slice(0, 6).map(p => `• **${p.name}** - Rs. ${p.price.toLocaleString()}`).join('\n');
        return {
          type: 'product',
          text: `🛍️ **${categoryFound.charAt(0).toUpperCase() + categoryFound.slice(1)} Products Available:**\n\n${catList}\n\n✨ Click on any product below to view details, price, and availability! 👇`,
          products: categoryProducts.slice(0, 6)
        };
      }
    }
    
    // Check if user asked for new/popular/trending products
    if (msg.includes('new') || msg.includes('latest') || msg.includes('trending')) {
      const newProducts = this.products.slice(0, 4);
      const newList = newProducts.map(p => `• **${p.name}** - Rs. ${p.price.toLocaleString()}`).join('\n');
      return {
        type: 'product',
        text: `🆕 **Latest Arrivals:**\n\n${newList}\n\n✨ These are our newest products! Click below to explore! 👇`,
        products: newProducts
      };
    }
    
    if (msg.includes('popular') || msg.includes('best') || msg.includes('top')) {
      const popularProducts = this.products.slice(0, 6);
      const popularList = popularProducts.map(p => `• **${p.name}** - Rs. ${p.price.toLocaleString()}`).join('\n');
      return {
        type: 'product',
        text: `⭐ **Popular Products:**\n\n${popularList}\n\n✨ These are our most loved products! Click below to explore! 👇`,
        products: popularProducts
      };
    }
    
    return {
      type: 'product',
      text: `🛍️ **Featured Products Available:**\n\n${productList}\n\n✨ Click on any product below to view details, price, and availability! 👇`,
      products: products
    };
  }

  // ─── Account Query Detection ───
  getAccountResponse(msg) {
    if (msg.includes('create account') || msg.includes('make account') || msg.includes('sign up') || msg.includes('register')) {
      return {
        type: 'account',
        text: `👤 **How to Create an Account:**\n\n1️⃣ Click **'Sign In'** in the top right corner\n2️⃣ Select **'Register'** tab\n3️⃣ Fill in your details:\n   • Full Name\n   • Email Address\n   • Phone Number\n   • Password (min 6 characters)\n4️⃣ Upload a profile photo (optional)\n5️⃣ Agree to **Terms & Conditions**\n6️⃣ Click **'Create Account'**\n\n💡 You can also sign up with **Google** for faster registration!\n\n✅ Once registered, you can track orders, save wishlist items, and manage your profile.`,
        products: []
      };
    }
    
    if (msg.includes('delete account') || msg.includes('remove account') || msg.includes('close account')) {
      return {
        type: 'account',
        text: `🗑️ **How to Delete Your Account:**\n\n1️⃣ Log in to your account\n2️⃣ Go to **'My Account'** page\n3️⃣ Scroll down and click **'Delete Account'**\n4️⃣ Type **'DELETE'** to confirm\n5️⃣ Click **'Delete Permanently'**\n\n⚠️ **Important:**\n• This action is **permanent** and cannot be undone\n• All your data will be deleted (orders, wishlist, profile)\n• You'll need to create a new account to shop again\n\nNeed help? Contact us at support@glowhive.com`,
        products: []
      };
    }
    
    if (msg.includes('change password') || msg.includes('reset password') || msg.includes('update password')) {
      return {
        type: 'account',
        text: `🔑 **How to Change Your Password:**\n\n**Option 1: From Account Page**\n1️⃣ Log in to your account\n2️⃣ Go to **'My Account'** page\n3️⃣ Click **'Edit'** on Personal Details\n4️⃣ Enter your new password\n5️⃣ Click **'Save Details'**\n\n**Option 2: Forgot Password**\n1️⃣ Go to the login page\n2️⃣ Click **'Forgot Password?'**\n3️⃣ Enter your email address\n4️⃣ Check your email for reset link\n5️⃣ Follow the link to create new password\n\n🔒 For security, use a strong password with at least 6 characters.`,
        products: []
      };
    }
    
    if (msg.includes('update profile') || msg.includes('edit profile') || msg.includes('change email')) {
      return {
        type: 'account',
        text: `👤 **How to Update Your Profile:**\n\n1️⃣ Log in to your account\n2️⃣ Go to **'My Account'** page\n3️⃣ Click **'Edit'** on Personal Details\n4️⃣ Update your information:\n   • First Name\n   • Last Name\n   • Phone Number\n   • Profile Photo (tap the avatar)\n5️⃣ Click **'Save Details'**\n\n✅ Your changes will be saved immediately!\n\n💡 Tip: Keep your phone number updated for order delivery notifications.`,
        products: []
      };
    }
    
    return null;
  }

  // ─── FAQ Matching ───
  matchFAQ(msg) {
    for (const faq of this.faqs) {
      const questionWords = faq.question.toLowerCase().split(' ');
      const matchCount = questionWords.filter(word => 
        word.length > 3 && msg.includes(word)
      ).length;
      
      if (matchCount > 2) {
        return faq.answer;
      }
    }
    
    const faqKeywords = {
      'track order|order status|where is my order': "📦 You can track your order by logging into your account and visiting the 'My Orders' section. You'll also receive email updates with tracking information.",
      'return|refund|exchange|money back': "🔄 We offer a 30-day return policy on all products. Items must be unused and in original packaging. Refunds are processed within 3-5 business days to your original payment method.",
      'shipping|delivery|ship|how long': "🚚 Standard shipping: 3-5 business days. Express shipping: 1-2 business days. Free shipping on orders over Rs. 5000.",
      'payment|pay|cod|esewa|khalti': "💳 We accept Cash on Delivery, eSewa Wallet, Khalti Wallet, and Bank Transfer. All transactions are secure."
    };
    
    for (const [pattern, response] of Object.entries(faqKeywords)) {
      const keywords = pattern.split('|');
      if (keywords.some(k => msg.includes(k))) {
        return response;
      }
    }
    
    return null;
  }

  // ─── Product Query Detection ───
  isProductQuery(msg) {
    if (this.isProductListingQuery(msg)) return false;
    if (this.isAboutChatbotQuery(msg)) return false;
    if (this.isAboutCompanyQuery(msg)) return false;
    if (msg.includes('how to order') || msg.includes('place order') || msg.includes('make order')) return false;
    if (this.getAccountResponse(msg)) return false;
    
    const productIndicators = [
      'available', 'have', 'got', 'sell', 'show', 'tell', 'about', 
      'detail', 'find', 'search', 'looking', 'want', 'price', 'cost', 
      'how much', 'ingredient', 'contains', 'describe', 'what is', 
      'apply', 'use', 'how to', 'recommend', 'suggest', 'best'
    ];
    
    const hasIndicator = productIndicators.some(ind => msg.includes(ind));
    const hasProductName = this.products.some(p => msg.includes(p.name.toLowerCase()));
    const hasCategory = ['skincare', 'makeup', 'lip', 'eye', 'fragrance', 'hair', 'body']
      .some(cat => msg.includes(cat));
    
    return hasIndicator || hasProductName || hasCategory;
  }

  // ─── Other Query Detections ───
  isTermsQuery(msg) {
    const termsKeywords = ['terms', 'condition', 'legal', 'agreement'];
    return termsKeywords.some(keyword => msg.includes(keyword)) && 
           !msg.includes('privacy') && 
           !msg.includes('cookie') &&
           !msg.includes('account') &&
           !msg.includes('order') &&
           !msg.includes('about');
  }

  isPrivacyQuery(msg) {
    const privacyKeywords = ['privacy', 'personal data', 'information', 'secure', 'data protection'];
    return privacyKeywords.some(keyword => msg.includes(keyword)) && 
           !msg.includes('terms') && 
           !msg.includes('cookie') &&
           !msg.includes('account') &&
           !msg.includes('order') &&
           !msg.includes('about');
  }

  isGreeting(msg) {
    const greetings = ['hi', 'hello', 'hey', 'greeting', 'good morning', 'good evening', 'good afternoon'];
    return greetings.some(g => msg.includes(g)) && msg.length < 30;
  }

  // ─── Product Response Generation ───
  generateProductResponse(products, msg) {
    const product = products[0];
    const priceInfo = this.getPriceInfo(product);
    
    if (msg.includes('ingredient') || msg.includes('contains') || msg.includes('made of')) {
      return {
        type: 'ingredients',
        text: `🧪 **${product.name} - Ingredients**\n\n${product.ingredients || 'Ingredients information available on product page.'}\n\n💡 Always check the product page for complete details.`,
        products: [product]
      };
    }
    
    if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
      return {
        type: 'price',
        text: `💰 **${product.name}**\n\n${priceInfo}\n\n⭐ Rating: ${product.rating || '4.5'}/5\n📂 Category: ${product.category}`,
        products: [product]
      };
    }
    
    if (msg.includes('available') || msg.includes('have') || msg.includes('got')) {
      return {
        type: 'availability',
        text: `✅ **${product.name}** is in stock! ✨\n\n${product.description || 'Premium quality product from GlowHive.'}\n\n${priceInfo}\n⭐ Rating: ${product.rating || '4.5'}/5\n📂 Category: ${product.category}`,
        products: [product]
      };
    }
    
    if ((msg.includes('apply') || msg.includes('use') || msg.includes('how to')) && !msg.includes('account') && !msg.includes('delete')) {
      const tips = this.getApplicationTips(product.category);
      return {
        type: 'application',
        text: `💆‍♀️ **How to use ${product.name}:**\n\n${tips}\n\n✨ Pro Tip: Always do a patch test before first use!`,
        products: [product]
      };
    }
    
    if (msg.includes('describe') || msg.includes('what is') || msg.includes('about')) {
      return {
        type: 'description',
        text: `📝 **${product.name}**\n\n${product.description || 'Premium quality product from GlowHive.'}\n\n${priceInfo}\n⭐ Rating: ${product.rating || '4.5'}/5\n📂 Category: ${product.category}\n🧪 Ingredients: ${product.ingredients || 'Available on product page.'}`,
        products: [product]
      };
    }
    
    if (products.length > 1) {
      const productList = products.slice(0, 5).map(p => `• ${p.name}`).join('\n');
      return {
        type: 'product',
        text: `🛍️ I found ${products.length} product(s) matching your search:\n\n${productList}\n\n✨ Click on any product below to view details! 👇`,
        products: products.slice(0, 5)
      };
    }
    
    return {
      type: 'product',
      text: `🛍️ **${product.name}**\n\n${product.description || 'Premium quality product from GlowHive.'}\n\n${priceInfo}\n⭐ Rating: ${product.rating || '4.5'}/5\n📂 Category: ${product.category}`,
      products: [product]
    };
  }

  generateNoProductResponse() {
    const suggestions = this.products.slice(0, 5);
    return {
      type: 'general',
      text: `🔍 I couldn't find products matching your search. Here are some popular products:\n\n${suggestions.map(p => `• ${p.name}`).join('\n')}\n\n✨ Or try searching with different keywords!`,
      products: suggestions
    };
  }

  getPriceInfo(product) {
    if (product.originalPrice && product.originalPrice > product.price) {
      const discount = Math.round((1 - product.price / product.originalPrice) * 100);
      return `💰 Price: Rs. ${product.price.toLocaleString()}\n   (Was: Rs. ${product.originalPrice.toLocaleString()}, ${discount}% off!)`;
    }
    return `💰 Price: Rs. ${product.price.toLocaleString()}`;
  }

  getApplicationTips(category) {
    const tips = {
      skincare: "1. Cleanse face thoroughly\n2. Apply a small amount (pea-sized)\n3. Gently massage in upward circular motions\n4. Wait 2-3 minutes for absorption\n5. Follow with moisturizer\n\n💡 Use morning and evening for best results.",
      makeup: "1. Start with clean, moisturized skin\n2. Apply primer first\n3. Use the right tools (brushes/sponges)\n4. Build coverage gradually\n5. Blend well for natural finish\n6. Set with setting spray\n\n💡 Always blend well for a flawless look!",
      'lip care': "1. Exfoliate lips gently\n2. Apply a thin, even layer\n3. Allow to absorb\n4. Reapply throughout the day\n5. Apply before bed for overnight repair\n\n💡 For best results, apply before bed and in the morning.",
      'eye care': "1. Start with clean hands and face\n2. Take a tiny amount (rice grain size)\n3. Use ring finger (gentlest)\n4. Gently pat around eye area\n5. Apply from inner to outer corner\n\n💡 Be very gentle - the eye area is delicate!",
      fragrance: "1. Apply to pulse points (wrists, neck, behind ears)\n2. DON'T rub wrists together\n3. Apply after showering\n4. Layer with matching body lotion\n5. Spray from 6-8 inches away\n\n💡 Less is more - start with 1-2 sprays.",
      'hair care': "1. Apply to clean, damp hair\n2. Distribute evenly from roots to ends\n3. Leave for recommended time\n4. Rinse thoroughly with lukewarm water\n5. Follow with conditioner\n\n💡 Use heat protectant before styling!",
      'body care': "1. Apply to clean, slightly damp skin\n2. Use upward, circular motions\n3. Pay attention to rough areas\n4. Allow to absorb before dressing\n5. Use daily for best results\n\n💡 Best applied right after showering."
    };
    
    for (const [key, value] of Object.entries(tips)) {
      if (category.toLowerCase().includes(key) || key.includes(category.toLowerCase())) {
        return value;
      }
    }
    return "1. Cleanse the area thoroughly\n2. Apply a small amount\n3. Gently massage in\n4. Allow to absorb\n5. Follow with other products\n\n💡 Always read the product label for specific instructions.";
  }
}

// ─── Chatbot Provider ───
export function ChatbotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [responseGenerator, setResponseGenerator] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      const generator = new ResponseGenerator();
      await generator.initialize();
      setResponseGenerator(generator);
      setIsInitialized(true);
    };
    init();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chatbot_messages');
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        const welcome = {
          id: Date.now(),
          text: "👋 Welcome to GlowHive Beauty Assistant!\n\nI'm here to help you with:\n\n🛍️ **Products** - What's available, prices, ingredients, how to use\n📦 **Orders** - How to place, track, cancel, returns\n👤 **Account** - Create, delete, reset password, update profile\n💳 **Payments** - Methods, refunds\n📋 **Policies** - FAQs, Terms, Privacy\n🏢 **About** - Learn about GlowHive\n\nWhat would you like to know today? ✨",
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages([welcome]);
        localStorage.setItem('chatbot_messages', JSON.stringify([welcome]));
      }
    } catch (_) {
      const welcome = {
        id: Date.now(),
        text: "👋 Welcome to GlowHive Beauty Assistant! How can I help you today?",
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages([welcome]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('chatbot_messages', JSON.stringify(messages));
      } catch (_) {}
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    setIsTyping(true);

    setTimeout(() => {
      if (!responseGenerator || !isInitialized) {
        const loadingMessage = {
          id: Date.now() + 1,
          text: "⏳ Loading data... Please wait a moment.",
          sender: 'bot',
          timestamp: new Date().toISOString(),
          type: 'loading',
          products: [],
        };
        setMessages(prev => [...prev, loadingMessage]);
        setIsTyping(false);
        return;
      }

      const response = responseGenerator.generateResponse(text);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: response.type || 'general',
        products: response.products || [],
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 600 + Math.random() * 600);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  const clearChat = () => {
    const welcome = {
      id: Date.now(),
      text: "👋 Welcome to GlowHive Beauty Assistant!\n\nI'm here to help you with:\n\n🛍️ **Products** - What's available, prices, ingredients, how to use\n📦 **Orders** - How to place, track, cancel, returns\n👤 **Account** - Create, delete, reset password, update profile\n💳 **Payments** - Methods, refunds\n📋 **Policies** - FAQs, Terms, Privacy\n🏢 **About** - Learn about GlowHive\n\nWhat would you like to know today? ✨",
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };
    setMessages([welcome]);
    localStorage.setItem('chatbot_messages', JSON.stringify([welcome]));
    toast.success('Chat cleared!');
  };

  return (
    <ChatbotContext.Provider value={{
      isOpen,
      setIsOpen,
      messages,
      setMessages,
      isTyping,
      setIsTyping,
      isMinimized,
      setIsMinimized,
      sendMessage,
      toggleChat,
      minimizeChat,
      maximizeChat,
      clearChat,
      isInitialized,
    }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}

export default ChatbotProvider;