"use client";
import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext(null);

// Shown the very first time a visitor has no saved wishlist yet,
// so the page isn't empty on first visit. Once the user interacts,
// their real choices take over (and persist in localStorage).
const DEFAULT_WISHLIST_IDS = [1, 2, 4, 6, 10, 3];

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("glowhive_wishlist");
    setWishlistIds(saved ? JSON.parse(saved) : DEFAULT_WISHLIST_IDS);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("glowhive_wishlist", JSON.stringify(wishlistIds));
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
