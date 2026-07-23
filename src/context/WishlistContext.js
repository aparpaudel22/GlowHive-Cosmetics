"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";

const WishlistContext = createContext(null);

// Helper to get current user email from localStorage
const getCurrentUserEmail = () => {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('glowhive_user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed?.email || null;
    }
    return null;
  } catch {
    return null;
  }
};

// Helper to get scoped key for a user
const getScopedKey = (email, key) => {
  return `glowhive_${encodeURIComponent(email)}_${key}`;
};

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialMount = useRef(true);

  // Load wishlist from localStorage
  const loadWishlist = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem("glowhive_wishlist");
      let parsed = [];
      if (saved) {
        parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) parsed = [];
      }
      setWishlistIds(parsed);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setWishlistIds([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync wishlist to scoped storage (for the current user)
  const syncToScopedStorage = () => {
    if (typeof window === 'undefined') return;
    
    const email = getCurrentUserEmail();
    if (!email) return;
    
    try {
      const wishlistData = localStorage.getItem('glowhive_wishlist');
      if (wishlistData) {
        const scopedKey = getScopedKey(email, 'wishlist');
        localStorage.setItem(scopedKey, wishlistData);
        console.log('Synced wishlist to scoped storage:', wishlistData);
      }
    } catch (error) {
      console.error('Error syncing wishlist to scoped storage:', error);
    }
  };

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  // Listen for user login/logout to reload wishlist
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleLogin = () => {
      loadWishlist();
    };
    
    const handleLogout = () => {
      loadWishlist();
    };
    
    window.addEventListener('userLoggedIn', handleLogin);
    window.addEventListener('userLoggedOut', handleLogout);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleLogin);
      window.removeEventListener('userLoggedOut', handleLogout);
    };
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading) return;
    
    // Skip saving on initial mount to prevent overwriting
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    try {
      localStorage.setItem("glowhive_wishlist", JSON.stringify(wishlistIds));
      // Sync to scoped storage after saving
      syncToScopedStorage();
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  }, [wishlistIds, isLoading]);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (e) => {
      if (e.key === 'glowhive_wishlist') {
        loadWishlist();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToWishlist = (id) => {
    if (!wishlistIds.includes(id)) {
      setWishlistIds([...wishlistIds, id]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistIds(wishlistIds.filter((i) => i !== id));
  };

  const toggleWishlist = (id) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isWishlisted = (id) => wishlistIds.includes(id);

  const clearWishlist = () => {
    setWishlistIds([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem("glowhive_wishlist", JSON.stringify([]));
      syncToScopedStorage();
    }
  };

  // NEW: Remove multiple items from wishlist (for "Add All to Cart")
  const removeMultipleFromWishlist = (productIds) => {
    if (!productIds || productIds.length === 0) return;
    setWishlistIds((prev) => prev.filter((id) => !productIds.includes(id)));
  };

  const value = {
    wishlistIds,
    addToWishlist,
    removeFromWishlist,
    removeMultipleFromWishlist, // NEW
    toggleWishlist,
    isWishlisted,
    clearWishlist,
    wishlistCount: wishlistIds.length,
    isLoading,
    refreshWishlist: loadWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}