import React from 'react';
import { cn } from '../cn';
import { Text } from '../primitives/Text';

export interface KQCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'elevated' | 'interactive';
}

export const KQCard = React.forwardRef<HTMLDivElement, KQCardProps>(
  ({ className, variant = 'standard', ...props }, ref) => {
    
    const baseClasses = 'rounded-xl overflow-hidden flex flex-col transition-all duration-base ease-spring';
    
    const variantMap = {
      standard: 'bg-surface-primary border border-border',
      elevated: 'bg-surface-elevated border border-border-subtle shadow-os-md',
      interactive: 'bg-surface-primary border border-border hover:border-border-strong hover:shadow-os-md hover:-translate-y-[2px] cursor-pointer',
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantMap[variant], className)}
        {...props}
      />
    );
  }
);
KQCard.displayName = 'KQCard';

export const KQCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { title?: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode }>(
  ({ className, title, subtitle, action, children, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 py-4 flex items-center justify-between', className)} {...props}>
      {(title || subtitle) ? (
        <div className="flex flex-col gap-0.5">
          {title && (typeof title === 'string' ? <Text variant="h3">{title}</Text> : title)}
          {subtitle && (typeof subtitle === 'string' ? <Text variant="secondary">{subtitle}</Text> : subtitle)}
        </div>
      ) : null}
      {children}
      {action && <div>{action}</div>}
    </div>
  )
);
KQCardHeader.displayName = 'KQCardHeader';

export const KQCardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 pb-5 flex-1', className)} {...props} />
  )
);
KQCardBody.displayName = 'KQCardBody';

export const KQCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 py-3 bg-surface-base/50 border-t border-border-subtle flex items-center mt-auto', className)} {...props} />
  )
);
KQCardFooter.displayName = 'KQCardFooter';
