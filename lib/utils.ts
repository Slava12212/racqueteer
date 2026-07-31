import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getButtonTitle(title: string | null | undefined): string | null {
  if (typeof title !== "string") return null;

  const trimmed = title.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function isImageMediaUrl(url: string): boolean {
  return /^data:image\//i.test(url) || /\.(avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(url);
}
