import { useState } from 'react';
import { type FileRejection } from 'react-dropzone';
import CodePreview from '@/components/code/code-preview';
import FileDropzone from '@/components/file-dropzones/file-dropzone';
import PageHeader from '@/components/typography/page-header';
import { handleFileRejections } from '@/lib/handle-file-rejections';

const ReactDropzonePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[] | null>(null);

  const codeStringSingle = `
import { useState } from 'react';
import { type FileRejection } from 'react-dropzone';
import FileDropzone from '@/components/file-dropzones/file-dropzone';
import { handleFileRejections } from '@/lib/handle-file-rejections';

const ReactDropzonePage = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <FileDropzone
      files={file}
      onDrop={(acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        setFile(acceptedFiles[0]);
        handleFileRejections(rejectedFiles);
      }}
      onRemove={() => setFile(null)}
    />
  );
};

export default ReactDropzonePage;
  `.trim();

  const codeStringMultiple = `
import { useState } from 'react';
import { type FileRejection } from 'react-dropzone';
import FileDropzone from '@/components/file-dropzones/file-dropzone';
import { handleFileRejections } from '@/lib/handle-file-rejections';

const ReactDropzonePage = () => {
  const [files, setFiles] = useState<File | null>(null);

  return (
    <FileDropzone
      files={files}
      isMultiple={true}
      onDrop={(acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        setFiles(acceptedFiles);
        handleFileRejections(rejectedFiles);
      }}
      onRemove={(fileToRemove: File) => {
        setFiles((prevFiles: File[] | null) => {
          if (prevFiles) {
            return prevFiles.filter(file => file !== fileToRemove);
          }
          return prevFiles;
        });
      }}
    />
  );
};

export default ReactDropzonePage;
  `.trim();

  return (
    <>
      <PageHeader className="mb-3">React Dropzone</PageHeader>

      <h5 className="text-medium mb-1 font-semibold">Single</h5>
      <CodePreview
        className="mb-6"
        code={codeStringSingle}
        lineNumbers={[10, 11, 12, 13, 14, 15, 16, 17]}
      >
        <FileDropzone
          files={file}
          onDrop={(acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            setFile(acceptedFiles[0]);
            handleFileRejections(rejectedFiles);
          }}
          onRemove={() => setFile(null)}
        />
      </CodePreview>

      <h5 className="text-medium mb-1 font-semibold">Multiple</h5>
      <CodePreview
        code={codeStringMultiple}
        lineNumbers={[
          10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        ]}
      >
        <FileDropzone
          files={files}
          isMultiple={true}
          onDrop={(acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            setFiles(acceptedFiles);
            handleFileRejections(rejectedFiles);
          }}
          onRemove={(fileToRemove: File) => {
            setFiles((prevFiles: File[] | null) => {
              if (prevFiles) {
                return prevFiles.filter(file => file !== fileToRemove);
              }
              return prevFiles;
            });
          }}
        />
      </CodePreview>
    </>
  );
};

export default ReactDropzonePage;
