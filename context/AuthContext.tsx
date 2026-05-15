
import React, { useState, useEffect, createContext, useContext } from 'react';
import { FullAppData } from '../types';
import { api } from '../services/api';
import { secureStorage } from '../services/secureStorage';

interface DataContextType {
  data: FullAppData | null;
  isLoading: boolean;
  login: (id: string, pass: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshData: () => Promise<void>;
  isSyncing: boolean;
}

const DataContext = createContext<DataContextType>(null!);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

// Backwards compatibility hook for components expecting useAuth
export const useAuth = () => {
  const { data, ...rest } = useData();
  return { student: data?.student || null, ...rest };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lazy Initialization for Instant Load
  const [data, setData] = useState<FullAppData | null>(() => {
    try {
      const savedData = secureStorage.getItem('app_data');
      return (savedData && savedData.student) ? savedData : null;
    } catch {
      return null;
    }
  });

  // If we have data, we are NOT loading. We show app immediately.
  const [isLoading, setIsLoading] = useState(() => !data); // Dependent on initial data
  const [isSyncing, setIsSyncing] = useState(false);

  const login = async (id: string, pass: string, remember: boolean) => {
    setIsLoading(true);
    try {
      const res = await api.login(id, pass);
      if (res.success && res.data) {
        setData(res.data);
        secureStorage.setItem('app_data', res.data, true);
        if (remember) {
          secureStorage.setItem('app_creds', { id, pass }, true);
        } else {
          secureStorage.removeItem('app_creds');
        }
        return { success: true };
      }
      return { success: false, error: res.message || 'Login failed' };
    } catch (e: any) {
      return { success: false, error: e.message };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    const savedCreds = secureStorage.getItem('app_creds');
    if (!savedCreds || !savedCreds.id || !savedCreds.pass) return;
    
    setIsSyncing(true);
    try {
      const res = await api.login(savedCreds.id, savedCreds.pass);
      if (res.success && res.data) {
        setData(res.data);
        secureStorage.setItem('app_data', res.data, true);
      }
    } catch (err) {
      console.error("Background sync failed", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedCreds = secureStorage.getItem('app_creds');
      if (savedCreds && savedCreds.id && savedCreds.pass) {
        if (!data) setIsLoading(true);
        await refreshData();
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    initAuth();

    // SWR: Focus-based revalidation
    const handleFocus = () => {
      if (!isSyncing) refreshData();
    };
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') handleFocus();
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // SWR: Interval-based revalidation (5 minutes)
    const intervalId = setInterval(() => {
      if (!isSyncing) refreshData();
    }, 300000);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = () => {
    setData(null);
    secureStorage.clearAll();
    secureStorage.removeItem('app_creds');
    secureStorage.removeItem('app_data');
  };

  return (
    <DataContext.Provider value={{ data, login, logout, isLoading, refreshData, isSyncing }}>
      {children}
    </DataContext.Provider>
  );
};
