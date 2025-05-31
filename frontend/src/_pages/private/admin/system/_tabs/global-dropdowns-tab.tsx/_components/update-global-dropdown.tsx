import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { SystemGlobalDropdown } from '@/_types/system-global-dropdown';
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

// form - form validation
const FormSchema = z.object({
  label: z.string().min(1, {
    message: 'Required',
  }),
  module: z.string().min(1, {
    message: 'Required',
  }),
  type: z.string().min(1, {
    message: 'Required',
  }),
});

type UpdateGlobalDropdownProps = {
  selectedItem: User | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<User | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const UpdateGlobalDropdown = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: UpdateGlobalDropdownProps) => {
  const title = 'Update GlobalDropdown';
  const description = 'Update globalDropdown details';

  // QUERY
  // query - use query hook
  const {
    data: systemGlobalDropdown,
    isFetching,
    error,
  } = useQuery<SystemGlobalDropdown>({
    queryKey: ['system/global-dropdowns', 'update', selectedItem?.id],
    queryFn: async ({ signal }): Promise<SystemGlobalDropdown> => {
      const res = await mainInstance.get(
        `/api/system/global-dropdowns/${selectedItem?.id}`,
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
      label: '',
      module: '',
      type: '',
    },
  });

  // form - state
  const [isLoadingUpdateItem, setIsLoadingUpdateItem] = useState(false);

  // form - set default values
  useEffect(() => {
    if (systemGlobalDropdown) {
      form.reset({
        label: systemGlobalDropdown.label || '',
        module: systemGlobalDropdown.module || '',
        type: systemGlobalDropdown.type || '',
      });
    }
  }, [systemGlobalDropdown, form]);

  // form - submit
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const newData = {
      ...data,
    };

    // remove module from payload
    if ('module' in newData) {
      delete (newData as { module?: unknown }).module;
    }

    setIsLoadingUpdateItem(true);

    toast.promise(
      mainInstance.patch(
        `/api/system/global-dropdowns/${selectedItem?.id}`,
        newData,
      ),
      {
        loading: 'Loading...',
        success: () => {
          // refetch
          refetch();
          return 'GlobalDropdown updated successfully';
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
                    {/* label input */}
                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem className="col-span-12">
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Regular" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* value input */}
                    <FormField
                      control={form.control}
                      name="module"
                      render={({ field }) => (
                        <FormItem className="col-span-12">
                          <FormLabel>Module</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="users" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* notes input */}
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="col-span-12">
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="status" />
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

export default UpdateGlobalDropdown;
