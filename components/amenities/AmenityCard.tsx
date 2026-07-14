

import type { Amenity } from "./amenitiesData";

interface AmenityCardProps {
  amenity: Amenity;
  total: number;
}

const GradientDivider = () => (
  <div
    className="w-px self-stretch flex-shrink-0"
    style={{
      background:
        "linear-gradient(to bottom, transparent 0%, #CBD5E4 50%, transparent 100%)",
      opacity: 0.7,
    }}
  />
);

export function AmenityCard({ amenity, total }: AmenityCardProps) {
  return (
    <div className="relative flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[48vw] lg:w-[400px] xl:w-[500px] 2xl:w-[580px] flex flex-col rounded-lg overflow-hidden bg-white shadow-sm h-full">
      {/* Bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none z-10 rounded-b-lg"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(200, 215, 235, 0.35) 60%, rgba(180, 200, 225, 0.5) 100%)',
        }}
      />
      {/* Image area */}
      <div className="h-[220px] sm:h-[280px] xl:h-[350px] flex gap-1 flex-shrink-0">
        {amenity.imageLayout === "split" ? (
          <>
            <img
              src={amenity.images[0]}
              alt=""
              className="w-[61%] h-full object-cover"
            />
            <img
              src={amenity.images[1]}
              alt=""
              className="flex-1 h-full object-cover"
            />
          </>
        ) : (
          <img
            src={amenity.images[0]}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content area */}
      <div className="flex flex-col gap-6 xl:gap-8 p-6 xl:p-8 flex-1">
        {/* Title row */}
        <div className="flex justify-between items-center gap-4">
          <h3 className="text-black font-bold text-lg xl:text-2xl leading-tight">
            {amenity.title}
          </h3>
          <div className="text-right text-xs whitespace-nowrap flex-shrink-0">
            <span className="font-bold text-black">{amenity.number}</span>
            <span className="font-normal text-black"> / {String(total).padStart(2, "0")}</span>
          </div>
        </div>

        {/* Features row */}
        <div className="flex items-stretch gap-4 xl:gap-7 flex-1">
          {/* Feature 1 */}
          <div className="flex-1 flex flex-col gap-3 xl:gap-4 py-2 xl:py-4">
            <div className="flex-shrink-0 h-12 flex items-center">{amenity.features[0].icon}</div>
            <p className="text-gray-500 text-sm xl:text-base leading-relaxed">
              {amenity.features[0].text}
            </p>
          </div>

          {/* Gradient divider */}
          <GradientDivider />

          {/* Feature 2 */}
          <div className="flex-1 flex flex-col gap-3 xl:gap-4 py-2 xl:py-4">
            <div className="flex-shrink-0 h-12 flex items-center">{amenity.features[1].icon}</div>
            <p className="text-gray-500 text-sm xl:text-base leading-relaxed">
              {amenity.features[1].text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
