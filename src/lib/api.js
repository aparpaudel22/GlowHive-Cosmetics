const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function request(endpoint, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("glowhive_token")
      : null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
}

export const api = {
  // Auth
  register: (data) =>
    request("/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) =>
    request("/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => request("/logout", { method: "POST" }),
  profile: () => request("/profile"),

  // Products
  getProducts: (params) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/products${qs}`);
  },
  getProduct: (slug) => request(`/products/${slug}`),
  getFeatured: () => request("/products?is_featured=1"),

  // Categories & Brands
  getCategories: () => request("/categories"),
  getBrands:     () => request("/brands"),

  // Cart
  getCart: () => request("/cart"),
  addToCart: (product_id, quantity) =>
    request("/cart", { method: "POST", body: JSON.stringify({ product_id, quantity }) }),
  updateCart: (id, quantity) =>
    request(`/cart/${id}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
  removeFromCart: (id) =>
    request(`/cart/${id}`, { method: "DELETE" }),

  // Orders
  getOrders:   () => request("/orders"),
  getOrder:    (id) => request(`/orders/${id}`),
  placeOrder:  (data) =>
    request("/orders", { method: "POST", body: JSON.stringify(data) }),
  cancelOrder: (id) =>
    request(`/orders/${id}/cancel`, { method: "POST" }),

  // Reviews
  getReviews: (productId) => request(`/products/${productId}/reviews`),
  addReview:  (productId, data) =>
    request(`/products/${productId}/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};