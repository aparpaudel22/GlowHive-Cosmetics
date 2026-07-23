'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// ── All keys that belong to a signed-in user ──
const DATA_KEYS = ['orders', 'profile', 'avatar', 'addresses', 'cart', 'wishlist', 'cart_selected'];

const generic = (key) => `glowhive_${key}`;
const scoped = (email, key) => `glowhive_${encodeURIComponent(email)}_${key}`;

/** Copy current generic keys → user-scoped storage (BACKUP) */
function backupData(email) {
  console.log('Backing up data for:', email);
  DATA_KEYS.forEach(k => {
    try {
      const val = localStorage.getItem(generic(k));
      if (val !== null && val !== '[]' && val !== '{}') {
        if (k === 'avatar' && val.length > 500000) {
          console.warn('Avatar too large for backup, skipping');
          return;
        }
        localStorage.setItem(scoped(email, k), val);
        console.log(`Backed up ${k}:`, val.substring(0, 100));
      } else {
        localStorage.setItem(scoped(email, k), JSON.stringify([]));
        console.log(`Backed up ${k}: empty array`);
      }
    } catch (e) {
      console.warn(`Failed to backup ${k}:`, e);
    }
  });
}

/** Copy user-scoped storage → generic keys (RESTORE) - FIXED to merge addresses */
function restoreData(email) {
  console.log('Restoring data for:', email);
  DATA_KEYS.forEach(k => {
    try {
      const val = localStorage.getItem(scoped(email, k));
      if (val !== null && val !== '[]' && val !== '{}') {
        if (k === 'avatar' && val.length > 500000) {
          console.warn('Avatar too large, skipping restore');
          return;
        }
        
        // ─── SPECIAL HANDLING FOR ADDRESSES ───
        // Merge addresses instead of overwriting
        if (k === 'addresses') {
          try {
            const existing = localStorage.getItem(generic(k));
            let existingArr = [];
            if (existing) {
              existingArr = JSON.parse(existing);
              if (!Array.isArray(existingArr)) existingArr = [];
            }
            
            const scopedArr = JSON.parse(val);
            if (Array.isArray(scopedArr) && scopedArr.length > 0) {
              // Merge: add scoped addresses that don't exist in generic
              const merged = [...scopedArr];
              existingArr.forEach(addr => {
                const exists = merged.some(a => 
                  a.address === addr.address && 
                  a.city === addr.city && 
                  a.province === addr.province
                );
                if (!exists) {
                  merged.push(addr);
                }
              });
              localStorage.setItem(generic(k), JSON.stringify(merged));
              console.log(`Merged addresses:`, merged);
              return;
            }
          } catch (e) {
            console.warn('Failed to merge addresses:', e);
          }
        }
        
        // For all other keys, restore normally
        localStorage.setItem(generic(k), val);
        console.log(`Restored ${k}:`, val.substring(0, 100));
      } else {
        // Don't overwrite with empty if there's existing data
        const existing = localStorage.getItem(generic(k));
        if (!existing || existing === '[]' || existing === '{}') {
          localStorage.setItem(generic(k), JSON.stringify([]));
        }
        console.log(`Restored ${k}: kept existing or set empty`);
      }
    } catch (e) {
      console.warn(`Failed to restore ${k}:`, e);
    }
  });
}

/** Wipe all generic data keys (called on logout) */
function clearGenericData() {
  DATA_KEYS.forEach(k => {
    try {
      localStorage.removeItem(generic(k));
    } catch (e) {
      console.warn(`Failed to clear ${k}:`, e);
    }
  });
}

/** Delete all user data permanently */
function deleteAllUserData(email) {
  try {
    DATA_KEYS.forEach(k => {
      localStorage.removeItem(generic(k));
      localStorage.removeItem(scoped(email, k));
    });
    localStorage.removeItem('glowhive_user');
    const users = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
    const filteredUsers = users.filter(u => u.email !== email);
    localStorage.setItem('glowhive_users', JSON.stringify(filteredUsers));
  } catch (e) {
    console.error('Failed to delete user data:', e);
  }
}

// ─────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // ── Rehydrate session on page load ──
  useEffect(() => {
    console.log('AuthProvider: Rehydrating session...');
    try {
      const stored = localStorage.getItem('glowhive_user');
      console.log('Stored user:', stored);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Parsed user:', parsed);
        setUser(parsed);
        if (parsed?.email) {
          restoreData(parsed.email);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('userLoggedIn'));
          }
        }
      } else {
        console.log('No stored user found');
      }
    } catch (error) {
      console.error('Rehydration error:', error);
    }
    setHydrated(true);
  }, []);

  // ── Login ──
  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
      
      // FIXED: Added null/undefined checks before calling toLowerCase
      const found = users.find(u => {
        if (u && u.email && email) {
          return u.email.toLowerCase() === email.toLowerCase();
        }
        return false;
      });
      
      if (!found) {
        return { success: false, error: 'NO_ACCOUNT' };
      }
      
      if (found.password !== password) {
        return { success: false, error: 'WRONG_PASSWORD' };
      }

      const u = {
        name: found.name,
        email: found.email,
        phone: found.phone || '',
        picture: found.picture || null
      };
      
      localStorage.setItem('glowhive_user', JSON.stringify(u));
      restoreData(found.email);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('userLoggedIn'));
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'glowhive_user',
          newValue: JSON.stringify(u),
        }));
      }
      
      setUser(u);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'UNKNOWN' };
    }
  };

  // ── Register ──
  const register = async (name, email, password, phone, avatar = null) => {
    try {
      if (!phone || phone.replace(/\D/g, '').length < 10) {
        return { success: false, error: 'INVALID_PHONE' };
      }

      const users = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
      
      // FIXED: Added null/undefined check for email in register
      if (users.find(u => u && u.email && u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'ALREADY_EXISTS' };
      }

      const normalizedEmail = email.toLowerCase();
      
      let compressedAvatar = avatar;
      if (avatar && avatar.length > 200000) {
        compressedAvatar = await compressImage(avatar);
      }

      const newUser = {
        name,
        email: normalizedEmail,
        password,
        phone: phone.trim(),
        picture: compressedAvatar || null
      };

      localStorage.setItem('glowhive_users', JSON.stringify([...users, newUser]));

      const u = {
        name,
        email: normalizedEmail,
        phone: phone.trim(),
        picture: compressedAvatar || null
      };

      localStorage.setItem('glowhive_user', JSON.stringify(u));

      if (compressedAvatar && compressedAvatar.length < 400000) {
        try {
          localStorage.setItem(generic('avatar'), compressedAvatar);
          localStorage.setItem(scoped(normalizedEmail, 'avatar'), compressedAvatar);
        } catch (e) {
          console.warn('Failed to save avatar:', e);
        }
      }

      const profile = { 
        firstName: name.split(' ')[0] || '', 
        lastName: name.split(' ').slice(1).join(' ') || '',
        email: normalizedEmail,
        phone: phone.trim() 
      };
      
      try {
        localStorage.setItem(generic('profile'), JSON.stringify(profile));
        localStorage.setItem(scoped(normalizedEmail, 'profile'), JSON.stringify(profile));
      } catch (e) {
        console.warn('Failed to save profile:', e);
      }

      DATA_KEYS.forEach(key => {
        try {
          if (!localStorage.getItem(generic(key))) {
            localStorage.setItem(generic(key), JSON.stringify([]));
          }
          if (!localStorage.getItem(scoped(normalizedEmail, key))) {
            localStorage.setItem(scoped(normalizedEmail, key), JSON.stringify([]));
          }
        } catch (e) {
          console.warn(`Failed to initialize ${key}:`, e);
        }
      });

      backupData(normalizedEmail);
      setUser(u);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'UNKNOWN' };
    }
  };

  const compressImage = (base64String) => {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.src = base64String;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 150;
          let width = img.width;
          let height = img.height;
          if (width > MAX_SIZE || height > MAX_SIZE) {
            const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressed);
        };
        img.onerror = () => resolve(base64String);
      } catch (e) {
        resolve(base64String);
      }
    });
  };

  const loginWithGoogle = (googleUser) => {
    try {
      const users = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
      const normalizedEmail = googleUser.email.toLowerCase();
      
      // FIXED: Added null/undefined check for email in Google login
      const existingUser = users.find(u => u && u.email && u.email.toLowerCase() === normalizedEmail);

      let u;
      if (existingUser) {
        u = {
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone || '',
          picture: existingUser.picture || googleUser.picture || null
        };
      } else {
        u = {
          name: googleUser.name,
          email: normalizedEmail,
          phone: '',
          picture: googleUser.picture || null
        };
        const newUser = {
          name: googleUser.name,
          email: normalizedEmail,
          password: '',
          phone: '',
          picture: googleUser.picture || null
        };
        localStorage.setItem('glowhive_users', JSON.stringify([...users, newUser]));
        const profile = { 
          firstName: googleUser.name.split(' ')[0] || '', 
          lastName: googleUser.name.split(' ').slice(1).join(' ') || '',
          email: normalizedEmail,
          phone: '' 
        };
        localStorage.setItem(generic('profile'), JSON.stringify(profile));
        localStorage.setItem(scoped(normalizedEmail, 'profile'), JSON.stringify(profile));
        DATA_KEYS.forEach(key => {
          if (!localStorage.getItem(generic(key))) {
            localStorage.setItem(generic(key), JSON.stringify([]));
          }
          if (!localStorage.getItem(scoped(normalizedEmail, key))) {
            localStorage.setItem(scoped(normalizedEmail, key), JSON.stringify([]));
          }
        });
      }

      localStorage.setItem('glowhive_user', JSON.stringify(u));
      restoreData(u.email);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('userLoggedIn'));
      }
      setUser(u);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const logout = () => {
    try {
      if (user?.email) {
        backupData(user.email);
        clearGenericData();
      }
      localStorage.removeItem('glowhive_user');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('userLoggedOut'));
      }
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user?.email) {
        throw new Error('No user is currently logged in.');
      }
      const email = user.email;
      deleteAllUserData(email);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('userLoggedOut'));
      }
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
    return {
      user: null,
      isAuthenticated: false,
      hydrated: true,
      login: async () => ({ success: false, error: 'Auth not initialized' }),
      register: async () => ({ success: false, error: 'Auth not initialized' }),
      loginWithGoogle: () => {},
      logout: () => {},
      deleteAccount: async () => ({ success: false, error: 'Auth not initialized' }),
    };
  }
  return context;
}

export default AuthProvider;