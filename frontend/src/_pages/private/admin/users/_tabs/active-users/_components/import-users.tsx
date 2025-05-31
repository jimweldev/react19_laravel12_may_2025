import { useState } from 'react';
import { type FileRejection } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
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
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { mainInstance } from '@/instances/main-instance';
import { generateExcel } from '@/lib/generate-excel';
import { handleFileRejections } from '@/lib/handle-file-rejections';
import { verifyExcelHeaders } from '@/lib/verify-excel-headers';

// Template headers for the import file
const templateHeaders = [
  'Email',
  'First Name',
  'Middle Name',
  'Last Name',
  'Suffix',
];

type ImportUsersProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const ImportUsers = ({ open, setOpen, refetch }: ImportUsersProps) => {
  // FORM
  // form - use form hook
  const form = useForm();
  // form - state
  const [isLoadingImportItems, setIsLoadingImportItems] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // form - submit
  const onSubmit = () => {
    if (!file) {
      toast.error('Please select a file to import.');
      return;
    }

    // Read and process excel file
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const worksheetData = XLSX.utils.sheet_to_json(worksheet);

      // Verify excel headers match template
      if (!verifyExcelHeaders(worksheetData, templateHeaders)) {
        toast.error('The file headers do not match the required template.');
        return;
      }

      const payload = {
        data: worksheetData,
      };

      setIsLoadingImportItems(true);

      // Submit import request
      toast.promise(mainInstance.post(`/api/users/import`, payload), {
        loading: 'Loading...',
        success: () => {
          // refetch
          refetch();
          // reset
          setFile(null);
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
          setIsLoadingImportItems(false);
        },
      });
    };
    reader.readAsArrayBuffer(file);
  };

  // Generate template handler
  const handleGenerateImportUsersTemplate = () => {
    generateExcel(templateHeaders, 'Import Users Template');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {/* import form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Import Users</DialogTitle>
              <DialogDescription>
                Upload a file to import multiple users into the system.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <FormItem>
                {/* file input */}
                <FormLabel>File</FormLabel>
                <FileDropzone
                  files={file}
                  accept={{
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                      [],
                  }}
                  onDrop={(
                    acceptedFiles: File[],
                    rejectedFiles: FileRejection[],
                  ) => {
                    setFile(acceptedFiles[0]);
                    handleFileRejections(rejectedFiles);
                  }}
                  onRemove={() => setFile(null)}
                />

                {/* template download button */}
                <div className="flex justify-end">
                  <Button
                    className="px-0"
                    variant="link"
                    size="sm"
                    type="button"
                    onClick={handleGenerateImportUsersTemplate}
                  >
                    Download Template
                  </Button>
                </div>
              </FormItem>
            </DialogBody>
            <DialogFooter className="flex justify-end gap-2">
              {/* close button */}
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              {/* submit button */}
              <Button type="submit" disabled={isLoadingImportItems}>
                Import
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ImportUsers;
