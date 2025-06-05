import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { type RbacPermission } from '@/_types/rbac-permission';
import { type User } from '@/_types/user';
import ErrorDialog from '@/components/errors/error-dialog';
import DialogSkeleton from '@/components/skeletons/dialog-skeleton';
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
});

type UpdatePermissionProps = {
  selectedItem: User | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<User | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const UpdatePermission = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: UpdatePermissionProps) => {
  const title = 'Update Permission';
  const description = 'Modify the details of an existing record';

  const {
    data: rbacPermission,
    isFetching,
    error,
  } = useQuery<RbacPermission>({
    queryKey: ['rbac/permissions', 'update', selectedItem?.id],
    queryFn: async ({ signal }): Promise<RbacPermission> => {
      const res = await mainInstance.get(
        `/api/rbac/permissions/${selectedItem?.id}`,
        { signal },
      );
      return res.data;
    },
    enabled: !!selectedItem && open,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      label: '',
      value: '',
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

  const [isLoadingUpdateItem, setIsLoadingUpdateItem] = useState(false);

  useEffect(() => {
    if (rbacPermission) {
      form.reset({
        label: rbacPermission.label || '',
        value: rbacPermission.value || '',
      });
    }
  }, [rbacPermission, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoadingUpdateItem(true);

    toast.promise(
      mainInstance.patch(`/api/rbac/permissions/${selectedItem?.id}`, data),
      {
        loading: 'Loading...',
        success: () => {
          refetch();
          return 'Success!';
        },
        error: error => {
          return (
            error.response?.data?.message ||
            error.message ||
            'An error occurred'
          );
        },
        finally: () => {
          setIsLoadingUpdateItem(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setTimeout(() => {
          setSelectedItem(null);
        }, 200);
      }}
    >
      <DialogContent>
        {isFetching ? (
          <DialogSkeleton
            title={title}
            description={description}
            inputCount={2}
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>

              <DialogBody>
                {error ? (
                  <ErrorDialog error={error} />
                ) : (
                  <div className="grid grid-cols-12 gap-3">
                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem className="col-span-12">
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Create User" />
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
                            <Input
                              {...field}
                              placeholder="create-user"
                              readOnly
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </DialogBody>

              <DialogFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
                <Button type="submit" disabled={isLoadingUpdateItem || !!error}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePermission;
