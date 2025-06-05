import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { SystemGlobalDropdown } from '@/_types/system-global-dropdown';
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
  module: z.string().min(1, {
    message: 'Required',
  }),
  type: z.string().min(1, {
    message: 'Required',
  }),
});

type UpdateGlobalDropdownProps = {
  selectedItem: SystemGlobalDropdown | null;
  setSelectedItem: React.Dispatch<
    React.SetStateAction<SystemGlobalDropdown | null>
  >;
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
  const description = 'Modify the details of an existing record';

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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      label: '',
      module: '',
      type: '',
    },
  });

  const [isLoadingUpdateItem, setIsLoadingUpdateItem] = useState(false);

  useEffect(() => {
    if (systemGlobalDropdown) {
      form.reset({
        label: systemGlobalDropdown.label || '',
        module: systemGlobalDropdown.module || '',
        type: systemGlobalDropdown.type || '',
      });
    }
  }, [systemGlobalDropdown, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoadingUpdateItem(true);

    toast.promise(
      mainInstance.patch(
        `/api/system/global-dropdowns/${selectedItem?.id}`,
        data,
      ),
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
                            <Input {...field} placeholder="Regular" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

export default UpdateGlobalDropdown;
