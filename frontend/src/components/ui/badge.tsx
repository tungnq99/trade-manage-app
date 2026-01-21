import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'long' | 'short' | 'tp-hit' | 'sl-hit' | 'success' | 'destructive';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors',
                    {
                        // Default
                        'border-border bg-muted text-foreground-secondary': variant === 'default',

                        // Trading Direction
                        'border-success/20 bg-success/10 text-success': variant === 'long',
                        'border-destructive/20 bg-destructive/10 text-destructive': variant === 'short',

                        // Trade Outcome
                        'border-success/30 bg-success/15 text-success font-semibold': variant === 'tp-hit',
                        'border-destructive/30 bg-destructive/15 text-destructive font-semibold':
                            variant === 'sl-hit',

                        // Generic Semantic (slightly stronger emphasis than direction)
                        'border-success/30 bg-success/20 text-success font-medium': variant === 'success',
                        'border-destructive/30 bg-destructive/20 text-destructive font-medium': variant === 'destructive',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = 'Badge';

export { Badge };
