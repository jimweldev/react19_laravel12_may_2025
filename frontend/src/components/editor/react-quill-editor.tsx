import { useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { defaultModules, simpleModules } from '@/configs/react-quill.config';
import 'react-quill-new/dist/quill.snow.css';
import ReactQuillInsertImage from './_components/react-quill-insert-image';

// Define type for Quill instance
type QuillEditor = ReactQuill & {
  getEditor: () => ReactQuill;
};

interface ReactQuillEditorProps {
  type?: 'default' | 'simple';
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ReactQuillEditor = ({
  type = 'default',
  value,
  onChange,
  placeholder,
  className = '',
}: ReactQuillEditorProps) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selection, setSelection] = useState<ReactQuill.Range | null>(null);

  const quillRef = useRef<QuillEditor | null>(null);

  const modules = useMemo(
    () => ({
      ...(type === 'default' ? defaultModules : simpleModules),
      toolbar: {
        ...(type === 'default' ? defaultModules : simpleModules).toolbar,
        handlers: {
          image: () => {
            if (quillRef.current) {
              const quill = quillRef.current.getEditor();
              const range = quill.getSelection();
              if (range) setSelection(range);
              setShowImageDialog(true);
            }
          },
        },
      },
    }),
    [type],
  );

  return (
    <>
      <ReactQuill
        ref={quillRef}
        className={className}
        theme="snow"
        modules={modules}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {/* Insert image dialog */}
      <ReactQuillInsertImage
        open={showImageDialog}
        setOpen={setShowImageDialog}
        selection={selection}
        ref={quillRef}
      />
    </>
  );
};

export default ReactQuillEditor;
