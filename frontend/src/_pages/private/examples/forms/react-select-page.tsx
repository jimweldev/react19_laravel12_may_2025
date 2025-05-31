import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CodePreview from '@/components/code/code-preview';
import UsersSelect from '@/components/react-select/users-select';
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

const FormSchemaSingle = z.object({
  user: z.object({
    label: z.string().min(1, {
      message: 'Required',
    }),
    value: z.number().min(1, {
      message: 'Required',
    }),
  }),
});

const FormSchemaMultiple = z.object({
  users: z
    .array(
      z.object({
        label: z.string().min(1, {
          message: 'Required',
        }),
        value: z.number().min(1, {
          message: 'Required',
        }),
      }),
    )
    .min(1, { message: 'Required' }),
});

const ReactSelectPage = () => {
  const formSingle = useForm<z.infer<typeof FormSchemaSingle>>({
    resolver: zodResolver(FormSchemaSingle),
    defaultValues: {
      user: undefined,
    },
  });

  const formMultiple = useForm<z.infer<typeof FormSchemaMultiple>>({
    resolver: zodResolver(FormSchemaMultiple),
    defaultValues: {
      users: [],
    },
  });

  const onSubmitSingle = (_data: z.infer<typeof FormSchemaSingle>) => {
    toast.success('Form submitted!');
  };

  const onSubmitMultiple = (_data: z.infer<typeof FormSchemaMultiple>) => {
    toast.success('Form submitted!');
  };

  const codeStringSingle = `
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { type ReactSelectOption } from '@/_types/common/react-select';
import UsersSelect from '@/components/react-select/users-select';
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
  user: z.object({
    label: z.string().min(1, {
      message: 'Required',
    }),
    value: z.string().min(1, {
      message: 'Required',
    }),
  }),
});

const ReactSelectPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user: undefined,
    },
  });

  const onSubmit = (_data: z.infer<typeof FormSchema>) => {
    toast.success('Form submitted!');
  };

  return (
    <>
      <PageHeader className="mb-3">React Select</PageHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-3">
            <FormField
              control={form.control}
              name="user"
              render={({ field, fieldState }) => (
                <FormItem className="col-span-12">
                  <FormLabel>User</FormLabel>
                  <FormControl>
                    <UsersSelect
                      className={\`\${fieldState.invalid ? 'invalid' : ''}\`}
                      placeholder="Select user"
                      value={field.value}
                      onChange={(value: ReactSelectOption) => {
                        field.onChange({
                          ...value,
                          value: value.value.toString(),
                        });
                      }}
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
    </>
  );
};

export default ReactSelectPage;
  `.trim();

  const codeStringMultiple = `
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { type ReactSelectOption } from '@/_types/common/react-select';
import UsersSelect from '@/components/react-select/users-select';
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
  user: z.object({
    label: z.string().min(1, {
      message: 'Required',
    }),
    value: z.string().min(1, {
      message: 'Required',
    }),
  }),
});

const ReactSelectPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user: undefined,
    },
  });

  const onSubmit = (_data: z.infer<typeof FormSchema>) => {
    toast.success('Form submitted!');
  };

  return (
    <>
      <PageHeader className="mb-3">React Select</PageHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-3">
            <FormField
              control={form.control}
              name="user"
              render={({ field, fieldState }) => (
                <FormItem className="col-span-12">
                  <FormLabel>User</FormLabel>
                  <FormControl>
                    <UsersSelect
                      className={\`\${fieldState.invalid ? 'invalid' : ''}\`}
                      placeholder="Select user"
                      value={field.value}
                      onChange={(value: ReactSelectOption) => {
                        field.onChange({
                          ...value,
                          value: value.value.toString(),
                        });
                      }}
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
    </>
  );
};

export default ReactSelectPage;
  `.trim();

  return (
    <>
      <PageHeader className="mb-3">React Select</PageHeader>

      <h5 className="text-medium mb-1 font-semibold">Single</h5>
      <CodePreview
        className="mb-6"
        code={codeStringSingle}
        lineNumbers={[
          48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64,
          65, 66, 67, 68, 69, 70,
        ]}
      >
        <Form {...formSingle}>
          <form onSubmit={formSingle.handleSubmit(onSubmitSingle)}>
            <div className="grid grid-cols-12 gap-3">
              <FormField
                control={formSingle.control}
                name="user"
                render={({ field, fieldState }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>User</FormLabel>
                    <FormControl>
                      <UsersSelect
                        className={`${fieldState.invalid ? 'invalid' : ''}`}
                        placeholder="Select user"
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

      <h5 className="text-medium mb-1 font-semibold">Multiple</h5>
      <CodePreview
        code={codeStringMultiple}
        lineNumbers={[
          48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64,
          65, 66, 67, 68, 69, 70,
        ]}
      >
        <Form {...formMultiple}>
          <form onSubmit={formMultiple.handleSubmit(onSubmitMultiple)}>
            <div className="grid grid-cols-12 gap-3">
              <FormField
                control={formMultiple.control}
                name="users"
                render={({ field, fieldState }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Users</FormLabel>
                    <FormControl>
                      <UsersSelect
                        className={`${fieldState.invalid ? 'invalid' : ''}`}
                        placeholder="Select users"
                        isMulti
                        closeMenuOnSelect={false}
                        value={field.value || []}
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
    </>
  );
};

export default ReactSelectPage;
