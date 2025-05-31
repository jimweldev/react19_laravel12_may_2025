import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CodePreview from '@/components/code/code-preview';
import GlobalDropdownsSelect from '@/components/react-select/global-dropdowns-select';
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

const FormSchema = z.object({
  status: z.object({
    label: z.string().min(1, {
      message: 'Required',
    }),
    value: z.number().min(1, {
      message: 'Required',
    }),
  }),
});

const GlobalDropdownPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: undefined,
    },
  });

  const onSubmit = (_data: z.infer<typeof FormSchema>) => {
    toast.success('Form submitted!');
  };

  const codeString = `
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CodePreview from '@/components/code/code-preview';
import GlobalDropdownsSelect from '@/components/react-select/global-dropdowns-select';
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

const FormSchema = z.object({
  status: z.object({
    label: z.string().min(1, {
      message: 'Required',
    }),
    value: z.number().min(1, {
      message: 'Required',
    }),
  }),
});

const GlobalDropdownPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: undefined,
    },
  });

  const onSubmit = (_data: z.infer<typeof FormSchema>) => {
    toast.success('Form submitted!');
  };

  return (
    <div>
      <PageHeader className="mb-3">Global Dropdown</PageHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-3">
            <FormField
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <FormItem className="col-span-12">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <GlobalDropdownsSelect
                      className={\`\${fieldState.invalid ? 'invalid' : ''}\`}
                      module="users"
                      type="status"
                      placeholder="Select status"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-12 flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GlobalDropdownPage;
  `.trim();

  return (
    <div>
      <PageHeader className="mb-3">Global Dropdown</PageHeader>

      <CodePreview
        className="mb-6"
        code={codeString}
        lineNumbers={[
          48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64,
          65, 66, 67,
        ]}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <GlobalDropdownsSelect
                        className={`${fieldState.invalid ? 'invalid' : ''}`}
                        module="users"
                        type="status"
                        placeholder="Select status"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-12 flex justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </Form>
      </CodePreview>
    </div>
  );
};

export default GlobalDropdownPage;
