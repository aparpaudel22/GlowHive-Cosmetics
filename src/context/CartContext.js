"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";

const CartContext = createContext(null);

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

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialMount = useRef(true);

  // Load cart from localStorage
  const loadCart = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem("glowhive_cart");
      let parsedCart = [];
      if (saved) {
        parsedCart = JSON.parse(saved);
        if (!Array.isArray(parsedCart)) parsedCart = [];
      }
      
      const savedSelected = localStorage.getItem("glowhive_cart_selected");
      let parsedSelected = [];
      if (savedSelected) {
        parsedSelected = JSON.parse(savedSelected);
        if (!Array.isArray(parsedSelected)) parsedSelected = [];
      }
      
      // If no selected items but cart has items, select all
      if (parsedSelected.length === 0 && parsedCart.length > 0) {
        parsedSelected = parsedCart.map(item => item.id);
      }
      
      setCartItems(parsedCart);
      setSelectedItems(parsedSelected);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
      setSelectedItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync cart to scoped storage (for the current user)
  const syncToScopedStorage = () => {
    if (typeof window === 'undefined') return;
    
    const email = getCurrentUserEmail();
    if (!email) return;
    
    try {
      // Sync cart
      const cartData = localStorage.getItem('glowhive_cart');
      if (cartData) {
        const scopedCartKey = getScopedKey(email, 'cart');
        localStorage.setItem(scopedCartKey, cartData);
        console.log('Synced cart to scoped storage:', cartData);
      }
      
      // Sync selected items
      const selectedData = localStorage.getItem('glowhive_cart_selected');
      if (selectedData) {
        const scopedSelectedKey = getScopedKey(email, 'cart_selected');
        localStorage.setItem(scopedSelectedKey, selectedData);
        console.log('Synced selected items to scoped storage:', selectedData);
      }
    } catch (error) {
      console.error('Error syncing to scoped storage:', error);
    }
  };

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Listen for user login/logout to reload cart
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleLogin = () => {
      loadCart();
    };
    
    const handleLogout = () => {
      loadCart();
    };
    
    window.addEventListener('userLoggedIn', handleLogin);
    window.addEventListener('userLoggedOut', handleLogout);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleLogin);
      window.removeEventListener('userLoggedOut', handleLogout);
    };
  }, []);

  // Save cart to localStorage whenever it changes (but not on initial mount)
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading) return;
    
    // Skip saving on initial mount to prevent overwriting
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    try {
      localStorage.setItem("glowhive_cart", JSON.stringify(cartItems));
      // Sync to scoped storage after saving
      syncToScopedStorage();
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cartItems, isLoading]);

  // Save selected items to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading) return;
    
    if (isInitialMount.current) {
      return;
    }
    
    try {
      localStorage.setItem("glowhive_cart_selected", JSON.stringify(selectedItems));
      // Sync to scoped storage after saving
      syncToScopedStorage();
    } catch (error) {
      console.error("Error saving selected items:", error);
    }
  }, [selectedItems, isLoading]);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (e) => {
      if (e.key === 'glowhive_cart') {
        loadCart();
      }
      if (e.key === 'glowhive_cart_selected') {
        const saved = localStorage.getItem('glowhive_cart_selected');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setSelectedItems(parsed);
            }
          } catch (error) {
            console.error('Error parsing selected items:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === product.id);
      let newCart;
      
      if (existingIndex !== -1) {
        newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity
        };
      } else {
        newCart = [...prev, { 
          ...product, 
          quantity: quantity,
        }];
      }
      
      // Auto-select new item
      setSelectedItems((prevSelected) => {
        if (!prevSelected.includes(product.id)) {
          return [...prevSelected, product.id];
        }
        return prevSelected;
      });
      
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const removePurchasedItems = (purchasedIds) => {
    if (!purchasedIds || purchasedIds.length === 0) return;
    setCartItems((prev) => {
      const newCart = prev.filter((i) => !purchasedIds.includes(i.id));
      setSelectedItems((prevSelected) => prevSelected.filter((id) => !purchasedIds.includes(id)));
      return newCart;
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const selectAllItems = () => {
    const allIds = cartItems.map(item => item.id);
    setSelectedItems(allIds);
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedItems([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem("glowhive_cart", JSON.stringify([]));
      localStorage.setItem("glowhive_cart_selected", JSON.stringify([]));
      // Also sync empty cart to scoped storage
      syncToScopedStorage();
    }
  };

  const getSelectedItems = () => {
    return cartItems.filter(item => selectedItems.includes(item.id));
  };

  const getSelectedTotal = () => {
    return getSelectedItems().reduce((sum, i) => {
      const price = i.sale_price || i.price;
      return sum + price * i.quantity;
    }, 0);
  };

  const getSelectedCount = () => {
    return getSelectedItems().reduce((sum, i) => sum + i.quantity, 0);
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce((sum, i) => {
    const price = i.sale_price || i.price;
    return sum + price * i.quantity;
  }, 0);

  const value = {
    cartItems,
    selectedItems,
    addToCart,
    removeFromCart,
    removePurchasedItems,
    updateQuantity,
    toggleSelectItem,
    selectAllItems,
    deselectAllItems,
    clearCart,
    getSelectedItems,
    getSelectedTotal,
    getSelectedCount,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    isLoading,
    refreshCart: loadCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}