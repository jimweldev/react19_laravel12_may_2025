import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useFontSizeStore from '@/_stores/font-size-store';
import useThemeStore from '@/_stores/theme-store';
import PageHeader from '@/components/typography/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const timezones = [
  {
    value: 'Asia/Manila',
    label: 'Asia/Manila',
  },
  {
    value: 'Asia/Hong_Kong',
    label: 'Asia/Hong_Kong',
  },
  {
    value: 'Asia/Tokyo',
    label: 'Asia/Tokyo',
  },
];

const FormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], {
    message: 'Theme must be either light or dark',
  }),
  font_size: z.string().min(1, {
    message: 'Required',
  }),
  timezone: z.string().min(1, {
    message: 'Required',
  }),
});

const GeneralPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { fontSize, setFontSize } = useFontSizeStore();

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      theme: theme,
      font_size: fontSize,
      timezone: 'Asia/Manila',
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    // eslint-disable-next-line no-console
    console.log(data);
    // Add save logic here
    setTheme(data.theme);
    setFontSize(data.font_size);
  };

  return (
    <div className="relative">
      <div className="mb-3">
        <PageHeader>General</PageHeader>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <Card className="max-w-md">
            <CardBody>
              <div className="grid grid-cols-12 gap-3">
                {/* Theme Selection */}
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Theme</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-5"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light" />
                            <Label htmlFor="light">Light</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="dark" />
                            <Label htmlFor="dark">Dark</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Font Size Selection */}
                <FormField
                  control={form.control}
                  name="font_size"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Font Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="0.875rem">Small</SelectItem>
                            <SelectItem value="1rem">Medium</SelectItem>
                            <SelectItem value="1.125rem">Large</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Timezone Selection */}
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Timezone</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="flex w-full items-center justify-between gap-2 !bg-transparent px-3 py-2 text-sm font-normal whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none"
                            >
                              {field.value ?? 'Select timezone...'}
                              <ChevronDown className="size-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search timezone..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {timezones.map(timezone => (
                                  <CommandItem
                                    key={timezone.value}
                                    value={timezone.value}
                                    onSelect={currentValue => {
                                      field.onChange(currentValue);
                                      setOpen(false);
                                    }}
                                  >
                                    {timezone.label}
                                    <Check
                                      className={cn(
                                        'ml-auto',
                                        field.value === timezone.value
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardBody>
            <CardFooter className="flex justify-end">
              <Button type="submit">Save</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default GeneralPage;
