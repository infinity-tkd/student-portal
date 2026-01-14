
import React, { useState, useEffect, createContext, useContext } from 'react';
import { FullAppData } from '../types';
import { api } from '../services/api';
import { secureStorage } from '../services/secureStorage';

interface DataContextType {
  data: FullAppData | null;
  isLoading: boolean;
  login: (id: string, pass: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshData: () => Promise<void>; // Optional refetch
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

  useEffect(() => {
    const initAuth = async () => {
      // 1. Background Revalidation (Auto-Login) even if data exists
      const savedCreds = secureStorage.getItem('app_creds');
      if (savedCreds && savedCreds.id && savedCreds.pass) {
        console.log("Attempting background refresh...");
        try {
          // Silent Login
          const res = await api.login(savedCreds.id, savedCreds.pass);
          if (res.success && res.data) {
            console.log("Background refresh success");
            setData(res.data);
            secureStorage.setItem('app_data', res.data, true); // Update cache
            setIsLoading(false);
          }
        } catch (err) {
          console.error("Background refresh failed", err);
          setIsLoading(false); // Ensure we stop loading if refresh fails
        }
      } else {
        // No creds? If we have data, we are good. If no data, we stop loading to show login.
        if (isLoading) setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    setData(null);
    secureStorage.clearAll();
    // Explicitly remove credentials to stop auto-login
    secureStorage.removeItem('app_creds');
    secureStorage.removeItem('app_data');
  };

  const refreshData = async () => {
    // Optional: Re-fetch logic if needed later
  };

  return (
    <DataContext.Provider value={{ data, login, logout, isLoading, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};
