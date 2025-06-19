"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type StorageType = "local" | "session";

interface StorageContextValue {
  storageType: StorageType;
  setStorageType: (type: StorageType) => void;
  setValue: (key: string, value: any) => void;
  getValue: (key: string) => any;
}

const StorageContext = createContext<StorageContextValue | undefined>(
  undefined,
);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [storageType, setStorageType] = useState<StorageType>("local");

  const setValue = (key: string, value: any) => {
    if (typeof window === "undefined") return; // Skip on server
    const storage = storageType === "local" ? localStorage : sessionStorage;
    storage.setItem(key, JSON.stringify(value));
  };

  const getValue = (key: string) => {
    if (typeof window === "undefined") return null; // Skip on server
    const storage = storageType === "local" ? localStorage : sessionStorage;
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  };

  return (
    <StorageContext.Provider
      value={{ storageType, setStorageType, setValue, getValue }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (!context)
    throw new Error("useStorage must be used within a StorageProvider");
  return context;
}
