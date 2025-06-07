import 'react-quill-new/dist/quill.snow.css';
import { FaFilePdf } from 'react-icons/fa6';
import ToolTip from '@/components/tool-tips/tool-tip';
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

type ReactQuillEditorProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ReactQuillMyDrive = ({ open, setOpen }: ReactQuillEditorProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>My Drive</DialogTitle>
          <DialogDescription>Select an image from your Drive</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-2">
              <div className="flex aspect-square w-full items-center justify-center rounded-md border-2">
                <FaFilePdf className="text-4xl text-red-400" />
              </div>
              <ToolTip content="Quitclaim - Jimwel Dizon.pdf">
                <p className="line-clamp-2 text-center text-xs">
                  Quitclaim - Jimwel Dizon.pdf
                </p>
              </ToolTip>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReactQuillMyDrive;
