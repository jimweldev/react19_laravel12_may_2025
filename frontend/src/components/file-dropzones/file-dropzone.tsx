import { CloudUploadIcon, Paperclip, Trash2 } from 'lucide-react';
import Dropzone from 'react-dropzone';

// example usage
// for single file
// const [file, setFile] = useState<File | null>(null);
// <FileDropzone
//  files={file}
//  accept={{
//   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
//     [],
//  }}
//  onDrop={(acceptedFiles: File[]) => {
//   setFile(acceptedFiles[0]);
//  }}
//  onRemove={() => setFile(null)}
// />

// for multiple files
// const [files, setFiles] = useState<File[] | null>(null);
// <FileDropzone
//   files={files}
//   isMultiple={true}
//   onDrop={(acceptedFiles: File[]) => {
//     setFiles(acceptedFiles);
//   }}
//   onRemove={(fileToRemove: File) => {
//     setFiles((prevFiles: File[] | null) => {
//       if (prevFiles) {
//         return prevFiles.filter(file => file !== fileToRemove);
//       }
//       return prevFiles;
//     });
//   }}
// />

interface FileDropzoneProps
  extends React.ComponentPropsWithoutRef<typeof Dropzone> {
  files?: File | File[] | null;
  isMultiple?: boolean;
  onRemove?: (file: File) => void; // Pass the file to remove
}

const FileDropzone = ({
  files,
  isMultiple = false,
  onRemove,
  ...props
}: FileDropzoneProps) => {
  return (
    <Dropzone multiple={isMultiple} {...props}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div className="space-y-2">
          <div
            className={`hover:bg-muted flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center ${
              isDragActive
                ? 'border-primary text-primary'
                : 'text-muted-foreground border-muted-foreground'
            } `}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon size={40} />
            <p>
              {isDragActive ? (
                <span>Drop the file{isMultiple ? 's' : ''} here...</span>
              ) : (
                <span>
                  Drag and drop file{isMultiple ? 's' : ''} here, or click to
                  select file{isMultiple ? 's' : ''}
                </span>
              )}
            </p>
          </div>

          {files && (
            <ul className="space-y-2">
              {Array.isArray(files) ? (
                files.map((file, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex items-center justify-between text-xs"
                  >
                    <h6 className="flex items-center gap-1">
                      <Paperclip size={12} />
                      <span>
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </h6>
                    <button
                      className="rounded p-1 hover:bg-red-100 hover:text-red-500"
                      type="button"
                      onClick={() => onRemove?.(file)} // Pass the file to remove
                    >
                      <Trash2 size={12} />
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground flex items-center justify-between text-xs">
                  <h6 className="flex items-center gap-1">
                    <Paperclip size={12} />
                    <span>
                      {files.name} ({(files.size / 1024).toFixed(2)} KB)
                    </span>
                  </h6>
                  <button
                    className="rounded p-1 hover:bg-red-100 hover:text-red-500"
                    type="button"
                    onClick={() => onRemove?.(files)} // Pass the single file to remove
                  >
                    <Trash2 size={12} />
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default FileDropzone;
