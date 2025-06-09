import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaCamera } from 'react-icons/fa6';
import { toast } from 'sonner';
import { z } from 'zod';
import useAuthUserStore from '@/_stores/auth-user-store';
import fallbackImage from '@/assets/images/default-avatar.png';
import ReactImage from '@/components/images/react-image';
import PageHeader from '@/components/typography/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card';
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
import UploadAvatar from './_components/upload-avatar';

const FormSchema = z.object({
  email: z.string().min(1, {
    message: 'Required',
  }),
  first_name: z.string().min(1, {
    message: 'Required',
  }),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, {
    message: 'Required',
  }),
  suffix: z.string().optional(),
});

const ProfilePage = () => {
  const { user, setUser } = useAuthUserStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: user?.email || '',
      first_name: user?.first_name || '',
      middle_name: user?.middle_name || '',
      last_name: user?.last_name || '',
      suffix: user?.suffix || '',
    },
  });

  const [isLoadingUpdateProfile, setIsLoadingUpdateProfile] =
    useState<boolean>(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoadingUpdateProfile(true);

    toast.promise(mainInstance.patch(`/api/settings/profile`, data), {
      loading: 'Loading...',
      success: response => {
        setUser(response.data);
        return 'Success!';
      },
      error: error => {
        return (
          error.response?.data?.message || error.message || 'An error occurred'
        );
      },
      finally: () => {
        setIsLoadingUpdateProfile(false);
      },
    });
  };

  const [openUploadAvatar, setOpenUploadAvatar] = useState<boolean>(false);

  return (
    <>
      <div className="mb-3">
        <PageHeader>Profile</PageHeader>
      </div>

      <Card className="max-w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <div className="flex justify-center">
                <div className="relative aspect-square w-24">
                  <div className="outline-primary border-card flex size-full items-center overflow-hidden rounded-full border-1 outline-2 select-none">
                    <ReactImage
                      className="pointer-events-none size-full object-cover"
                      src={`${import.meta.env.VITE_STORAGE_BASE_URL}/${user?.avatar_path}`}
                      alt="Avatar"
                      unloaderSrc={fallbackImage}
                    />
                  </div>

                  <Button
                    className="border-card absolute right-0 bottom-0 rounded-full border-2"
                    variant="default"
                    size="xs"
                    onClick={() => setOpenUploadAvatar(true)}
                  >
                    <FaCamera />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-12 gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middle_name"
                  render={({ field }) => (
                    <FormItem className="col-span-5">
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="col-span-5">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="suffix"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Suffix</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardBody>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoadingUpdateProfile}>
                Save
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <UploadAvatar open={openUploadAvatar} setOpen={setOpenUploadAvatar} />
    </>
  );
};

export default ProfilePage;
