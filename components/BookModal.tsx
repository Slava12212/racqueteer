"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCta } from "@/lib/navbar-cta";
import { BOOKING_URL_PADEL, BOOKING_URL_PICKLEBALL } from "@/lib/booking-urls";

/**
 * "Book a Court" modal - appears when user clicks any Book CTA.
 * Shows two options for Padel and Pickleball with buttons to open external booking systems.
 */
export default function BookModal() {
  const { isBookModalOpen, closeBookModal } = useCta();

  const handleOpenBooking = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    closeBookModal();
  };

  return (
    <Dialog open={isBookModalOpen} onOpenChange={(open) => !open && closeBookModal()}>
      <DialogContent className="max-w-[777px] p-0 overflow-hidden bg-white border-none rounded-none">
        {/* Close button - custom SVG X icon */}
        <button
          type="button"
          onClick={() => closeBookModal()}
          className="absolute top-5 right-5 z-10 text-[#2B2B2B] hover:opacity-60 transition-opacity"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20L20 0M20 20L0 0" stroke="#2B2B2B" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Title */}
        <DialogTitle className="sr-only">
          Book a Court
        </DialogTitle>
        <DialogDescription className="sr-only">
          Select Padel or Pickleball to book a court
        </DialogDescription>

        {/* Header */}
        <div className="pt-14 pb-8 px-6 text-center">
          <h1 className="text-[#2B2B2B] font-extrabold text-3xl sm:text-[44px] leading-tight uppercase tracking-wide">
            Book a court
          </h1>
          <p className="mt-3 text-[#6B7280] text-base font-normal">
            Select your sport to get started
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row gap-8 px-10 pb-10 items-stretch">
          {/* Padel Card */}
          <div className="flex-1 bg-[#F3F3F3] flex flex-col items-center overflow-hidden min-h-[360px] sm:min-h-[466px]">
            <div className="flex-1 flex items-center justify-center p-5 w-full">
              <Image
                src="/book-modal-padel-v2.webp"
                alt="Padel court"
                width={287}
                height={270}
                className="w-full max-w-[287px] h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 287px"
              />
            </div>
            <div className="pb-6 text-center w-full px-6">
              <h2 className="text-[#D2352B] font-extrabold text-[36px] uppercase text-center mb-6">
                Padel
              </h2>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handleOpenBooking(BOOKING_URL_PADEL)}
                  aria-label="Book Padel court (opens in new tab)"
                  className="flex items-center gap-3 px-8 py-4 border border-[#D2352B] rounded-sm text-[#D2352B] font-bold text-sm uppercase tracking-wide hover:bg-[#D2352B]/5 transition-colors w-full max-w-[260px] justify-center cursor-pointer"
                >
                  Book a Court
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M7 7L17 7L16.9993 16.0526" stroke="#D2352B" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Pickleball Card */}
          <div className="flex-1 bg-[#F3F3F3] flex flex-col items-center overflow-hidden min-h-[360px] sm:min-h-[466px]">
            <div className="flex-1 flex items-center justify-center p-5 w-full">
              <Image
                src="/book-modal-pickleball-v2.webp"
                alt="Pickleball court"
                width={287}
                height={270}
                className="w-full max-w-[287px] h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 287px"
              />
            </div>
            <div className="pb-6 text-center w-full px-6">
              <h2 className="text-[#003E6B] font-extrabold text-[36px] uppercase text-center mb-6">
                Pickleball
              </h2>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handleOpenBooking(BOOKING_URL_PICKLEBALL)}
                  aria-label="Book Pickleball court (opens in new tab)"
                  className="flex items-center gap-3 px-8 py-4 border border-[#003E6B] rounded-sm text-[#003E6B] font-bold text-sm uppercase tracking-wide hover:bg-[#003E6B]/5 transition-colors w-full max-w-[260px] justify-center cursor-pointer"
                >
                  Book a Court
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M7 7L17 7L16.9993 16.0526" stroke="#003E6B" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}