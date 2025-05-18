import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mainInstance } from '@/instances/main-instance';

// form - form validation
const FormSchema = z.object({
  email: z.string().min(1, { message: 'Required' }),
  first_name: z.string().min(1, { message: 'Required' }),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, { message: 'Required' }),
  suffix: z.string().optional(),
  is_admin: z.string().min(1, { message: 'Required' }),
  account_type: z.string().min(1, { message: 'Required' }),
});

type UpdateUserProps = {
  selectedItem: User | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<User | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const UpdateUser = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: UpdateUserProps) => {
  // dialog content
  const title = 'Update User';
  const description = 'Modify the details of an existing user account.';

  // QUERY
  // query - fetch user details
  const {
    data: user,
    isFetching,
    error,
  } = useQuery<User>({
    queryKey: ['users', 'update-user', selectedItem?.id],
    queryFn: async ({ signal }): Promise<User> => {
      const res = await mainInstance.get(`/api/users/${selectedItem?.id}`, {
        signal,
      });
      return res.data;
    },
    enabled: !!selectedItem && open,
  });

  // FORM
  // form - use form hook
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      suffix: '',
      is_admin: '0',
      account_type: 'Main',
    },
  });

  // form - state
  const [isLoadingUpdateItem, setIsLoadingUpdateItem] = useState(false);

  // form - reset when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email || '',
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        last_name: user.last_name || '',
        suffix: user.suffix || '',
        is_admin: user.is_admin?.toString() || '0',
        account_type: user.account_type || 'Main',
      });
    }
  }, [user, form]);

  // form - submit
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoadingUpdateItem(true);

    toast.promise(mainInstance.patch(`/api/users/${selectedItem?.id}`, data), {
      loading: 'Loading...',
      success: () => {
        // refetch
        refetch();
        return 'User updated successfully';
      },
      error: error =>
        error.response?.data?.message || error.message || 'An error occurred',
      finally: () => {
        setIsLoadingUpdateItem(false);
      },
    });
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
        {/* show skeleton while fetching */}
        {isFetching ? (
          <DialogSkeleton
            title={title}
            description={description}
            inputCount={3}
          />
        ) : (
          <Form {...form}>
            {/* update form */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>

              <DialogBody>
                {error ? (
                  <ErrorDialog error={error} />
                ) : (
                  <div className="grid grid-cols-12 gap-3">
                    {/* first name field */}
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem className="col-span-12">
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* middle name field */}
                    <FormField
                      control={form.control}
                      name="middle_name"
                      render={({ field }) => (
                        <FormItem className="col-span-5">
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* last name field */}
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem className="col-span-5">
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* suffix field */}
                    <FormField
                      control={form.control}
                      name="suffix"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Suffix</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* email field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="col-span-6">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* admin role field */}
                    <FormField
                      control={form.control}
                      name="is_admin"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>Admin</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a value" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0">No</SelectItem>
                                <SelectItem value="1">Yes</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* account type field */}
                    <FormField
                      control={form.control}
                      name="account_type"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>Account Type</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a value" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Main">Main</SelectItem>
                              </SelectContent>
                            </Select>
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

export default UpdateUser;
