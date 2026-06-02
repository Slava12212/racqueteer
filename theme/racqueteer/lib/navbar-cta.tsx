"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import BookModal from "@/components/BookModal";
import type { WPBookModalOptions } from "@/types";

export interface CtaData {
  ctaText: string;
  ctaUrl: string;
  isBookModalOpen: boolean;
  openBookModal: () => void;
  closeBookModal: () => void;
  /** Options from WordPress Site Options → Book Modal page */
  bookModalOptions: WPBookModalOptions | null;
}

export const CtaContext = createContext<CtaData>({
  ctaText: "Book a Court",
  ctaUrl: "#",
  isBookModalOpen: false,
  openBookModal: () => {},
  closeBookModal: () => {},
  bookModalOptions: null,
});

export function CtaProvider({
  children,
  ctaText,
  ctaUrl,
  bookModalOptions = null,
}: {
  children: React.ReactNode;
  ctaText: string;
  ctaUrl: string;
  bookModalOptions?: WPBookModalOptions | null;
}) {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const openBookModal = useCallback(() => {
    setIsBookModalOpen(true);
  }, []);

  const closeBookModal = useCallback(() => {
    setIsBookModalOpen(false);
  }, []);

  return (
    <CtaContext.Provider value={{ ctaText, ctaUrl, isBookModalOpen, openBookModal, closeBookModal, bookModalOptions }}>
      {children}
      <BookModal />
    </CtaContext.Provider>
  );
}

export function useCta(): CtaData {
  return useContext(CtaContext);
}