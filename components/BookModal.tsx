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
 * "Choose Your Sport" modal - appears when user clicks any Book CTA.
 * Shows two clickable panels for Padel and Pickleball that open external booking systems.
 */
export default function BookModal() {
  const { isBookModalOpen, closeBookModal } = useCta();

  const handleOpenBooking = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    closeBookModal();
  };

  return (
    <Dialog open={isBookModalOpen} onOpenChange={(open) => !open && closeBookModal()}>
      <DialogContent
        className="max-w-[900px] p-0 overflow-hidden bg-[#003E6B] border-none"
      >
        {/* Title */}
        <DialogTitle className="text-center text-white text-xl md:text-2xl font-bold uppercase tracking-wider pt-6 md:pt-8">
          Choose Your Sport
        </DialogTitle>
        <DialogDescription className="sr-only">
          Select Padel or Pickleball to book a court
        </DialogDescription>

        {/* Panels - side by side on desktop, stacked on mobile */}
        <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6 pb-8 md:pb-10">
          {/* Padel Panel */}
          <button
            type="button"
            onClick={() => handleOpenBooking(BOOKING_URL_PADEL)}
            aria-label="Book Padel court (opens in new tab)"
            className="relative group cursor-pointer overflow-hidden rounded-sm transition-all duration-300 hover:brightness-110"
          >
            <Image
              src="/book-modal-padel.webp"
              alt="Padel"
              width={1148}
              height={1080}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 420px"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-3 text-center">
              <span className="text-white text-lg font-bold uppercase tracking-wider">
                Padel
              </span>
            </div>
          </button>

          {/* Pickleball Panel */}
          <button
            type="button"
            onClick={() => handleOpenBooking(BOOKING_URL_PICKLEBALL)}
            aria-label="Book Pickleball court (opens in new tab)"
            className="relative group cursor-pointer overflow-hidden rounded-sm transition-all duration-300 hover:brightness-110"
          >
            <Image
              src="/book-modal-pickleball.webp"
              alt="Pickleball"
              width={1148}
              height={1080}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 420px"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-3 text-center">
              <span className="text-white text-lg font-bold uppercase tracking-wider">
                Pickleball
              </span>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}