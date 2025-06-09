import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { Gallery } from '@/_types/gallery';
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
  file_name: z.string().min(1, {
    message: 'Required',
  }),
  file_extension: z.string().min(1, {
    message: 'Required',
  }),
});

type RenameImageProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
  selectedItem: Gallery;
};

const RenameImage = ({
  open,
  setOpen,
  refetch,
  selectedItem,
}: RenameImageProps) => {
  const title = 'Rename Image';
  const description = 'Rename this image';

  const {
    data: image,
    isFetching,
    error,
  } = useQuery<Gallery>({
    queryKey: ['gallerys', 'update', selectedItem?.id],
    queryFn: async ({ signal }): Promise<Gallery> => {
      const res = await mainInstance.get(`/api/galleries/${selectedItem?.id}`, {
        signal,
      });
      return res.data;
    },
    enabled: !!selectedItem && open,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file_name: '',
      file_extension: '',
    },
  });

  useEffect(() => {
    if (image) {
      const [name, extension] = (image?.file_name || '').split(/\.(?=[^.]+$)/);

      form.reset({
        file_name: name || '',
        file_extension: extension || '',
      });
    }
  }, [image, form]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    toast.promise(
      mainInstance.patch(`/api/galleries/${image?.id}`, {
        file_name: `${data.file_name}.${data.file_extension}`,
      }),
      {
        loading: 'Loading...',
        success: () => {
          refetch();
          setOpen(false);
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
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {isFetching ? (
          <DialogSkeleton
            title={title}
            description={description}
            inputCount={1}
          />
        ) : (
          <Form {...form}>
            <form
              onSubmit={e => {
                e.stopPropagation();
                form.handleSubmit(onSubmit)(e);
              }}
              autoComplete="off"
            >
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
                      name="file_name"
                      render={({ field }) => (
                        <FormItem className="col-span-9">
                          <FormLabel>File Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="example" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="file_extension"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>Extension</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="jpg" readOnly />
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
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Rename
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RenameImage;
