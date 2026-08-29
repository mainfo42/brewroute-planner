import React from 'react';

export type HopIconVariant = 'route' | 'sunburst' | 'clean';

interface HopIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  filled?: boolean;
  /** Logo variant: 'route' (incorporates winding road & waypoints), 'sunburst' (shining rays), or 'clean' */
  variant?: HopIconVariant;
  /** Show the artisanal radiating shining sunburst lines (for sunburst or route) */
  showRays?: boolean;
}

/**
 * Artisanal Craft Beer Hop Logo with Route Integration
 * Variants:
 * - 'route': Integrates a winding scenic road ribbon, dashed trail line & waypoint pins circling the hop cone
 * - 'sunburst': Radiating artisanal shine lines around the hop mascot
 * - 'clean': Pure standalone hop cone badge
 */
export const HopIcon: React.FC<HopIconProps> = ({
  className = 'w-7 h-7',
  size,
  variant = 'route',
  showRays = true,
  ...props
}) => {
  // Generate 20 radial sunburst shine rays around center (50, 52)
  const rayAngles = [
    0, 18, 36, 54, 72, 90, 108, 126, 144, 162,
    180, 198, 216, 234, 252, 270, 288, 306, 324, 342
  ];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      width={size}
      height={size}
      fill="none"
      {...props}
    >
      <defs>
        {/* Vibrant craft hop lime gradient */}
        <linearGradient id="hop-art-green" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#77EE32" />
          <stop offset="60%" stopColor="#58D120" />
          <stop offset="100%" stopColor="#41B210" />
        </linearGradient>

        {/* Highlight for front center bract */}
        <linearGradient id="hop-art-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8EFF45" />
          <stop offset="100%" stopColor="#63DA26" />
        </linearGradient>

        {/* Stem Gradient */}
        <linearGradient id="hop-art-stem" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#92FA4B" />
          <stop offset="100%" stopColor="#52C41A" />
        </linearGradient>

        {/* Road Ribbon Gradient */}
        <linearGradient id="hop-route-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B1B0E" />
          <stop offset="50%" stopColor="#132B18" />
          <stop offset="100%" stopColor="#0B1B0E" />
        </linearGradient>

        {/* Road Glowing Border Gradient */}
        <linearGradient id="hop-route-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#74EA2E" />
          <stop offset="50%" stopColor="#FFD037" />
          <stop offset="100%" stopColor="#74EA2E" />
        </linearGradient>
      </defs>

      {/* VARIANT 1: SUNBURST SHINE RAYS */}
      {variant === 'sunburst' && showRays && (
        <g id="hop-sunburst-rays" opacity="0.85">
          {rayAngles.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const isLong = i % 2 === 0;
            const innerR = 40.5;
            const outerR = isLong ? 48.5 : 45.0;
            const cx = 50;
            const cy = 52;

            const x1 = cx + innerR * Math.cos(rad);
            const y1 = cy + innerR * Math.sin(rad);
            const x2 = cx + outerR * Math.cos(rad);
            const y2 = cy + outerR * Math.sin(rad);

            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#6EE827"
                strokeWidth={isLong ? 1.6 : 1.1}
                strokeLinecap="round"
                opacity={isLong ? 0.95 : 0.65}
              />
            );
          })}
        </g>
      )}

      {/* VARIANT 2: SCENIC ROUTE / ROAD TRAIL WRAP (Behind Layer) */}
      {variant === 'route' && (
        <g id="hop-route-background-layer">
          {/* Back Road Ribbon Arc */}
          <path
            d="M 12 70 C 4 48 16 18 48 10 C 78 4 96 28 92 56 C 88 80 62 96 28 92"
            fill="none"
            stroke="url(#hop-route-ribbon)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Glowing Outer Edge */}
          <path
            d="M 12 70 C 4 48 16 18 48 10 C 78 4 96 28 92 56 C 88 80 62 96 28 92"
            fill="none"
            stroke="url(#hop-route-glow)"
            strokeWidth="10.5"
            strokeLinecap="round"
            opacity="0.3"
          />
          {/* Road White/Amber Dash Track (The Hop Route Trail) */}
          <path
            d="M 12 70 C 4 48 16 18 48 10 C 78 4 96 28 92 56 C 88 80 62 96 28 92"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeDasharray="3 3.5"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>
      )}

      {/* OUTER WHITE CONTOUR BOUNDARY */}
      <g id="hop-white-contour">
        <path
          d="
            M 48 10
            L 48 16
            C 44 17 38 18 31 22
            C 26 25 24 29 27 30
            C 31 31 35 34 32 39
            C 27 47 24 53 27 55
            C 30 57 33 60 31 66
            C 28 72 31 77 34 78
            C 37 80 40 82 40 86
            L 50 94
            L 60 86
            C 60 82 63 80 66 78
            C 69 77 72 72 69 66
            C 67 60 70 57 73 55
            C 76 53 73 47 68 39
            C 65 34 69 31 73 30
            C 76 29 74 25 69 22
            C 62 18 56 17 52 16
            L 52 10
            Z
          "
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.92"
        />
      </g>

      {/* SOLID MAIN CRAFT HOP CONE */}
      <g id="hop-craft-badge">
        
        {/* STEM AT TOP (Angled cut rectangular stem) */}
        <path
          d="M 48 11.5 L 48 18 L 52 18 L 52 9 L 48 11.5 Z"
          fill="url(#hop-art-stem)"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* UPPER OUTER WINGED BRACTS */}
        {/* Left Wing Bract */}
        <path
          d="M 47 18 C 39 19.5 32 23 27 27 C 24.5 29 25 31 28.5 30.5 C 33 29.5 37 31 39 37 C 41 42 45 42 46 39 C 45 31 46 23 47 18 Z"
          fill="url(#hop-art-green)"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Right Wing Bract */}
        <path
          d="M 53 18 C 61 19.5 68 23 73 27 C 75.5 29 75 31 71.5 30.5 C 67 29.5 63 31 61 37 C 59 42 55 42 54 39 C 55 31 54 23 53 18 Z"
          fill="url(#hop-art-green)"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* MID-UPPER OUTER FLANKING BRACTS */}
        {/* Mid-Left Upper Flank */}
        <path
          d="M 33 34 C 26 40 22 47 25 53 C 27 57 32 55 35 50 C 37 46 38 41 33 34 Z"
          fill="url(#hop-art-green)"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Mid-Right Upper Flank */}
        <path
          d="M 67 34 C 74 40 78 47 75 53 C 73 57 68 55 65 50 C 63 46 62 41 67 34 Z"
          fill="url(#hop-art-green)"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* TOP CENTER MAIN HEART/SPADE BRACT (With characteristic cleft notch at top) */}
        <path
          d="
            M 50 18.5
            C 43 23 37 32 40 43
            C 42 49 47 52.5 50 54
            C 53 52.5 58 49 60 43
            C 63 32 57 23 50 18.5
            Z
          "
          fill="url(#hop-art-highlight)"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Notch / Cleft Split in Center Top Bract */}
        <path
          d="M 50 20 L 53.5 24.5 L 51 28"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* MID-LOWER FLANKING BRACTS */}
        {/* Mid-Left Lower Bract */}
        <path
          d="M 35 52 C 28 58 26 67 30 73 C 33 76 38 73 40 68 C 42 62 40 56 35 52 Z"
          fill="url(#hop-art-green)"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Mid-Right Lower Bract */}
        <path
          d="M 65 52 C 72 58 74 67 70 73 C 67 76 62 73 60 68 C 58 62 60 56 65 52 Z"
          fill="url(#hop-art-green)"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* CENTER MIDDLE NESTED BRACT */}
        <path
          d="
            M 50 49
            C 43.5 55 40 63 43 71
            C 45 75 48.5 77 50 78
            C 51.5 77 55 75 57 71
            C 60 63 56.5 55 50 49
            Z
          "
          fill="url(#hop-art-green)"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* LOWER TIER FLANKING BRACTS */}
        {/* Lower Left Scale */}
        <path
          d="M 38 71 C 33 76 33 82 37 86 C 41 87 44 84 45 79 C 45 74 41 72 38 71 Z"
          fill="url(#hop-art-green)"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Lower Right Scale */}
        <path
          d="M 62 71 C 67 76 67 82 63 86 C 59 87 56 84 55 79 C 55 74 59 72 62 71 Z"
          fill="url(#hop-art-green)"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* BOTTOM CENTER TIP BRACT */}
        <path
          d="
            M 50 75
            C 46 80 44 86 48 91
            C 49 92.5 50 93.5 50 93.5
            C 50 93.5 51 92.5 52 91
            C 56 86 54 80 50 75
            Z
          "
          fill="url(#hop-art-highlight)"
          stroke="#091424"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </g>

      {/* VARIANT 2: ROUTE WAYPOINTS & PINS (Foreground Details) */}
      {variant === 'route' && (
        <g id="hop-route-waypoint-pins">
          {/* Waypoint 1: Start Location Dot (Top Left) */}
          <circle cx="15" cy="65" r="4.5" fill="#58A72F" stroke="#FFFFFF" strokeWidth="1.8" />
          <circle cx="15" cy="65" r="1.8" fill="#FFFFFF" />

          {/* Waypoint 2: Mid-Tour Brewery Stop Pin (Top Right) */}
          <g transform="translate(86, 26)">
            {/* Map Pin */}
            <path
              d="M 0 -7 C -4 -7 -6.5 -4.5 -6.5 -1 C -6.5 3.5 0 9 0 9 C 0 9 6.5 3.5 6.5 -1 C 6.5 -4.5 4 -7 0 -7 Z"
              fill="#F59E0B"
              stroke="#FFFFFF"
              strokeWidth="1.4"
            />
            {/* Pin Center Dot */}
            <circle cx="0" cy="-1.5" r="2" fill="#111827" />
          </g>

          {/* Waypoint 3: Tour Destination Flag / Star Pin (Bottom Center-Left) */}
          <g transform="translate(25, 91)">
            {/* Round Waypoint Badge */}
            <circle cx="0" cy="0" r="4.8" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.6" />
            {/* Tiny Star Icon in Destination */}
            <path
              d="M 0 -2.5 L 0.8 -0.8 L 2.5 -0.6 L 1.2 0.7 L 1.6 2.4 L 0 1.5 L -1.6 2.4 L -1.2 0.7 L -2.5 -0.6 L -0.8 -0.8 Z"
              fill="#FFFFFF"
            />
          </g>
        </g>
      )}
    </svg>
  );
};



