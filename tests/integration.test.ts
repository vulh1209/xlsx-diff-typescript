import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { diffXlsx, diffXlsxFromBuffer } from '../src/index';

// Helper function to create test Excel file
function createTestExcelFile(data: any[][], filename: string): void {
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, filename);
}

describe('Integration Tests', () => {
  const testDir = path.join(__dirname, '../test-data');
  const file1Path = path.join(testDir, 'test1.xlsx');
  const file2Path = path.join(testDir, 'test2.xlsx');

  beforeAll(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Create test files
    const data1 = [
      ['Name', 'Age', 'City'],
      ['John', 25, 'NYC'],
      ['Jane', 30, 'LA']
    ];

    const data2 = [
      ['Name', 'Age', 'City'],
      ['John', 26, 'NYC'], // Changed age
      ['Jane', 30, 'LA'],
      ['Bob', 35, 'Chicago'] // Added row
    ];

    createTestExcelFile(data1, file1Path);
    createTestExcelFile(data2, file2Path);
  });

  afterAll(() => {
    // Clean up test files
    if (fs.existsSync(file1Path)) fs.unlinkSync(file1Path);
    if (fs.existsSync(file2Path)) fs.unlinkSync(file2Path);
    if (fs.existsSync(testDir)) fs.rmdirSync(testDir);
  });

  test('should compare Excel files from file paths', async () => {
    const result = await diffXlsx(file1Path, file2Path, false);
    
    expect(result).toBeDefined();
    expect(result.added_sheets).toHaveLength(0);
    expect(result.removed_sheets).toHaveLength(0);
    expect(result.modified_sheets).toHaveLength(1);
    expect(result.modified_sheets[0].sheet_name).toBe('Sheet1');
    expect(result.data.old.data).toBeNull(); // rawData = false
  });

  test('should compare Excel files with raw data', async () => {
    const result = await diffXlsx(file1Path, file2Path, true);
    
    expect(result.data.old.data).not.toBeNull();
    expect(result.data.new.data).not.toBeNull();
    expect(result.data.old.data!['Sheet1']).toBeDefined();
    expect(result.data.new.data!['Sheet1']).toBeDefined();
  });

  test('should compare Excel files from buffers', async () => {
    const buffer1 = fs.readFileSync(file1Path);
    const buffer2 = fs.readFileSync(file2Path);
    
    const result = await diffXlsxFromBuffer(buffer1, buffer2, false);
    
    expect(result).toBeDefined();
    expect(result.modified_sheets).toHaveLength(1);
    expect(result.modified_sheets[0].diff.length).toBeGreaterThan(0);
  });

  test('should handle identical files', async () => {
    const result = await diffXlsx(file1Path, file1Path, false);
    
    expect(result.added_sheets).toHaveLength(0);
    expect(result.removed_sheets).toHaveLength(0);
    expect(result.modified_sheets).toHaveLength(0);
    expect(result.no_change_sheets).toHaveLength(1);
    expect(result.no_change_sheets[0]).toBe('Sheet1');
  });
});