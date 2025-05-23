import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        success:
          'bg-success text-success-foreground shadow-xs hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40',
        warning:
          'bg-warning text-warning-foreground shadow-xs hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40',
        info: 'bg-info text-info-foreground shadow-xs hover:bg-info/90 focus-visible:ring-info/20 dark:focus-visible:ring-info/40',
        outline:
          'border border-input shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default:
          "h-9 px-4 py-2 has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 text-lg [&_svg:not([class*='size-'])]:size-5",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-sm [&_svg:not([class*='size-'])]:size-3",
        xs: "size-6 [&_svg:not([class*='size-'])]:size-3",
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  type = 'button',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      type={type}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
