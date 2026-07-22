"use client";
import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext(null);

const DEFAULT_WISHLIST_IDS = [1, 2, 4, 6, 10, 3];

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = () => {
    try {
      const saved = localStorage.getItem("glowhive_wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        setWishlistIds(Array.isArray(parsed) ? parsed : DEFAULT_WISHLIST_IDS);
      } else {
        setWishlistIds(DEFAULT_WISHLIST_IDS);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setWishlistIds(DEFAULT_WISHLIST_IDS);
    } finally {
      setIsLoading(false);
      setHydrated(true);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  // Listen for auth events
  useEffect(() => {
    const handleLogin = () => loadWishlist();
    const handleLogout = () => loadWishlist();

    if (typeof window !== 'undefined') {
      window.addEventListener('userLoggedIn', handleLogin);
      window.addEventListener('userLoggedOut', handleLogout);
      window.addEventListener('storage', (e) => {
        if (e.key === 'glowhive_wishlist') {
          loadWishlist();
        }
      });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('userLoggedIn', handleLogin);
        window.removeEventListener('userLoggedOut', handleLogout);
      }
    };
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem("glowhive_wishlist", JSON.stringify(wishlistIds));
      } catch (error) {
        console.error("Error saving wishlist:", error);
      }
    }
  }, [wishlistIds, hydrated]);

  const addToWishlist = (id) =>
    setWishlistIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

  const removeFromWishlist = (id) =>
    setWishlistIds((prev) => prev.filter((i) => i !== id));

  const toggleWishlist = (id) =>
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const isWishlisted = (id) => wishlistIds.includes(id);

  const clearWishlist = () => setWishlistIds([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
        clearWishlist,
        wishlistCount: wishlistIds.length,
        isLoading,
        refreshWishlist: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}