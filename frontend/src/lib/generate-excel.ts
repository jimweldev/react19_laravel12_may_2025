import * as XLSX from 'xlsx';

export const generateExcel = (headers: string[], fileName: string): void => {
  const worksheetData = [headers];

  // Create a worksheet from the data
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Write the workbook to a file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
