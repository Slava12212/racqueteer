
const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 w-4 h-4 lg:w-6 lg:h-6"
  >
    <path
      d="M8.58431 8.23594L11.1823 3.00394C11.2579 2.85253 11.3742 2.72517 11.5182 2.63616C11.6622 2.54715 11.8281 2.5 11.9973 2.5C12.1666 2.5 12.3325 2.54715 12.4764 2.63616C12.6204 2.72517 12.7367 2.85253 12.8123 3.00394L15.4103 8.23594L21.2183 9.07994C21.3858 9.10317 21.5435 9.17303 21.6732 9.28155C21.8029 9.39007 21.8995 9.53288 21.952 9.69367C22.0044 9.85446 22.0106 10.0268 21.9698 10.1909C21.929 10.355 21.8429 10.5044 21.7213 10.6219L17.5193 14.6919L18.5113 20.4419C18.6383 21.1799 17.8583 21.7419 17.1913 21.3939L11.9973 18.6779L6.80231 21.3939C6.13631 21.7429 5.35631 21.1799 5.48331 20.4409L6.47531 14.6909L2.27331 10.6209C2.15229 10.5033 2.06671 10.3541 2.02627 10.1903C1.98584 10.0264 1.99218 9.85451 2.04458 9.69409C2.09697 9.53367 2.19332 9.39116 2.32268 9.28277C2.45203 9.17439 2.60919 9.10446 2.77631 9.08094L8.58431 8.23594Z"
      fill="#B40023"
      stroke="#B40023"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface Testimonial {
  id: number;
  category: string;
  rating: number;
  maxRating: number;
  quote: string;
  authorName: string;
  authorSubtitle: string;
  authorAvatar?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { category, rating, maxRating, quote, authorName, authorSubtitle, authorAvatar } =
    testimonial;

  return (
    <div className="flex flex-col gap-8 p-5 lg:p-10 rounded-lg bg-[#EDF3F8] flex-1 min-w-0">
      {/* Category Badge */}
      <div className="inline-flex self-start">
        <span className="px-2 py-2 rounded-[5px] bg-[rgba(159,203,238,0.30)] text-[#003E6B] text-xs font-bold uppercase tracking-wider leading-none">
          {category}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>
        <div className="text-sm font-normal leading-normal">
          <span className="font-bold text-[#14232E]">{rating.toFixed(1)}</span>
          <span className="font-semibold text-[#14232E]"> </span>
          <span className="font-semibold text-[rgba(20,35,46,0.20)]">
            / {maxRating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Quote */}
      <p
        className="text-[#14232E] flex-1 text-sm lg:text-[20px]"
        style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 500, fontStretch: '125%', lineHeight: '150%', letterSpacing: '0' }}
      >
        {quote}
      </p>

      {/* Author */}
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#D9D9D9] ring-[1.3px] ring-[#265090]">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <circle cx="32" cy="32" r="32" fill="#C5D8E8" />
                <circle cx="32" cy="26" r="11" fill="#265090" />
                <ellipse cx="32" cy="56" rx="20" ry="14" fill="#265090" />
              </svg>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[#003E6B] text-base lg:text-2xl font-semibold leading-tight">
            {authorName}
          </span>
          <span className="text-[rgba(0,62,107,0.5)] text-sm font-semibold leading-normal">
            {authorSubtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
