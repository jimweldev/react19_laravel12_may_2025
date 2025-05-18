import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CodePreview from '@/components/code/code-preview';
import DatePicker from '@/components/date/date-picker';
import PageHeader from '@/components/typography/page-header';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const FormSchemaDate = z.object({
  date: z.string().min(1, {
    message: 'Required',
  }),
});

const FormSchemaDateTime = z.object({
  date_time: z.string().min(1, {
    message: 'Required',
  }),
});

const DatePickerPage = () => {
  const formDate = useForm<z.infer<typeof FormSchemaDate>>({
    resolver: zodResolver(FormSchemaDate),
  });

  const onSubmitDate = (_data: z.infer<typeof FormSchemaDate>) => {
    toast.success('Form submitted!');
  };

  const formDateTime = useForm<z.infer<typeof FormSchemaDateTime>>({
    resolver: zodResolver(FormSchemaDateTime),
  });

  const onSubmitDateTime = (_data: z.infer<typeof FormSchemaDateTime>) => {
    toast.success('Form submitted!');
  };

  const codeStringDate = `
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import DatePicker from '@/components/date/date-picker';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const FormSchema = z.object({
  date: z.string().min(1, {
    message: 'Required',
  }),
});

const DatePickerPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast.success('Form submitted!');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default DatePickerPage;
  `.trim();

  const codeStringDateTime = `
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import DatePicker from '@/components/date/date-picker';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const FormSchema = z.object({
  date_time: z.string().min(1, {
    message: 'Required',
  }),
});

const DatePickerPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast.success('Form submitted!');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="date_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Time</FormLabel>
                <FormControl>
                  <DatePicker type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default DatePickerPage;
  `.trim();

  return (
    <>
      <PageHeader className="mb-3">Date Picker</PageHeader>

      <h5 className="text-medium mb-1 font-semibold">Date</h5>
      <CodePreview
        className="mb-6"
        code={codeStringDate}
        lineNumbers={[36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]}
      >
        <Form {...formDate}>
          <form onSubmit={formDate.handleSubmit(onSubmitDate)}>
            <div className="grid gap-3">
              <FormField
                control={formDate.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </Form>
      </CodePreview>

      <h5 className="text-medium mb-1 font-semibold">Date Time</h5>
      <CodePreview
        code={codeStringDateTime}
        lineNumbers={[36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]}
      >
        <Form {...formDateTime}>
          <form onSubmit={formDateTime.handleSubmit(onSubmitDateTime)}>
            <div className="grid gap-3">
              <FormField
                control={formDateTime.control}
                name="date_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Time</FormLabel>
                    <FormControl>
                      <DatePicker type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </Form>
      </CodePreview>
    </>
  );
};

export default DatePickerPage;
