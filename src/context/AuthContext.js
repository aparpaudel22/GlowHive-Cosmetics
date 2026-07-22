'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// ── All keys that belong to a signed-in user ──
const DATA_KEYS = ['orders', 'profile', 'avatar', 'addresses', 'cart'];

const generic = (key) => `glowhive_${key}`;
const scoped = (email, key) => `glowhive_${encodeURIComponent(email)}_${key}`;

/** Copy current generic keys → user-scoped storage */
function backupData(email) {
  DATA_KEYS.forEach(k => {
    const val = localStorage.getItem(generic(k));
    if (val !== null) localStorage.setItem(scoped(email, k), val);
  });
}

/** Copy user-scoped storage → generic keys (clears keys with no saved data) */
function restoreData(email) {
  DATA_KEYS.forEach(k => {
    const val = localStorage.getItem(scoped(email, k));
    if (val !== null) localStorage.setItem(generic(k), val);
    else localStorage.removeItem(generic(k));
  });
}

/** Wipe all generic data keys (called on logout / new account) */
function clearGenericData() {
  DATA_KEYS.forEach(k => localStorage.removeItem(generic(k)));
}

/** Delete all user data permanently (called on account deletion) */
function deleteAllUserData(email) {
  // Remove generic keys
  DATA_KEYS.forEach(k => localStorage.removeItem(generic(k)));
  // Remove scoped keys
  DATA_KEYS.forEach(k => localStorage.removeItem(scoped(email, k)));
  // Remove user session
  localStorage.removeItem('glowhive_user');
  // Remove user from users list
  const users = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
  const filteredUsers = users.filter(u => u.email !== email);
  localStorage.setItem('glowhive_users', JSON.stringify(filteredUsers));
}

// ─────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // ── Rehydrate session on page load ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem('glowhive_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        // Restore this user's data so pages see their own orders / profile
        if (parsed?.email) restoreData(parsed.email);
      }
    } catch (_) {}
    setHydrated(true);
  }, []);

  // ── Login ──
  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
      const found = users.find(u => u.email === email);
      if (!found) return { error: 'NO_ACCOUNT' };
      if (found.password !== password) return { error: 'WRONG_PASSWORD' };

      const u = {
        name: found.name,
        email: found.email,
        phone: found.phone || '',
        picture: found.picture || null
      };
      localStorage.setItem('glowhive_user', JSON.stringify(u));
      // Load this user's saved data into the generic keys
      restoreData(email);
      setUser(u);
      return {};
    } catch (_) {
      return { error: 'UNKNOWN' };
    }
  };

  // ── Register ──
  const register = async (name, email, password, phone, avatar = null) => {
    try {
      // Validate phone number
      if (!phone || phone.replace(/\D/g, '').length < 10) {
        return { error: 'INVALID_PHONE' };
      }

      const users = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
      if (users.find(u => u.email === email)) return { error: 'ALREADY_EXISTS' };

      // Create user with phone and avatar
      const newUser = {
        name,
        email,
        password,
        phone: phone.trim(),
        picture: avatar || null
      };

      localStorage.setItem('glowhive_users', JSON.stringify([...users, newUser]));

      const u = {
        name,
        email,
        phone: phone.trim(),
        picture: avatar || null
      };

      localStorage.setItem('glowhive_user', JSON.stringify(u));

      // Save avatar if provided
      if (avatar) {
        localStorage.setItem(generic('avatar'), avatar);
        localStorage.setItem(scoped(email, 'avatar'), avatar);
      }

      // Save profile with phone number
      const profile = { firstName: name.split(' ')[0] || '', lastName: name.split(' ').slice(1).join(' ') || '', phone: phone.trim() };
      localStorage.setItem(generic('profile'), JSON.stringify(profile));
      localStorage.setItem(scoped(email, 'profile'), JSON.stringify(profile));

      // Brand-new account → start completely fresh
      clearGenericData();
      setUser(u);
      return {};
    } catch (_) {
      return { error: 'UNKNOWN' };
    }
  };

  // ── Google / OAuth login ──
  const loginWithGoogle = (googleUser) => {
    // Check if user exists in our system
    const users = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
    const existingUser = users.find(u => u.email === googleUser.email);

    let u;
    if (existingUser) {
      // User exists, use their data
      u = {
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone || '',
        picture: existingUser.picture || googleUser.picture || null
      };
    } else {
      // New Google user - they need to provide phone number
      // We'll store with empty phone and they can update later
      u = {
        name: googleUser.name,
        email: googleUser.email,
        phone: '',
        picture: googleUser.picture || null
      };

      // Save to users list with empty phone
      const newUser = {
        name: googleUser.name,
        email: googleUser.email,
        password: '', // No password for OAuth users
        phone: '',
        picture: googleUser.picture || null
      };
      localStorage.setItem('glowhive_users', JSON.stringify([...users, newUser]));
    }

    localStorage.setItem('glowhive_user', JSON.stringify(u));
    restoreData(u.email);
    setUser(u);
  };

  // ── Logout ──
  const logout = () => {
    if (user?.email) {
      backupData(user.email);
      clearGenericData();
    }
    localStorage.removeItem('glowhive_user');
    setUser(null);
  };

  // ── Delete Account ──
  const deleteAccount = async () => {
    try {
      if (!user?.email) {
        throw new Error('No user is currently logged in.');
      }

      const email = user.email;

      // Delete all user data
      deleteAllUserData(email);

      // Update state
      setUser(null);

      return { success: true };
    } catch (error) {
      console.error('Delete account error:', error);
      throw new Error(error.message || 'Failed to delete account. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      hydrated,
      login,
      register,
      loginWithGoogle,
      logout,
      deleteAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default value instead of throwing error
    return {
      user: null,
      isAuthenticated: false,
      hydrated: true,
      login: async () => ({ error: 'Auth not initialized' }),
      register: async () => ({ error: 'Auth not initialized' }),
      loginWithGoogle: () => {},
      logout: () => {},
      deleteAccount: async () => {},
    };
  }
  return context;
}

export default AuthProvider;