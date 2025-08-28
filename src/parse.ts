import * as XLSX from 'xlsx';
import { CalamineWorkbook, SerializableData, WorkbookData } from './types';

export type FileLike = string | Buffer;

/**
 * Load workbook from file path or buffer
 * Equivalent to the Rust load_workbook function
 */
export function loadWorkbook(fileLike: FileLike): CalamineWorkbook {
  let workbook: XLSX.WorkBook;
  
  if (typeof fileLike === 'string') {
    // Load from file path
    workbook = XLSX.readFile(fileLike);
  } else {
    // Load from buffer
    workbook = XLSX.read(fileLike);
  }
  
  const sheetNames = workbook.SheetNames;
  const data: WorkbookData = {};
  
  for (const sheetName of sheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    data[sheetName] = parseWorksheet(worksheet);
  }
  
  return {
    sheet_names: sheetNames,
    data
  };
}

/**
 * Parse a worksheet into a 2D array of SerializableData
 * Equivalent to the Rust parsing logic with optimization for empty rows
 */
function parseWorksheet(worksheet: XLSX.WorkSheet): SerializableData[][] {
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
  const result: SerializableData[][] = [];
  
  for (let row = range.s.r; row <= range.e.r; row++) {
    const rowData: SerializableData[] = [];
    let hasData = false;
    
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];
      
      if (cell) {
        const cellValue = convertCellValue(cell);
        rowData.push(cellValue);
        if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
          hasData = true;
        }
      } else {
        rowData.push(null);
      }
    }
    
    // Only add rows that have at least one non-null, non-empty value
    // This matches the behavior of the Rust calamine parser more closely
    if (hasData) {
      result.push(rowData);
    }
  }
  
  return result;
}

/**
 * Convert XLSX cell value to SerializableData
 * Handles different cell types similar to the Rust implementation
 */
function convertCellValue(cell: XLSX.CellObject): SerializableData {
  switch (cell.t) {
    case 'n': // number
      return cell.v as number;
    case 's': // string
      return cell.v as string;
    case 'b': // boolean
      return cell.v as boolean;
    case 'e': // error
      return null;
    case 'd': // date
      return cell.v ? cell.v.toString() : null;
    case 'z': // blank
      return null;
    default:
      return cell.v ? String(cell.v) : null;
  }
}