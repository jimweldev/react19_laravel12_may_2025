import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { type ReactSelectOption } from '@/_types/common/react-select';
import PermissionsSelect from '@/components/react-select/permissions-select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { mainInstance } from '@/instances/main-instance';

const FormSchema = z.object({
  label: z.string().min(1, {
    message: 'Required',
  }),
  value: z.string().min(1, {
    message: 'Required',
  }),
  permissions: z
    .array(
      z.object({
        label: z.string().min(1, {
          message: 'Required',
        }),
        value: z.string().min(1, {
          message: 'Required',
        }),
      }),
    )
    .min(1, { message: 'Required' }),
});

type CreateRoleProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const CreateRole = ({ open, setOpen, refetch }: CreateRoleProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      label: '',
      value: '',
      permissions: [],
    },
  });

  const label = form.watch('label');

  useEffect(() => {
    const value = label
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    form.setValue('value', value);
  }, [label, form]);

  const [isLoadingCreateItem, setIsLoadingCreateItem] = useState(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const newData = {
      ...data,
      permission_ids: data.permissions.map(item => item.value),
    };

    if ('permissions' in newData) {
      delete (newData as { permissions?: unknown }).permissions;
    }

    setIsLoadingCreateItem(true);

    toast.promise(mainInstance.post(`/api/rbac/roles`, newData), {
      loading: 'Loading...',
      success: () => {
        refetch();

        form.reset();
        return 'Success!';
      },
      error: error => {
        return (
          error.response?.data?.message || error.message || 'An error occurred'
        );
      },
      finally: () => {
        setIsLoadingCreateItem(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
            <DialogHeader>
              <DialogTitle>Create Role</DialogTitle>
              <DialogDescription>
                Please fill in the form below to create a new record
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="grid grid-cols-12 gap-3">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Manager" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="manager" readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Permissions</FormLabel>
                      <FormControl>
                        <PermissionsSelect
                          placeholder="Select permissions"
                          isMulti
                          closeMenuOnSelect={false}
                          value={field.value || []}
                          onChange={(value: ReactSelectOption[]) => {
                            const newValue = value.map(
                              (item: ReactSelectOption) => ({
                                ...item,
                                value: item.value.toString(),
                              }),
                            );
                            field.onChange(newValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DialogBody>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>

              <Button type="submit" disabled={isLoadingCreateItem}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRole;
