export const defaultModules = {
  toolbar: [
    [{ size: ['small', false, 'large'] }], // Font size
    ['bold', 'italic', 'underline'], // Basic formatting
    [{ script: 'sub' }, { script: 'super' }], // Subscript/Superscript
    [{ color: [] }, { background: [] }], // Color and background
    [{ list: 'ordered' }, { list: 'bullet' }], // Lists
    [{ indent: '-1' }, { indent: '+1' }], // Indentation
    ['link'], // Link
    ['clean'], // Remove formatting
  ],
};

export const simpleModules = {
  toolbar: [
    ['bold', 'italic', 'underline'], // Basic formatting
    [{ list: 'ordered' }, { list: 'bullet' }], // Lists
    ['clean'], // Remove formatting
  ],
};
