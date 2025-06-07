import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment-timezone';
import { useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import { toast } from 'sonner';
import { z } from 'zod';
import useAuthUserStore from '@/_stores/auth-user-store';
import useFontSizeStore from '@/_stores/font-size-store';
import useThemeStore from '@/_stores/theme-store';
import useTimezoneStore from '@/_stores/timezone-store';
import PageHeader from '@/components/typography/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mainInstance } from '@/instances/main-instance';

const timezones = moment.tz.names().map(tz => ({ label: tz, value: tz }));

const FormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], {
    message: 'Theme must be either light or dark',
  }),
  font_size: z.string().min(1, {
    message: 'Required',
  }),
  timezone: z.object({
    label: z.string().min(1, {
      message: 'Required',
    }),
    value: z.string().min(1, {
      message: 'Required',
    }),
  }),
  date_format: z.string().min(1, {
    message: 'Required',
  }),
  time_format: z.string().min(1, {
    message: 'Required',
  }),
});

const GeneralPage = () => {
  const { setUser } = useAuthUserStore();
  const { theme, setTheme } = useThemeStore();
  const { fontSize, setFontSize } = useFontSizeStore();
  const {
    timezone,
    date_format,
    time_format,
    setTimezone,
    setDateFormat,
    setTimeFormat,
  } = useTimezoneStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      theme: theme || 'light',
      font_size: fontSize || '1rem',
      timezone: timezone
        ? timezones.find(tz => tz.value === timezone)
        : undefined,
      date_format: date_format || 'YYYY-MM-DD',
      time_format: time_format || 'HH:mm:ss',
    },
  });

  const [isLoadingUpdateProfile, setIsLoadingUpdateProfile] =
    useState<boolean>(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const newData = { ...data, timezone: data.timezone?.value };

    setIsLoadingUpdateProfile(true);

    toast.promise(mainInstance.patch(`/api/settings`, newData), {
      loading: 'Loading...',
      success: response => {
        setUser(response.data);

        setTheme(response.data.user_setting.theme);
        setFontSize(response.data.user_setting.font_size);
        setTimezone(response.data.user_setting.timezone);
        setDateFormat(response.data.user_setting.date_format);
        setTimeFormat(response.data.user_setting.time_format);

        return 'Success!';
      },
      error: error => {
        return (
          error.response?.data?.message || error.message || 'An error occurred'
        );
      },
      finally: () => {
        setIsLoadingUpdateProfile(false);
      },
    });
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

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field, fieldState }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Timezone</FormLabel>
                      <ReactSelect
                        classNamePrefix="react-select"
                        className={`react-select-container ${fieldState.invalid ? 'invalid' : ''}`}
                        placeholder="Select timezone"
                        value={field.value}
                        onChange={field.onChange}
                        options={timezones}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_format"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Date Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="YYYY-MM-DD">
                              YYYY-MM-DD
                            </SelectItem>
                            <SelectItem value="MM/DD/YYYY">
                              MM/DD/YYYY
                            </SelectItem>
                            <SelectItem value="DD/MM/YYYY">
                              DD/MM/YYYY
                            </SelectItem>
                            <SelectItem value="MMM DD, YYYY">
                              MMM DD, YYYY
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time_format"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Time Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="hh:mm:ss A">12 Hour</SelectItem>
                            <SelectItem value="HH:mm:ss">24 Hour</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardBody>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoadingUpdateProfile}>
                Save
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default GeneralPage;
