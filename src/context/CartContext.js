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
      // Get cart items
      const saved = localStorage.getItem("glowhive_cart");
      let parsedCart = [];
      if (saved) {
        parsedCart = JSON.parse(saved);
        if (!Array.isArray(parsedCart)) parsedCart = [];
      }
      
      // Get selected items
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
      setSelectedItems([]);
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

    // Listen for storage changes from other tabs/windows
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

    if (typeof window !== 'undefined') {
      window.addEventListener('userLoggedIn', handleLogin);
      window.addEventListener('userLoggedOut', handleLogout);
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('userLoggedIn', handleLogin);
        window.removeEventListener('userLoggedOut', handleLogout);
        window.removeEventListener('storage', handleStorageChange);
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
      const existingIndex = prev.findIndex((i) => i.id === product.id);
      let newCart;
      
      if (existingIndex !== -1) {
        // Update existing item
        newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity
        };
      } else {
        // Add new item with complete product data
        newCart = [...prev, { 
          ...product, 
          quantity: quantity,
          // Ensure all product properties are preserved
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          originalPrice: product.originalPrice,
          rating: product.rating,
          reviews: product.reviews,
          badge: product.badge,
          description: product.description,
          inStock: product.inStock
        }];
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
    setCartItems((prev) => {
      const newCart = prev.filter((i) => i.id !== id);
      return newCart;
    });
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