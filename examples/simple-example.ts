import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { diffXlsx, diffXlsxFromBuffer } from '../src/index';

async function createAndTestFiles() {
  console.log('Creating test Excel files...');
  
  // Create first Excel file
  const data1 = [
    ['Name', 'Age', 'City', 'Status'],
    ['John', 25, 'NYC', 'Active'],
    ['Jane', 30, 'LA', 'Active'],
    ['Mike', 28, 'Boston', 'Inactive']
  ];
  
  // Create second Excel file with changes
  const data2 = [
    ['Name', 'Age', 'City', 'Status'],
    ['John', 26, 'NYC', 'Active'],      // Age changed: 25 -> 26
    ['Jane', 30, 'LA', 'Active'],       // No change
    ['Mike', 28, 'Seattle', 'Active'],  // City changed: Boston -> Seattle, Status: Inactive -> Active
    ['Sarah', 32, 'Denver', 'Active']   // New row added
  ];
  
  // Create worksheets and workbooks
  const ws1 = XLSX.utils.aoa_to_sheet(data1);
  const wb1 = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb1, ws1, 'Employees');
  
  const ws2 = XLSX.utils.aoa_to_sheet(data2);
  const wb2 = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb2, ws2, 'Employees');
  
  // Write files
  XLSX.writeFile(wb1, 'test1.xlsx');
  XLSX.writeFile(wb2, 'test2.xlsx');
  
  console.log('✅ Created test1.xlsx and test2.xlsx');
  
  // Test file comparison
  console.log('\n=== Testing File Path Comparison ===');
  const result = await diffXlsx('test1.xlsx', 'test2.xlsx', false);
  console.log(JSON.stringify(result, null, 2));
  
  // Test buffer comparison
  console.log('\n=== Testing Buffer Comparison ===');
  const buffer1 = fs.readFileSync('test1.xlsx');
  const buffer2 = fs.readFileSync('test2.xlsx');
  const bufferResult = await diffXlsxFromBuffer(buffer1, buffer2, true);
  console.log('Buffer comparison result:');
  console.log(`- Modified sheets: ${bufferResult.modified_sheets.length}`);
  console.log(`- Diff items: ${bufferResult.modified_sheets[0]?.diff.length || 0}`);
  
  // Save result to file
  fs.writeFileSync('diff_result.json', JSON.stringify(result, null, 2));
  console.log('\n✅ Saved comparison result to diff_result.json');
  
  // Clean up
  fs.unlinkSync('test1.xlsx');
  fs.unlinkSync('test2.xlsx');
  console.log('✅ Cleaned up test files');
}

// Run the test
createAndTestFiles().catch(console.error);