"use client";

import { createContext, useContext, ReactNode, useState } from "react";

export interface Shop {
    id: string;
    name: string;
    address: string;
    currency: string;
    owner: string;
    heroImageUrl?: string;
}

interface SettingsContextValue {
  settings: Shop | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  // Since we removed Firebase, we'll use a placeholder settings object.
  const [settings, setSettings] = useState<Shop | null>({
    id: 'shop_1',
    name: 'ShopFlow Cafe',
    address: '123 Demo Street, Suite 456, Faketown, USA',
    currency: 'USD',
    owner: 'user_1',
    heroImageUrl: "https://images.unsplash.com/photo-1494346480775-936a9f0d0877?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjYWZlJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzYzMjc5NjIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
  });
  const [loading, setLoading] = useState(false);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
