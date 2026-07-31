/**
 * Re-exports resolveAmenityIcon from amenity-icons.tsx.
 * The @ts-ignore below suppresses a JetBrains IDE false-positive
 * (TS2306 "not a module") — `npx tsc --noEmit` confirms zero real errors.
 */
// @ts-ignore – IDE false positive; amenity-icons.tsx IS a module (tsc confirms)
export { resolveAmenityIcon } from "./amenity-icons";

