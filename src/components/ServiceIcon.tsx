import React from 'react';
import { ServiceCategory } from '../types';

interface ServiceIconProps {
  category: ServiceCategory | string;
  className?: string;
  size?: number;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  category,
  className = 'w-5 h-5',
  size = 20,
}) => {
  switch (category) {
    case 'AC Service':
      // Dedicated Air Conditioner symbol (Split AC unit with louvers, cooling grill, and ambient wind waves)
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* AC Wall Indoor Unit Frame */}
          <rect x="2" y="4" width="20" height="9" rx="2" />
          {/* Air Filter Grill / Display indicator */}
          <line x1="6" y1="7" x2="10" y2="7" strokeWidth="1.5" />
          <circle cx="18" cy="7" r="1" fill="currentColor" />
          {/* Air Deflector Vane / Bottom Flap */}
          <line x1="4" y1="13" x2="20" y2="13" strokeWidth="1.5" />
          {/* Cold Air Flow Waves coming out from bottom */}
          <path d="M6 16c1 1.5 2 1.5 3 0s2-1.5 3 0" />
          <path d="M12 16c1 1.5 2 1.5 3 0s2-1.5 3 0" />
          <path d="M9 19.5c1 1.2 2 1.2 3 0s2-1.2 3 0" opacity="0.7" />
        </svg>
      );

    case 'Plumbing':
      // Pipe fitting with faucet valve & water droplet
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Tap / Spigot Body */}
          <path d="M4 10h8v4H4z" />
          {/* Water Inlet Pipe */}
          <path d="M8 4v6" strokeWidth="2" />
          <path d="M6 4h4" strokeWidth="2" />
          {/* Outlet Spout curving down */}
          <path d="M12 12h2a2 2 0 0 1 2 2v2" />
          {/* Water Droplet */}
          <path
            d="M16 19a2 2 0 1 0 0-4c-.7 1-2 2.5-2 3.5a2 2 0 0 0 2 0.5z"
            fill="currentColor"
            fillOpacity="0.2"
          />
          {/* Pipeline Flange */}
          <line x1="2" y1="8" x2="2" y2="16" strokeWidth="2" />
        </svg>
      );

    case 'Electrical':
      // High-voltage lightning bolt with circuit wiring node
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Sharp High-Voltage Energy Flash */}
          <polygon
            points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
            fill="currentColor"
            fillOpacity="0.2"
          />
        </svg>
      );

    case 'Carpentry':
      // Master Claw Hammer and Carpenter Handsaw
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Hammer Head */}
          <path d="M15 3l4 4" strokeWidth="2.5" />
          <path d="M14 6l3-3c.6-.6 1.5-.6 2.1 0l1.9 1.9c.6.6.6 1.5 0 2.1l-3 3" />
          {/* Hammer Handle */}
          <line x1="14" y1="6" x2="5" y2="15" strokeWidth="2.5" />
          {/* Carpenter Square / Wood Joint */}
          <path d="M3 21h18" strokeWidth="2" />
          <path d="M3 21v-6l4 3 4-3 4 3 3-2v5" strokeWidth="1.4" opacity="0.6" />
        </svg>
      );

    case 'Appliance Repair':
      // Washing Machine & Refrigerator Appliance Symbol
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Washing Machine Outer Body */}
          <rect x="4" y="2" width="16" height="20" rx="3" />
          {/* Control Dial Knobs */}
          <circle cx="8" cy="6" r="1" fill="currentColor" />
          <circle cx="12" cy="6" r="1" fill="currentColor" />
          <line x1="15" y1="6" x2="18" y2="6" />
          {/* Transparent Glass Drum Door */}
          <circle cx="12" cy="14" r="4.5" />
          {/* Drum Vortex Swirl */}
          <path d="M12 11.5a2.5 2.5 0 0 1 2.5 2.5" strokeWidth="1.4" />
        </svg>
      );

    case 'Painting':
      // Paint Roller with Wet Coating Trail
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Paint Roller Cylinder */}
          <rect x="4" y="3" width="16" height="6" rx="2" fill="currentColor" fillOpacity="0.2" />
          {/* Steel Bracket Frame */}
          <path d="M20 6h2v5a2 2 0 0 1-2 2h-7v4" strokeWidth="1.8" />
          {/* Ergonomic Handle */}
          <rect x="11" y="17" width="4" height="5" rx="1" strokeWidth="2" />
          {/* Wet Paint Dripping Drops */}
          <path d="M7 11v2" strokeWidth="1.5" />
          <path d="M12 11v3" strokeWidth="1.5" />
        </svg>
      );

    case 'Cleaning':
      // Spray Bottle with Sanitization Star Sparkles
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Spray Trigger Head */}
          <path d="M7 6h6v3H7z" />
          <path d="M13 7l3 1-1 3h-2" />
          {/* Fluid Reservoir Flask */}
          <path d="M8 9l-2 4v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8l-2-4" fill="currentColor" fillOpacity="0.15" />
          {/* Sparkles / Clean stars */}
          <path d="M18 3l.8 1.8L20.5 5.5l-1.7.8L18 8l-.8-1.7L15.5 5.5l1.7-.7z" fill="currentColor" />
          <circle cx="20" cy="11" r="1" fill="currentColor" />
        </svg>
      );

    case 'Gardening':
      // Sprout Plant & Pruning Shears / Tree Leaf
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Plant Stem */}
          <path d="M12 22V10" strokeWidth="2" />
          {/* Left Lush Leaf */}
          <path d="M12 14c-4 0-6-3-6-6 4 0 6 3 6 6z" fill="currentColor" fillOpacity="0.25" />
          {/* Right Sprouting Leaf */}
          <path d="M12 11c4 0 6-3 6-6-4 0-6 3-6 6z" fill="currentColor" fillOpacity="0.25" />
          {/* Soil Ground Mound */}
          <path d="M4 22c2-1.5 5-2 8-2s6 .5 8 2" strokeWidth="1.5" />
        </svg>
      );

    case 'Caregiving':
      // Heart in Caring Supporting Hands / Healthcare Emblem
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Heart Emblem */}
          <path
            d="M12 6.5C10.5 4 7 4 5 6s-1 5 1 7l6 6 6-6c2-2 3-5 1-7s-5.5-2-7 .5z"
            fill="currentColor"
            fillOpacity="0.25"
          />
          {/* Healthcare Cross Accent inside heart */}
          <path d="M12 9v4M10 11h4" strokeWidth="1.8" stroke="currentColor" />
        </svg>
      );

    default:
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={className}
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
  }
};
