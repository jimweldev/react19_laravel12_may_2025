import * as XLSX from 'xlsx';

export const generateExcel = (headers: string[], fileName: string): void => {
  const worksheetData = [headers];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
