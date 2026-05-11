"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import BookModal from "@/components/BookModal";

export interface CtaData {
  ctaText: string;
  ctaUrl: string;
  isBookModalOpen: boolean;
  openBookModal: () => void;
  closeBookModal: () => void;
}

export const CtaContext = createContext<CtaData>({
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

  return (
    <CtaContext.Provider value={{ ctaText, ctaUrl, isBookModalOpen, openBookModal, closeBookModal }}>
      {children}
      <BookModal />
    </CtaContext.Provider>
  );
}

export function useCta(): CtaData {
  return useContext(CtaContext);
}