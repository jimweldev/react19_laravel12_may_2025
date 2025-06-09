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

const FormSchema = z.object({
  mail_template_id: z
    .string()
    .regex(/^\d+$/, { message: 'Invalid Number' })
    .min(1, {
      message: 'Required',
    }),
  user_id: z.string().regex(/^\d+$/, { message: 'Invalid Number' }).min(1, {
    message: 'Required',
  }),
  recipient_email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, {
      message: 'Required',
    }),
  sender_email: z.string().email({ message: 'Invalid email address' }).min(1, {
    message: 'Required',
  }),

  cc: z.string().refine(
    data => {
      try {
        if (data === '') {
          return true;
        }
        JSON.parse(data);
        return true;
      } catch (_e) {
        return false;
      }
    },
    {
      message: 'Invalid JSON',
    },
  ),
  bcc: z.string().refine(
    data => {
      try {
        if (data === '') {
          return true;
        }
        JSON.parse(data);
        return true;
      } catch (_e) {
        return false;
      }
    },
    {
      message: 'Invalid JSON',
    },
  ),
  subject: z.string().min(1, {
    message: 'Required',
  }),
  content_data: z
    .string()
    .min(1, {
      message: 'Required',
    })
    .refine(
      data => {
        try {
          JSON.parse(data);
          return true;
        } catch (_e) {
          return false;
        }
      },
      {
        message: 'Invalid JSON',
      },
    ),
});

type CreateMailLogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const CreateMailLog = ({ open, setOpen, refetch }: CreateMailLogProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mail_template_id: '',
      user_id: '',
      recipient_email: '',
      sender_email: '',
      cc: '',
      bcc: '',
      subject: '',
      content_data: '',
    },
  });

  const [isLoadingCreateItem, setIsLoadingCreateItem] = useState(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoadingCreateItem(true);

    toast.promise(mainInstance.post(`/api/mails/logs`, data), {
      loading: 'Loading...',
      success: () => {
        refetch();

        form.reset();
        return 'Success!';
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
            <DialogHeader>
              <DialogTitle>Create Mail Log</DialogTitle>
              <DialogDescription>
                Please fill in the form below to create a new record
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="grid grid-cols-12 gap-3">
                <FormField
                  control={form.control}
                  name="mail_template_id"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Template ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipient_email"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Recipient Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="me@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sender_email"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Sender Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="me@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cc"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>CC</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={`["me@example.com"]`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bcc"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>BCC</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={`["me@example.com"]`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Onboarding" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content_data"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Content Data</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={`
{
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg"
}
                          `.trim()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DialogBody>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>

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

export default CreateMailLog;
