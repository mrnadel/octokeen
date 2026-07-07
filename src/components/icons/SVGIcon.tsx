import React from 'react';

interface SVGIconProps {
  size?: number;
  className?: string;
  viewBox?: string;
  children: React.ReactNode;
}

export const SVGIcon = ({
  size = 64,
  className,
  viewBox = '0 0 64 64',
  children,
}: SVGIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {children}
  </svg>
);
