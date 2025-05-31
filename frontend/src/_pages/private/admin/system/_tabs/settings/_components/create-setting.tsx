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
import { Textarea } from '@/components/ui/textarea';
import { mainInstance } from '@/instances/main-instance';

// form - form validation
const FormSchema = z.object({
  label: z.string().min(1, {
    message: 'Required',
  }),
  value: z.string().min(1, {
    message: 'Required',
  }),
  notes: z.string(),
});

type CreateSettingProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const CreateSetting = ({ open, setOpen, refetch }: CreateSettingProps) => {
  // FORM
  // form - use form hook
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      label: '',
      value: '',
      notes: '',
    },
  });

  // form - state
  const [isLoadingCreateItem, setIsLoadingCreateItem] = useState(false);

  // form - submit
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const newData = {
      ...data,
    };

    // remove module from payload
    if ('module' in newData) {
      delete (newData as { module?: unknown }).module;
    }

    setIsLoadingCreateItem(true);

    toast.promise(mainInstance.post(`/api/system/settings`, newData), {
      loading: 'Loading...',
      success: () => {
        // refetch
        refetch();
        // reset
        form.reset();
        return 'Setting created successfully';
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
              <DialogTitle>Create Setting</DialogTitle>
              <DialogDescription>
                Please fill in the form below to create a new setting.
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
                        <Input {...field} placeholder="app_current_version" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* value input */}
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1.0.0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* notes input */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Notes" />
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

export default CreateSetting;
