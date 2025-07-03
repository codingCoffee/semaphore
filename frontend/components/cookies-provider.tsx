"use client";
import { CookiesProvider } from "react-cookie";

export default function CookiesProviderWrapper({ children }) {
  return <CookiesProvider>{children}</CookiesProvider>;
}
