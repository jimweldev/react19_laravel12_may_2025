import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva('', {
  variants: {
    inputSize: {
      default: 'h-9 px-3 py-2 has-[>svg]:px-3 text-sm file:text-sm file:h-7',
      lg: 'h-10 rounded-md px-6 has-[>svg]:px-4 text-lg file:text-medium file:h-8',
      sm: 'px-3 py-1 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs file:text-xs file:h-5',
    },
  },
  defaultVariants: {
    inputSize: 'default',
  },
});

function Input({
  className,
  type,
  inputSize,
  ...props
}: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        inputVariants({ inputSize, className }),
        'file:text-foreground file:border-0 file:bg-transparent file:font-medium',
        'border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        type !== 'file' && 'read-only:bg-muted read-only:text-muted-foreground',
        type !== 'file' &&
          'read-only:focus-visible:border-input read-only:focus-visible:ring-0',
        "[aria-readonly='true']:pointer-events-none [aria-readonly='true']:cursor-not-allowed [aria-readonly='true']:opacity-50 [aria-readonly='true']:shadow-none",
        'focus-visible:border-primary focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      )}
      {...props}
    />
  );
}

export { Input };
