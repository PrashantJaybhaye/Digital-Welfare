import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  color?: string;
  eyeColor?: string;
}

export default function Logo({ 
  className = '', 
  size = 44, 
  color = '#dc2626',
  eyeColor = '#FFFFFF'
}: LogoProps) {
  return (
    <svg
      viewBox="320 290 440 500"
      className={`shrink-0 ${className}`}
      style={{ width: size, height: size }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main Logo */}
      <path
        fill={color}
        d="
          M 546 301
          L 332 644
          L 425 644
          L 425 778
          L 515 689
          L 605 779
          L 605 607
          L 721 606
          L 747 546
          L 679 506
          L 640 443
          L 546 417
          Z
        "
      />

      {/* Right Ear */}
      <path
        fill={color}
        d="
          M 659 303
          L 590 395
          L 659 394
          Z
        "
      />

      {/* Eye */}
      <ellipse
        cx="565.1"
        cy="511"
        rx="26.1"
        ry="49.3"
        fill={eyeColor}
        transform="rotate(112.2 565.1 511)"
      />
    </svg>
  );
}
