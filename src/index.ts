import { loadWorkbook, FileLike } from './parse';
import { myersDiff } from './diff';
import { 
  DiffResult, 
  CalamineWorkbook, 
  ModifiedSheet, 
  OriginData,
  OriginWorkbookData,
  SerializableData
} from './types';

/**
 * Compare two XLSX files and return the differences
 * @param oldFilePath Path to the old XLSX file
 * @param newFilePath Path to the new XLSX file  
 * @param rawData Whether to include raw sheet data in the result
 * @returns Promise resolving to diff result
 */
export async function diffXlsx(
  oldFilePath: string,
  newFilePath: string,
  rawData: boolean = false
): Promise<DiffResult> {
  const wbOld = loadWorkbook(oldFilePath);
  const wbNew = loadWorkbook(newFilePath);
  return buildDiff(wbOld, wbNew, rawData);
}

/**
 * Compare two XLSX files from buffers and return the differences
 * @param oldFile Buffer containing the old XLSX file
 * @param newFile Buffer containing the new XLSX file
 * @param rawData Whether to include raw sheet data in the result
 * @returns Promise resolving to diff result
 */
export async function diffXlsxFromBuffer(
  oldFile: Buffer,
  newFile: Buffer,
  rawData: boolean = false
): Promise<DiffResult> {
  const wbOld = loadWorkbook(oldFile);
  const wbNew = loadWorkbook(newFile);
  return buildDiff(wbOld, wbNew, rawData);
}

/**
 * Build diff result from two workbooks
 * Core logic equivalent to the Rust build_diff function
 */
function buildDiff(
  wbOld: CalamineWorkbook,
  wbNew: CalamineWorkbook,
  rawData: boolean
): DiffResult {
  const modifiedSheets: ModifiedSheet[] = [];
  const noChangeSheets: string[] = [];

  // Find added and removed sheets
  const addedSheets = wbNew.sheet_names.filter(
    sheetName => !wbOld.sheet_names.includes(sheetName)
  );
  
  const removedSheets = wbOld.sheet_names.filter(
    sheetName => !wbNew.sheet_names.includes(sheetName)
  );

  // Compare sheets that exist in both workbooks
  for (const sheetName of wbOld.sheet_names) {
    if (wbNew.sheet_names.includes(sheetName)) {
      const oldSheetData = wbOld.data[sheetName];
      const newSheetData = wbNew.data[sheetName];
      
      const diff = myersDiff(oldSheetData, newSheetData);
      
      // Filter out diff operations where the value contains only null values
      const filteredDiff = diff.filter(op => {
        if (Array.isArray(op.value)) {
          return op.value.some(cell => cell !== null && cell !== undefined && cell !== '');
        }
        return op.value !== null && op.value !== undefined && op.value !== '';
      });
      
      if (filteredDiff.length === 0) {
        noChangeSheets.push(sheetName);
      } else {
        modifiedSheets.push({
          sheet_name: sheetName,
          diff: filteredDiff
        });
      }
    }
  }

  return {
    added_sheets: addedSheets,
    removed_sheets: removedSheets,
    modified_sheets: modifiedSheets,
    no_change_sheets: noChangeSheets,
    data: {
      old: {
        sheet_names: wbOld.sheet_names,
        data: rawData ? wbOld.data : null
      },
      new: {
        sheet_names: wbNew.sheet_names,
        data: rawData ? wbNew.data : null
      }
    }
  };
}

// Export types for consumers
export * from './types';
export { loadWorkbook } from './parse';
export { myersDiff } from './diff';