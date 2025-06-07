import type ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaImages } from 'react-icons/fa6';
import { z } from 'zod';
import InputGroup from '@/components/forms/input-group';
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
import ReactQuillMyDrive from './react-quill-my-drive';

const FormSchema = z.object({
  img_url: z
    .string()
    .min(1, {
      message: 'Required',
    })
    .url(),
  img_width: z.string(),
});

type ReactQuillInsertImageProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  ref: React.RefObject<ReactQuill | null>;
  selection: { index: number; length: number } | null;
};

const ReactQuillInsertImage = ({
  open,
  setOpen,
  ref: quillRef,
  selection,
}: ReactQuillInsertImageProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      img_url: '',
      img_width: '',
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const index = selection?.index ?? quill.getLength();
      const widthAttr = data.img_width ? `width="${data.img_width}"` : '';
      const imgTag = `<img src="${data.img_url}" ${widthAttr} />`;

      quill.clipboard.dangerouslyPasteHTML(index, imgTag);
    }

    form.reset();
    setOpen(false);
  };

  const [openMyDrive, setOpenMyDrive] = useState<boolean>(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="md">
          <Form {...form}>
            <form
              onSubmit={e => {
                e.stopPropagation();
                form.handleSubmit(onSubmit)(e);
              }}
              autoComplete="off"
            >
              <DialogHeader>
                <DialogTitle>Insert Image</DialogTitle>
                <DialogDescription>
                  Enter an image URL and optional dimensions.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <div className="grid grid-cols-12 gap-3">
                  {form.watch('img_url') && (
                    <div className="col-span-12">
                      <img
                        src={form.watch('img_url')}
                        width={form.watch('img_width')}
                        alt="Preview"
                      />
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="img_url"
                    render={({ field }) => (
                      <FormItem className="col-span-12">
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <Input
                              {...field}
                              placeholder="https://www.example.com/image.jpg"
                            />
                            <Button onClick={() => setOpenMyDrive(true)}>
                              <FaImages />
                            </Button>
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="img_width"
                    render={({ field }) => (
                      <FormItem className="col-span-12">
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. 100%" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </DialogBody>
              <DialogFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Insert</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ReactQuillMyDrive open={openMyDrive} setOpen={setOpenMyDrive} />
    </>
  );
};

export default ReactQuillInsertImage;
