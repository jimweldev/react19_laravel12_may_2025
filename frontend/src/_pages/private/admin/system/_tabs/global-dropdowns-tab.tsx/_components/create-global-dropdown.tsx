import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
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

type CreateGlobalDropdownProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const CreateGlobalDropdown = ({
  open,
  setOpen,
  refetch,
}: CreateGlobalDropdownProps) => {
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
  const [isLoadingCreateItem, setIsLoadingCreateItem] = useState(false);

  // form - submit
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoadingCreateItem(true);

    toast.promise(mainInstance.post(`/api/system/global-dropdowns`, data), {
      loading: 'Loading...',
      success: () => {
        // refetch
        refetch();
        // reset
        form.reset();
        return 'GlobalDropdown created successfully';
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
        {/* create form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
            <DialogHeader>
              <DialogTitle>Create GlobalDropdown</DialogTitle>
              <DialogDescription>
                Please fill in the form below to create a new globalDropdown.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
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

export default CreateGlobalDropdown;
