import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { MailTemplate } from '@/_types/mail-template';
import ErrorDialog from '@/components/errors/error-dialog';
import IframePreview from '@/components/iframe/iframe-preview';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { mainInstance } from '@/instances/main-instance';

const FormSchema = z.object({
  label: z.string().min(1, {
    message: 'Required',
  }),
  content: z.string().min(1, {
    message: 'Required',
  }),
});

type UpdateMailTemplateProps = {
  selectedItem: MailTemplate | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<MailTemplate | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const UpdateMailTemplate = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: UpdateMailTemplateProps) => {
  const title = 'Update Mail Template';
  const description = 'Modify the details of an existing record';

  const {
    data: mailTemplate,
    isFetching,
    error,
  } = useQuery<MailTemplate>({
    queryKey: ['mail/templates', 'update', selectedItem?.id],
    queryFn: async ({ signal }): Promise<MailTemplate> => {
      const res = await mainInstance.get(
        `/api/mails/templates/${selectedItem?.id}`,
        {
          signal,
        },
      );
      return res.data;
    },
    enabled: !!selectedItem && open,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      label: '',
      content: '',
    },
  });

  const [isLoadingUpdateItem, setIsLoadingUpdateItem] = useState(false);

  useEffect(() => {
    if (mailTemplate) {
      form.reset({
        label: mailTemplate.label || '',
        content: mailTemplate.content || '',
      });
    }
  }, [mailTemplate, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoadingUpdateItem(true);

    toast.promise(
      mainInstance.patch(`/api/mails/templates/${selectedItem?.id}`, data),
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
      <DialogContent size="xl">
        {isFetching ? (
          <DialogSkeleton
            title={title}
            description={description}
            inputCount={1}
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
              <Tabs defaultValue="form">
                <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <TabsList variant="outline">
                  <TabsTrigger value="form">Form</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>
                <DialogBody>
                  {error ? (
                    <ErrorDialog error={error} />
                  ) : (
                    <>
                      <TabsContent value="form">
                        <div className="grid grid-cols-12 gap-3">
                          <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                              <FormItem className="col-span-12">
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="welcome_template"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem className="col-span-12">
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder={`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome Template</title>
  </head>
  <body>

  </body>
</html>
                                    `.trim()}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                      <TabsContent value="output">
                        <IframePreview htmlContent={form.watch('content')} />
                      </TabsContent>
                    </>
                  )}
                </DialogBody>

                <DialogFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Close
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoadingUpdateItem || !!error}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </Tabs>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMailTemplate;
