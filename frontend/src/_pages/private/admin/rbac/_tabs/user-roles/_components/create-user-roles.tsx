import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { type ReactSelectOption } from '@/_types/common/react-select';
import RolesSelect from '@/components/react-select/roles-select';
import UsersSelect from '@/components/react-select/users-select';
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
import { mainInstance } from '@/instances/main-instance';

// form - form validation
const FormSchema = z.object({
  user: z.object({
    label: z.string().min(1, {
      message: 'Required',
    }),
    value: z.string().min(1, {
      message: 'Required',
    }),
  }),
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

type CreateUserRolesProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const CreateUserRoles = ({ open, setOpen, refetch }: CreateUserRolesProps) => {
  // FORM
  // form - use form hook
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user: undefined,
      roles: [],
    },
  });

  // form - state
  const [isLoadingCreateItem, setIsLoadingCreateItem] = useState(false);

  // form - submit
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const newData = {
      role_ids: data.roles.map(role => role.value),
    };

    setIsLoadingCreateItem(true);

    toast.promise(
      mainInstance.post(`/api/users/${data.user?.value}/user-roles`, newData),
      {
        loading: 'Loading...',
        success: () => {
          // refetch
          refetch();
          // reset
          form.reset();
          return 'Role created successfully';
        },
        error: error => {
          return (
            error.response?.data?.message ||
            error.message ||
            'An error occurred'
          );
        },
        finally: () => {
          setIsLoadingCreateItem(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {/* create form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
            <DialogHeader>
              <DialogTitle>Create User Role</DialogTitle>
              <DialogDescription>
                Please fill in the form below to create a new user role.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="grid grid-cols-12 gap-3">
                {/* user select */}
                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>User</FormLabel>
                      <FormControl>
                        <UsersSelect
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
            </DialogBody>
            <DialogFooter className="flex justify-end gap-2">
              {/* close button */}
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              {/* submit button */}
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

export default CreateUserRoles;
