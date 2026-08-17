import React from 'react';
import { cn } from '../cn';

export type SurfaceVariant = 'canvas' | 'primary' | 'elevated' | 'glass' | 'clear-glass';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
  as?: React.ElementType;
}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant = 'primary', as: Component = 'div', ...props }, ref) => {
    const variants: Record<SurfaceVariant, string> = {
      canvas: 'bg-surface-base',
      primary: 'bg-surface-primary',
      elevated: 'bg-surface-elevated shadow-os-md',
      glass: 'bg-surface-primary/70 backdrop-blur-os border border-border-subtle shadow-os-glass',
      'clear-glass': 'bg-surface-primary/40 backdrop-blur-os-lg border border-border-subtle',
    };

    return (
      <Component
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      />
    );
  }
);

Surface.displayName = 'Surface';
