'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('glowhive_user');
    if (saved) setUser(JSON.parse(saved));
    setHydrated(true);
  }, []);

  const persist = (userObj) => {
    setUser(userObj);
    if (userObj) {
      localStorage.setItem('glowhive_user', JSON.stringify(userObj));
    } else {
      localStorage.removeItem('glowhive_user');
    }
  };

  // Demo/mock auth — this project has no backend, so credentials aren't
  // actually verified. Swap this out for a real API call when one exists.
  const login = async ({ email }) => {
    const name = email.split('@')[0].replace(/[._]/g, ' ');
    persist({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      provider: 'email',
    });
  };

  const register = async ({ name, email }) => {
    persist({ name, email, provider: 'email' });
  };

  const loginWithGoogle = (googleProfile) => {
    persist({
      name: googleProfile.name,
      email: googleProfile.email,
      picture: googleProfile.picture,
      provider: 'google',
    });
  };

  const updateProfile = (updates) => persist({ ...user, ...updates });

  const logout = () => persist(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hydrated,
        login,
        register,
        loginWithGoogle,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
