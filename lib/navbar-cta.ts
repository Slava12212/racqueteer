"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface CtaData {
  ctaText: string;
  ctaUrl: string;
}

interface CtaContextValue extends CtaData {
  isBookModalOpen: boolean;
  openBookModal: () => void;
  closeBookModal: () => void;
}

export const CtaContext = createContext<CtaContextValue>({
  ctaText: "Book a Court",
  ctaUrl: "#",
  isBookModalOpen: false,
  openBookModal: () => {},
  closeBookModal: () => {},
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
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const openBookModal = useCallback(() => {
    setIsBookModalOpen(true);
  }, []);

  const closeBookModal = useCallback(() => {
    setIsBookModalOpen(false);
  }, []);

  return React.createElement(
    CtaContext.Provider,
    { value: { ctaText, ctaUrl, isBookModalOpen, openBookModal, closeBookModal } },
    children
  );
}

export function useCta(): CtaContextValue {
  return useContext(CtaContext);
}

