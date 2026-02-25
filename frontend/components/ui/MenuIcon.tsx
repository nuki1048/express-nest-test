import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const MenuIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={cn("w-[50px] h-[50px] fill-primary transition-colors hover:fill-secondary", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path d="M70.67 69.906l8.592 23.28h5.856L93.71 69.81v23.376h6.72V59.682h-8.159l-9.985 25.2-10.176-25.2h-8.208v33.504h6.768v-23.28z"></path>
        <path d="M136.582 87.762h-13.44v-9.12h12v-5.184h-12v-8.784h13.44v-5.376h-20.208v33.888h20.208v-5.424z"></path>
        <path d="M85.959 129.529l-15.168-23.232h-6.768v33.889h6.768v-23.04l15.168 23.04h6.769v-33.889h-6.769v23.232z"></path>
        <path d="M122.872 140.521c2.623 0 4.968-.528 7.031-1.584 2.064-1.056 3.68-2.664 4.849-4.824 1.167-2.16 1.752-4.807 1.752-7.943v-19.873h-6.721v19.873c0 2.656-.584 4.648-1.752 5.976-1.168 1.328-2.84 1.992-5.016 1.992-2.208 0-3.896-.664-5.064-1.992-1.168-1.327-1.752-3.319-1.752-5.976v-19.873h-6.72v19.873c0 4.703 1.216 8.272 3.648 10.704 2.433 2.432 5.681 3.647 9.745 3.647z"></path>
        <rect x="21" y="21" width="4" height="158" />
        <rect x="175" y="21" width="4" height="158" />
      </g>
    </svg>
  );
};