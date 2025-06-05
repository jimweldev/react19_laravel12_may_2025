import { createContext, useContext } from 'react';
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('', className)}
      {...props}
    />
  );
}

const TabsContext = createContext<{ variant?: 'default' | 'outline' }>({});

const tabsListVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-sidebar-accent inline-flex flex-wrap rounded-lg p-1',
      outline: 'p-3 pb-0 border-b',
    },
    size: {
      default: 'text-sm',
      sm: 'text-xs',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

function TabsList({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsContext.Provider value={{ variant: variant || undefined }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(tabsListVariants({ variant, size }), className)}
        {...props}
      />
    </TabsContext.Provider>
  );
}

const tabsTriggerVariants = cva(
  'data-[state=active]:bg-card data-[state=active]:text-card-foreground font-medium px-2 py-1 whitespace-nowrap rounded-md',
  {
    variants: {
      variant: {
        default: cn(
          'data-[state=active]:shadow-sm text-sidebar-accent-foreground',
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex items-center justify-center gap-1.5 transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        ),
        outline: cn(
          'rounded-b-none mb-[-1px] border-t border-l border-r',
          'data-[state=inactive]:border-transparent',
        ),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof tabsTriggerVariants>) {
  const { variant } = useContext(TabsContext);

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={className}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
