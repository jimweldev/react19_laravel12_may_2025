import ReactQuill from 'react-quill-new';
import { defaultModules, simpleModules } from '@/configs/react-quill.config';
import 'react-quill-new/dist/quill.snow.css';

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
  const modules = type === 'default' ? defaultModules : simpleModules;

  return (
    <ReactQuill
      className={className}
      theme="snow"
      modules={modules}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default ReactQuillEditor;
