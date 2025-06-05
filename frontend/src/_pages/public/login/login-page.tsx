import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import useAuthUserStore from '@/_stores/auth-user-store';
import InstallPWAButton from '@/components/pwa/install-pwa-button';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { publicInstance } from '@/instances/public-instance';
import GoogleLogin from './_components/google-login';

const FormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Required.',
    })
    .email({
      message: 'Invalid email address.',
    }),
  password: z.string().min(1, {
    message: 'Required.',
  }),
});

const LoginPage = () => {
  const { setAuthUser } = useAuthUserStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    toast.promise(publicInstance.post('/api/auth/login', data), {
      loading: 'Loading...',
      success: response => {
        setAuthUser(response.data.user, response.data.access_token);
        return `Success!`;
      },
      error: error => {
        return (
          error.response?.data?.message || error.message || 'An error occurred'
        );
      },
      finally: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="relative container h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="bg-primary relative hidden h-full flex-col items-center justify-center p-10 text-white lg:flex dark:border-r">
        <div className="flex max-w-[350px] flex-col items-center gap-4">
          <img
            className="max-w-[200px]"
            src="/images/app-logo.jpg"
            alt="logo"
          />
          <InstallPWAButton />
        </div>
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 p-8 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          {...field}
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          autoComplete="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full" type="submit" disabled={isLoading}>
                  Login
                </Button>

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-background text-muted-foreground relative z-10 px-2 text-xs">
                    OR
                  </span>
                </div>

                <GoogleLogin />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
