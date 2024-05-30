// src/context/VendorContext.tsx
'use client'; // Añadir esta línea

import { createContext, useContext, useState, ReactNode } from 'react';
import { VendorTypes } from '@/types';

interface VendorContextType {
  selectedVendor: VendorTypes | null;
  setSelectedVendor: (vendor: VendorTypes | null) => void;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const VendorProvider = ({ children }: { children: ReactNode }) => {
  const [selectedVendor, setSelectedVendor] = useState<VendorTypes | null>(null);

  return (
    <VendorContext.Provider value={{ selectedVendor, setSelectedVendor }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = (): VendorContextType => {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
};
