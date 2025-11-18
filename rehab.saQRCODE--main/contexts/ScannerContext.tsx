import React, { createContext, useContext, useRef, ReactNode } from 'react';

interface ScannerContextType {
  startScanningRef: React.MutableRefObject<(() => void) | null>;
}

const ScannerContext = createContext<ScannerContextType | undefined>(undefined);

export const useScanner = () => {
  const context = useContext(ScannerContext);
  if (!context) {
    throw new Error('useScanner must be used within a ScannerProvider');
  }
  return context;
};

interface ScannerProviderProps {
  children: ReactNode;
}

export const ScannerProvider: React.FC<ScannerProviderProps> = ({ children }) => {
  const startScanningRef = useRef<(() => void) | null>(null);

  return (
    <ScannerContext.Provider value={{ startScanningRef }}>
      {children}
    </ScannerContext.Provider>
  );
};

