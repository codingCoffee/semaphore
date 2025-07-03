"use client";

import { ReactNode } from "react";
import { CookiesProvider } from "react-cookie";

interface Props {
  children: ReactNode;
}

export default function CookiesProviderWrapper({ children }: Props) {
  return <CookiesProvider>{children}</CookiesProvider>;
}
