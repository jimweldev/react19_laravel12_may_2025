import 'react-quill-new/dist/quill.snow.css';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FileRejection } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import FileDropzone from '@/components/file-dropzones/file-dropzone';
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
import { handleFileRejections } from '@/lib/handle-file-rejections';

const FormSchema = z.object({
  file_name: z.string().min(1, {
    message: 'Required',
  }),
  file_extension: z.string().min(1, {
    message: 'Required',
  }),
});

type ReactQuillEditorProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
};

const UploadImage = ({ open, setOpen, refetch }: ReactQuillEditorProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file_name: '',
      file_extension: '',
    },
  });

  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!file) {
      toast.error('Please select a file.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('file_name', `${data.file_name}.${data.file_extension}`);

    toast.promise(
      mainInstance.post(`/api/galleries`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      {
        loading: 'Loading...',
        success: () => {
          refetch();
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
          setIsLoading(false);
        },
      },
    );
  };

  const handleFileSelect = (
    acceptedFiles: File[],
    rejectedFiles: FileRejection[],
  ) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);

      const [name, extension] = selectedFile.name.split(/\.(?=[^.]+$)/);
      form.setValue('file_name', name);
      form.setValue('file_extension', extension);
    }

    handleFileRejections(rejectedFiles);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={e => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            autoComplete="off"
          >
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
              <DialogDescription>
                Upload image to your Gallery
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="grid grid-cols-12 gap-3">
                <FormItem className="col-span-12">
                  <FormLabel>Image</FormLabel>
                  <FileDropzone
                    files={file}
                    onDrop={handleFileSelect}
                    onRemove={() => {
                      setFile(null);
                      form.setValue('file_name', '');
                      form.setValue('file_extension', '');
                    }}
                    accept={{
                      'image/*': [],
                    }}
                  />
                </FormItem>

                {file ? (
                  <>
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
                  </>
                ) : null}
              </div>
            </DialogBody>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImage;
