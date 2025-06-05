import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import useAuthUserStore from '@/_stores/auth-user-store';
import PageHeader from '@/components/typography/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter } from '@/components/ui/card';
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

const FormSchema = z
  .object({
    current_password: z.string().min(1, {
      message: 'Required',
    }),
    new_password: z.string().min(1, {
      message: 'Required',
    }),
    confirm_new_password: z.string().min(1, {
      message: 'Required',
    }),
  })
  .refine(data => data.new_password === data.confirm_new_password, {
    message: 'Passwords do not match',
    path: ['confirm_new_password'],
  });

const PasswordPage = () => {
  const { user } = useAuthUserStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_new_password: '',
    },
  });

  const [isLoadingChangePassword, setIsLoadingChangePassword] =
    useState<boolean>(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoadingChangePassword(true);

    toast.promise(
      mainInstance.patch(`/api/users/${user?.id}/change-password`, data),
      {
        loading: 'Loading...',
        success: () => {
          form.reset();
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
          setIsLoadingChangePassword(false);
        },
      },
    );
  };

  return (
    <>
      <div className="mb-3">
        <PageHeader>Password</PageHeader>
      </div>

      <Card className="max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardBody>
              <div className="grid grid-cols-12 gap-3">
                <FormField
                  control={form.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm_new_password"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardBody>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoadingChangePassword}>
                Save
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default PasswordPage;
