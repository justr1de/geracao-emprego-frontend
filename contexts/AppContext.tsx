'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { AuthProvider } from './AuthContext';

interface AppContextType {
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
  isLogged: boolean
  setIsLogged: (value: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  return (
    <AppContext.Provider value={{ isAdmin, setIsAdmin, isLogged, setIsLogged }}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
