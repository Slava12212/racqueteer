/** Arrow icon for CTA buttons: rotates from diagonal ↗ to horizontal → on hover.
 *  Parent must have class `btn-cta` for the rotation to work (via global CSS). */
export default function ButtonArrow({ color = "white" }: { color?: string }) {
  return (
    <svg className="btn-arrow shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 17L17 7M17 7L16.9993 16.0526M17 7L7 7" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}
