"use client";

import React, { createContext, useContext } from "react";

export interface CtaData {
  ctaText: string;
  ctaUrl: string;
}

export const CtaContext = createContext<CtaData>({
  ctaText: "Book a Court",
  ctaUrl: "#",
});

export function CtaProvider({
  children,
  ctaText,
  ctaUrl,
}: {
  children: React.ReactNode;
  ctaText: string;
  ctaUrl: string;
}) {
  return React.createElement(
    CtaContext.Provider,
    { value: { ctaText, ctaUrl } },
    children
  );
}

export function useCta(): CtaData {
  return useContext(CtaContext);
}

