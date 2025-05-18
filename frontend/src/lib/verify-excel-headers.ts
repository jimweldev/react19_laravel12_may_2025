export const verifyExcelHeaders = (
  worksheetData: unknown[],
  templateHeaders: string[],
): boolean => {
  if (worksheetData.length === 0) return false;

  // Extract the headers from the first row (keys of the first object)
  const fileHeaders = Object.keys(worksheetData[0] as object).map(
    header => header.trim().toLowerCase(), // Normalize the headers (trim spaces and lower case)
  );

  // Normalize the template headers similarly
  const normalizedTemplateHeaders = templateHeaders.map(header =>
    header.trim().toLowerCase(),
  );

  // Check if every header in the file is part of the template
  return fileHeaders.every(header =>
    normalizedTemplateHeaders.includes(header),
  );
};
