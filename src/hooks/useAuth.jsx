import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createUser, loginWithServiceKey, getUserById } from '../services/authService';
const AuthContext = createContext(null);
const STORAGE_KEY = 'unheard_service_key';
const USER_KEY = 'unheard_user_id';
export function AuthProvider({
  children
}) {
  const [user, setUser] = useState(null);
  const [serviceKey, setServiceKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showKeySaved, setShowKeySaved] = useState(false);
  useEffect(() => {
    async function restore() {
      try {
        const storedKey = localStorage.getItem(STORAGE_KEY);
        const storedUserId = localStorage.getItem(USER_KEY);
        if (storedUserId) {
          const u = await getUserById(storedUserId);
          setUser(u);
          if (storedKey) setServiceKey(storedKey);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, []);
  const signup = useCallback(async username => {
    const {
      user: newUser,
      serviceKey: key
    } = await createUser(username);
    setUser(newUser);
    setServiceKey(key);
    localStorage.setItem(STORAGE_KEY, key);
    localStorage.setItem(USER_KEY, newUser.id);
    setShowKeySaved(false);
    return {
      user: newUser,
      serviceKey: key
    };
  }, []);
  const login = useCallback(async key => {
    const u = await loginWithServiceKey(key);
    setUser(u);
    setServiceKey(key);
    localStorage.setItem(STORAGE_KEY, key);
    localStorage.setItem(USER_KEY, u.id);
    return u;
  }, []);
  const logout = useCallback(() => {
    setUser(null);
    setServiceKey(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);
  const markKeySaved = useCallback(() => {
    setShowKeySaved(true);
  }, []);
  const value = {
    user,
    serviceKey,
    loading,
    showKeySaved,
    signup,
    login,
    logout,
    markKeySaved
  };
  return React.createElement(AuthContext.Provider, {
    value: value
  }, children);
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
