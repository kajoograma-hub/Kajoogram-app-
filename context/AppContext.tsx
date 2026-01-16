
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  appLogo: string | null;
  setAppLogo: (logo: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appLogo, setAppLogo] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ appLogo, setAppLogo }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
