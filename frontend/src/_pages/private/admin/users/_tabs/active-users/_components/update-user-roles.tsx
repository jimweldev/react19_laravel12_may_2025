import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { type ReactSelectOption } from '@/_types/common/react-select';
import { type RbacUserRole } from '@/_types/rbac-user-role';
import { type User } from '@/_types/user';
import ErrorDialog from '@/components/errors/error-dialog';
import RolesSelect from '@/components/react-select/roles-select';
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
import { Label } from '@/components/ui/label';
import { mainInstance } from '@/instances/main-instance';
import { formatName } from '@/lib/format-name';

// form - form validation
const FormSchema = z.object({
  roles: z
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

type UpdateUserRolesProps = {
  selectedItem: User | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<User | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const UpdateUserRoles = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: UpdateUserRolesProps) => {
  const title = 'Update User Roles';
  const description = 'Modify the details of an existing record';

  // QUERY
  // query - use query hook
  const {
    data: user,
    isFetching,
    error,
  } = useQuery<User>({
    queryKey: ['users', 'update', 'user-roles', selectedItem?.id],
    queryFn: async ({ signal }): Promise<User> => {
      const res = await mainInstance.get(
        `/api/users/${selectedItem?.id}/user-roles`,
        { signal },
      );
      return res.data;
    },
    enabled: !!selectedItem && open,
  });

  // FORM
  // form - use form hook
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roles: [],
    },
  });

  // form - state
  const [isLoadingUpdateItem, setIsLoadingUpdateItem] = useState(false);

  // form - set default values
  useEffect(() => {
    if (user) {
      const selectedRoles = user?.rbac_user_roles?.map(
        (role: RbacUserRole) => ({
          label: role.rbac_role?.label,
          value: (role.rbac_role?.id || '').toString(),
        }),
      );

      form.reset({
        roles: selectedRoles || [],
      });
    }
  }, [user, form]);

  // form - submit
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const newData = {
      role_ids: data.roles.map(role => role.value),
    };

    setIsLoadingUpdateItem(true);

    toast.promise(
      mainInstance.patch(`/api/users/${selectedItem?.id}/user-roles`, newData),
      {
        loading: 'Loading...',
        success: () => {
          // refetch
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
        // reset selected item after animation
        setTimeout(() => {
          setSelectedItem(null);
        }, 200);
      }}
    >
      <DialogContent>
        {/* loading skeleton */}
        {isFetching ? (
          <DialogSkeleton
            title={title}
            description={description}
            inputCount={2}
          />
        ) : (
          <Form {...form}>
            {/* update form */}
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
                    {/* user input */}
                    <div className="col-span-12">
                      <Label className="mb-1">User</Label>
                      <Input value={formatName(selectedItem)} readOnly />
                    </div>

                    {/* roles select */}
                    <FormField
                      control={form.control}
                      name="roles"
                      render={({ field }) => (
                        <FormItem className="col-span-12">
                          <FormLabel>Roles</FormLabel>
                          <FormControl>
                            <RolesSelect
                              placeholder="Select roles"
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
                {/* close button */}
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
                {/* submit button */}
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

export default UpdateUserRoles;
