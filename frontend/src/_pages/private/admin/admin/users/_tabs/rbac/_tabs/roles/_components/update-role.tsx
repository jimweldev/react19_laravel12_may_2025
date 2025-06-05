import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { type ReactSelectOption } from '@/_types/common/react-select';
import { type RbacRole } from '@/_types/rbac-role';
import { type RbacRolePermission } from '@/_types/rbac-role-permission';
import { type User } from '@/_types/user';
import ErrorDialog from '@/components/errors/error-dialog';
import PermissionsSelect from '@/components/react-select/permissions-select';
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

type UpdateRoleProps = {
  selectedItem: User | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<User | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const UpdateRole = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: UpdateRoleProps) => {
  const title = 'Update Role';
  const description = 'Modify the details of an existing record';

  const {
    data: rbacRole,
    isFetching,
    error,
  } = useQuery<RbacRole>({
    queryKey: ['rbac/roles', 'update', selectedItem?.id],
    queryFn: async ({ signal }): Promise<RbacRole> => {
      const res = await mainInstance.get(
        `/api/rbac/roles/${selectedItem?.id}`,
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

  const [isLoadingUpdateItem, setIsLoadingUpdateItem] = useState(false);

  useEffect(() => {
    if (rbacRole) {
      const selectedPermissions = rbacRole.rbac_role_permissions?.map(
        (permission: RbacRolePermission) => ({
          label: permission.rbac_permission?.label,
          value: (permission.rbac_permission?.id || '').toString(),
        }),
      );

      form.reset({
        label: rbacRole.label || '',
        value: rbacRole.value || '',
        permissions: selectedPermissions || [],
      });
    }
  }, [rbacRole, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const newData = {
      ...data,
      permission_ids: data.permissions.map(permission => permission.value),
    };

    if ('permissions' in newData) {
      delete (newData as { permissions?: unknown }).permissions;
    }

    setIsLoadingUpdateItem(true);

    toast.promise(
      mainInstance.patch(`/api/rbac/roles/${selectedItem?.id}`, newData),
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
            inputCount={3}
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
                            <Input {...field} />
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
                            <Input {...field} readOnly />
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

export default UpdateRole;
