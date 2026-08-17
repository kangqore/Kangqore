import React from 'react';
import { cn } from '../cn';

export type TextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'secondary' | 'metadata';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TextVariant;
  as?: React.ElementType;
  tabularNums?: boolean;
}

export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, variant = 'body', as, tabularNums = false, ...props }, ref) => {
    
    // Default element mapping based on variant
    const defaultElementMap: Record<TextVariant, React.ElementType> = {
      display: 'h1',
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      body: 'p',
      secondary: 'p',
      metadata: 'span',
    };

    const Component = as || defaultElementMap[variant];

    const variants: Record<TextVariant, string> = {
      display: 'text-os-xl md:text-svc-4xl font-display font-extrabold tracking-[-0.02em] text-text-primary',
      h1: 'text-os-xl font-display font-semibold tracking-[-0.01em] text-text-primary',
      h2: 'text-os-lg font-sans font-medium text-text-primary',
      h3: 'text-os-md font-sans font-medium text-text-primary',
      body: 'text-os-base font-sans font-normal leading-relaxed text-text-primary',
      secondary: 'text-os-sm font-sans font-normal text-text-secondary',
      metadata: 'text-os-xs font-sans font-bold uppercase tracking-[0.05em] text-text-muted',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          variants[variant],
          tabularNums && 'tabular-nums',
          className
        )}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';
