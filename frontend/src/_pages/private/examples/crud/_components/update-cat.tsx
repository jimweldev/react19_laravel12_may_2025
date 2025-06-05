import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { Cat } from '@/_types/cat';
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
  name: z.string().min(1, {
    message: 'Required',
  }),
});

type UpdateCatProps = {
  selectedItem: Cat | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<Cat | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const UpdateCat = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: UpdateCatProps) => {
  const title = 'Update Cat';
  const description = 'Modify the details of an existing record';

  const {
    data: cat,
    isFetching,
    error,
  } = useQuery<Cat>({
    queryKey: ['cats', 'update', selectedItem?.id],
    queryFn: async ({ signal }): Promise<Cat> => {
      const res = await mainInstance.get(`/api/cats/${selectedItem?.id}`, {
        signal,
      });
      return res.data;
    },
    enabled: !!selectedItem && open,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });

  const [isLoadingUpdateItem, setIsLoadingUpdateItem] = useState(false);

  useEffect(() => {
    if (cat) {
      form.reset({
        name: cat.name || '',
      });
    }
  }, [cat, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoadingUpdateItem(true);

    toast.promise(mainInstance.patch(`/api/cats/${selectedItem?.id}`, data), {
      loading: 'Loading...',
      success: () => {
        refetch();
        return 'Success!';
      },
      error: error => {
        return (
          error.response?.data?.message || error.message || 'An error occurred'
        );
      },
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
            inputCount={1}
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
                      name="name"
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

export default UpdateCat;
