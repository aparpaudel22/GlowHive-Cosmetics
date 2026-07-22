"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage
  const loadCart = () => {
    try {
      const saved = localStorage.getItem("glowhive_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCartItems(Array.isArray(parsed) ? parsed : []);
        // Load selected items
        const savedSelected = localStorage.getItem("glowhive_cart_selected");
        if (savedSelected) {
          const parsedSelected = JSON.parse(savedSelected);
          setSelectedItems(Array.isArray(parsedSelected) ? parsedSelected : []);
        } else {
          // Select all items by default
          const allIds = Array.isArray(parsed) ? parsed.map(item => item.id) : [];
          setSelectedItems(allIds);
        }
      } else {
        setCartItems([]);
        setSelectedItems([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
      setSelectedItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Listen for auth events to reload cart
  useEffect(() => {
    const handleLogin = () => {
      loadCart();
    };
    const handleLogout = () => {
      loadCart();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('userLoggedIn', handleLogin);
      window.addEventListener('userLoggedOut', handleLogout);
      window.addEventListener('storage', (e) => {
        if (e.key === 'glowhive_cart') {
          loadCart();
        }
        if (e.key === 'glowhive_cart_selected') {
          const saved = localStorage.getItem('glowhive_cart_selected');
          if (saved) {
            setSelectedItems(JSON.parse(saved));
          }
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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("glowhive_cart", JSON.stringify(cartItems));
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    }
  }, [cartItems, isLoading]);

  // Save selected items to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("glowhive_cart_selected", JSON.stringify(selectedItems));
      } catch (error) {
        console.error("Error saving selected items:", error);
      }
    }
  }, [selectedItems, isLoading]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        newCart = [...prev, { ...product, quantity }];
      }
      // Auto-select new item
      const newSelected = [...selectedItems];
      if (!newSelected.includes(product.id)) {
        newSelected.push(product.id);
        setSelectedItems(newSelected);
      }
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  // ── NEW: Remove purchased items from cart ──
  const removePurchasedItems = (purchasedIds) => {
    if (!purchasedIds || purchasedIds.length === 0) return;
    setCartItems((prev) => {
      const newCart = prev.filter((i) => !purchasedIds.includes(i.id));
      // Also remove from selected
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
    try {
      localStorage.setItem("glowhive_cart", JSON.stringify([]));
      localStorage.setItem("glowhive_cart_selected", JSON.stringify([]));
    } catch (error) {
      console.error("Error clearing cart:", error);
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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedItems,
        addToCart,
        removeFromCart,
        removePurchasedItems, // ← NEW
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}