import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaCamera } from 'react-icons/fa6';
import { toast } from 'sonner';
import { z } from 'zod';
import useAuthUserStore from '@/_stores/auth-user-store';
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

// form - form validation
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
  // USER
  // user - use auth user store
  const { user, setUser } = useAuthUserStore();

  // FORM
  // form - use form hook
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

  // form - state
  const [isLoadingUpdateProfile, setIsLoadingUpdateProfile] =
    useState<boolean>(false);

  // form - submit
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsLoadingUpdateProfile(true);

    toast.promise(mainInstance.patch(`/api/users/${user?.id}/profile`, data), {
      loading: 'Loading...',
      success: response => {
        // update user
        setUser(response.data);
        return 'User updated successfully';
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

  // MODAL
  // modal - states
  const [openUploadAvatar, setOpenUploadAvatar] = useState<boolean>(false);

  return (
    <>
      {/* header */}
      <div className="mb-3">
        <PageHeader>Profile</PageHeader>
      </div>

      {/* profile form */}
      <Card className="max-w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* avatar */}
            <CardHeader>
              <div className="flex justify-center">
                <div className="relative aspect-square w-24">
                  {/* avatar image */}
                  <div className="outline-primary border-card flex size-full items-center overflow-hidden rounded-full border-1 outline-2 select-none">
                    <ReactImage
                      className="pointer-events-none size-full object-cover"
                      src={`${import.meta.env.VITE_STORAGE_BASE_URL}/avatars/${user?.avatar}`}
                      // fallback={fallbackImage}
                    />
                  </div>
                  {/* avatar upload button */}
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
                {/* email input */}
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
                {/* first name input */}
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
                {/* middle name input */}
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
                {/* last name input */}
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
                {/* suffix input */}
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
              {/* submit button */}
              <Button type="submit" disabled={isLoadingUpdateProfile}>
                Save
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* modal - upload avatar */}
      <UploadAvatar open={openUploadAvatar} setOpen={setOpenUploadAvatar} />
    </>
  );
};

export default ProfilePage;
