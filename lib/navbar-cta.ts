"use client";

import React, { createContext, useContext, useState } from "react";

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

  const openBookModal = () => setIsBookModalOpen(true);
  const closeBookModal = () => setIsBookModalOpen(false);

  return React.createElement(
    CtaContext.Provider,
    { value: { ctaText, ctaUrl, isBookModalOpen, openBookModal, closeBookModal } },
    children
  );
}

export function useCta(): CtaData {
  return useContext(CtaContext);
}
