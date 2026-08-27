import React from 'react';

interface HopIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  filled?: boolean;
}

/**
 * Custom Beer Hop Cone Vector Icon
 * Artisanal fresh hop cone icon with overlapping bract scales & stem.
 */
export const HopIcon: React.FC<HopIconProps> = ({
  className = 'w-5 h-5',
  size,
  filled = false,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      {...props}
    >
      {/* Hop Vine Top Stem */}
      <path d="M12 1.5v3" strokeWidth="2" />
      <path d="M12 3c1.6-1.5 3.6-1.2 4.6-.4" />
      <path d="M12 3c-1.6-1.5-3.6-1.2-4.6-.4" />

      {/* Top Bracts */}
      <path
        d="M9.2 5.2C10.1 4.5 11 4.2 12 4.2s1.9.3 2.8 1c1.2 1.4 1.1 3-.1 4.1-1.1 1-2.2 1.4-2.7 1.4s-1.6-.4-2.7-1.4c-1.2-1.1-1.3-2.7-.1-4.1z"
        fill="currentColor"
        fillOpacity={filled ? 0.9 : 0.18}
      />

      {/* Upper Side Hop Scales */}
      <path
        d="M8.2 7.2C6.8 8.4 6.2 10.2 6.8 12c.9.3 2 .2 3.1-.5"
        fill="currentColor"
        fillOpacity={filled ? 0.8 : 0.12}
      />
      <path
        d="M15.8 7.2c1.4 1.2 2 3 1.4 4.8-.9.3-2 .2-3.1-.5"
        fill="currentColor"
        fillOpacity={filled ? 0.8 : 0.12}
      />

      {/* Middle Hop Bracts Layer */}
      <path
        d="M5.5 11.8c-1.1 1.7-.8 3.7.4 4.9 1.2.3 2.5-.2 3.5-1.2"
        fill="currentColor"
        fillOpacity={filled ? 0.85 : 0.15}
      />
      <path
        d="M18.5 11.8c1.1 1.7.8 3.7-.4 4.9-1.2.3-2.5-.2-3.5-1.2"
        fill="currentColor"
        fillOpacity={filled ? 0.85 : 0.15}
      />
      <path
        d="M8.4 10.5c2.2-1.1 5-1.1 7.2 0 1.3 1.6 1 3.8-.4 5-1.7 1.3-3.9 1.3-5.6 0-1.4-1.2-1.7-3.4-.4-5z"
        fill="currentColor"
        fillOpacity={filled ? 0.95 : 0.25}
      />

      {/* Lower Cone Scales Apex */}
      <path
        d="M7.8 15.5c1.4 1.8 2.6 3.7 4.2 5.5 1.6-1.8 2.8-3.7 4.2-5.5-1.3-.9-2.7-1.3-4.2-1.3s-2.9.4-4.2 1.3z"
        fill="currentColor"
        fillOpacity={filled ? 1 : 0.35}
      />
      <path d="M10.2 17.8c.8 1.4 1.8 2.8 1.8 2.8s1-1.4 1.8-2.8" />
    </svg>
  );
};
