import { createContext, useContext, useState, useEffect, useCallback } from 'react';
const CustomizationContext = createContext(null);
const STORAGE_KEY = 'unheard_customization';
const DEFAULTS = {
  primaryColor: '#ffffff',
  secondaryColor: '#a1a1aa',
  fontSize: 'normal',
  navStyle: 'full'
};
const FONT_SIZE_MAP = {
  small: '14px',
  normal: '16px',
  large: '18px'
};
function loadPrefs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return {
      ...DEFAULTS,
      ...JSON.parse(stored)
    };
  } catch {}
  return {
    ...DEFAULTS
  };
}
function applyCSS(prefs) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', prefs.primaryColor);
  root.style.setProperty('--color-secondary', prefs.secondaryColor);
  root.style.setProperty('--font-size-base', FONT_SIZE_MAP[prefs.fontSize] || '16px');
}
export function CustomizationProvider({
  children
}) {
  const [prefs, setPrefs] = useState(loadPrefs);
  useEffect(() => {
    applyCSS(prefs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);
  const updatePref = useCallback((key, value) => {
    setPrefs(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  const resetToDefaults = useCallback(() => {
    setPrefs({
      ...DEFAULTS
    });
  }, []);
  return React.createElement(CustomizationContext.Provider, {
    value: {
      prefs,
      updatePref,
      resetToDefaults,
      DEFAULTS
    }
  }, children);
}
export function useCustomization() {
  const ctx = useContext(CustomizationContext);
  if (!ctx) throw new Error('useCustomization must be used within CustomizationProvider');
  return ctx;
}
