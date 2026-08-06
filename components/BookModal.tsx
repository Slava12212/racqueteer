"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCta } from "@/lib/navbar-cta";
import { BOOKING_URL_PADEL, BOOKING_URL_PICKLEBALL } from "@/lib/booking-urls";
import { getButtonTitle } from "@/lib/utils";

/**
 * "Book a Court" modal - appears when user clicks any Book CTA.
 * Full-screen on mobile, centered on desktop.
 * Content (texts, images, booking URLs) is controlled via WordPress
 * Site Options → Book Modal page (acfOptionsBookModal).
 * Falls back to hardcoded values when WordPress options are not set.
 */
export default function BookModal() {
  const { isBookModalOpen, closeBookModal, bookModalOptions } = useCta();

  // Texts — use WP values with hardcoded fallbacks
  const modalTitle       = bookModalOptions?.modalTitle      || "Book a court";
  const modalSubtitle    = bookModalOptions?.modalSubtitle   || "Select your sport to get started";
  const sport1Title      = bookModalOptions?.sport1Title     || "Padel";
  const sport1ButtonTitle = bookModalOptions
    ? getButtonTitle(bookModalOptions.sport1ButtonText)
    : "Book a Court";
  const sport1Url        = bookModalOptions?.sport1BookingUrl || BOOKING_URL_PADEL;
  const sport1Image      = bookModalOptions?.sport1Image?.sourceUrl || "/book-modal-padel-v2.webp";
  const sport2Title      = bookModalOptions?.sport2Title     || "Pickleball";
  const sport2ButtonTitle = bookModalOptions
    ? getButtonTitle(bookModalOptions.sport2ButtonText)
    : "Book a Court";
  const sport2Url        = bookModalOptions?.sport2BookingUrl || BOOKING_URL_PICKLEBALL;
  const sport2Image      = bookModalOptions?.sport2Image?.sourceUrl || "/book-modal-pickleball-v2.webp";

  const handleOpenBooking = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    closeBookModal();
  };

  return (
    <Dialog open={isBookModalOpen} onOpenChange={(open) => !open && closeBookModal()}>
      <DialogContent
        hideClose
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="inset-0 translate-x-0 translate-y-0 w-full h-full sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:w-auto sm:h-auto sm:max-w-[777px] p-0 bg-white border-none sm:rounded-none flex flex-col"
      >
        {/* Close button - white circle with shadow */}
        <button
          type="button"
          onClick={() => closeBookModal()}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-[#2B2B2B] bg-white rounded-full shadow-md hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20L20 0M20 20L0 0" stroke="#2B2B2B" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Screen-reader only titles */}
        <DialogTitle className="sr-only">{modalTitle}</DialogTitle>
        <DialogDescription className="sr-only">{modalSubtitle}</DialogDescription>

        {/* Content wrapper - fills screen, compact on mobile */}
        <div className="flex flex-col justify-center flex-1 overflow-y-auto px-4 sm:px-0 py-6 sm:py-0">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-0 sm:pt-14 sm:pb-6 sm:px-6">
            <h1 className="text-[#2B2B2B] font-extrabold text-2xl sm:text-[44px] leading-tight uppercase tracking-wide">
              {modalTitle}
            </h1>
            <p className="mt-1 sm:mt-3 text-[#6B7280] text-sm sm:text-base font-normal">
              {modalSubtitle}
            </p>
          </div>

          {/* Cards */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 px-0 sm:px-10 pb-0 sm:pb-10 items-stretch">
            {/* Sport 1 Card (Padel) */}
            <div className="flex-1 bg-[#F3F3F3] flex flex-col items-center overflow-hidden rounded-lg">
              <div className="flex items-center justify-center pt-2 sm:pt-5 pb-1 sm:pb-0 w-full">
                <img
                  src={sport1Image}
                  alt={sport1Title}
                  className="w-full max-w-[120px] sm:max-w-[287px] h-auto object-contain"
                />
              </div>
              <div className="text-center w-full px-4 sm:px-6 pb-3 sm:pb-6">
                <h2 className="text-[#D2352B] font-extrabold text-lg sm:text-[36px] uppercase text-center mb-1 sm:mb-6">
                  {sport1Title}
                </h2>
                {sport1ButtonTitle && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(sport1Url)}
                      aria-label={`${sport1ButtonTitle} ${sport1Title} (opens in new tab)`}
                      className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-2 sm:py-4 border border-[#D2352B] rounded-sm text-[#D2352B] font-bold text-xs sm:text-sm uppercase tracking-wide hover:bg-[#D2352B]/5 transition-colors w-full max-w-[200px] sm:max-w-[260px] justify-center cursor-pointer"
                    >
                      {sport1ButtonTitle}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
                        <path d="M7 17L17 7M7 7L17 7L16.9993 16.0526" stroke="#D2352B" strokeWidth="2" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sport 2 Card (Pickleball) */}
            <div className="flex-1 bg-[#F3F3F3] flex flex-col items-center overflow-hidden rounded-lg">
              <div className="flex items-center justify-center pt-2 sm:pt-5 pb-1 sm:pb-0 w-full">
                <img
                  src={sport2Image}
                  alt={sport2Title}
                  className="w-full max-w-[120px] sm:max-w-[287px] h-auto object-contain"
                />
              </div>
              <div className="text-center w-full px-4 sm:px-6 pb-3 sm:pb-6">
                <h2 className="text-[#003E6B] font-extrabold text-lg sm:text-[36px] uppercase text-center mb-1 sm:mb-6">
                  {sport2Title}
                </h2>
                {sport2ButtonTitle && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(sport2Url)}
                      aria-label={`${sport2ButtonTitle} ${sport2Title} (opens in new tab)`}
                      className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-2 sm:py-4 border border-[#003E6B] rounded-sm text-[#003E6B] font-bold text-xs sm:text-sm uppercase tracking-wide hover:bg-[#003E6B]/5 transition-colors w-full max-w-[200px] sm:max-w-[260px] justify-center cursor-pointer"
                    >
                      {sport2ButtonTitle}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
                        <path d="M7 17L17 7M7 7L17 7L16.9993 16.0526" stroke="#003E6B" strokeWidth="2" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}