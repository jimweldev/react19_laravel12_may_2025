export const verifyExcelHeaders = (
  worksheetData: unknown[],
  templateHeaders: string[],
): boolean => {
  if (worksheetData.length === 0) return false;

  const fileHeaders = Object.keys(worksheetData[0] as object).map(header =>
    header.trim().toLowerCase(),
  );

  const normalizedTemplateHeaders = templateHeaders.map(header =>
    header.trim().toLowerCase(),
  );

  return fileHeaders.every(header =>
    normalizedTemplateHeaders.includes(header),
  );
};
