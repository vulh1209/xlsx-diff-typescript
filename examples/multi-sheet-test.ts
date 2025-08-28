import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { diffXlsx } from '../src/index';

async function testMultipleSheets() {
  console.log('Testing multiple sheets scenario...');
  
  // Create first workbook with 3 sheets
  const wb1 = XLSX.utils.book_new();
  
  // Sheet1 - Employees
  const employees1 = [
    ['Name', 'Department'],
    ['Alice', 'HR'],
    ['Bob', 'IT']
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(employees1);
  XLSX.utils.book_append_sheet(wb1, ws1, 'Employees');
  
  // Sheet2 - Products (will be unchanged)
  const products = [
    ['Product', 'Price'],
    ['Laptop', 1000],
    ['Mouse', 25]
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(products);
  XLSX.utils.book_append_sheet(wb1, ws2, 'Products');
  
  // Sheet3 - Orders (will be removed in second file)
  const orders = [
    ['Order ID', 'Amount'],
    ['001', 500],
    ['002', 750]
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(orders);
  XLSX.utils.book_append_sheet(wb1, ws3, 'Orders');
  
  // Create second workbook
  const wb2 = XLSX.utils.book_new();
  
  // Sheet1 - Employees (modified)
  const employees2 = [
    ['Name', 'Department', 'Salary'], // Added column
    ['Alice', 'HR', 60000],
    ['Bob', 'IT', 80000],
    ['Charlie', 'Marketing', 70000]   // Added employee
  ];
  const ws1_mod = XLSX.utils.aoa_to_sheet(employees2);
  XLSX.utils.book_append_sheet(wb2, ws1_mod, 'Employees');
  
  // Sheet2 - Products (unchanged)
  const ws2_same = XLSX.utils.aoa_to_sheet(products);
  XLSX.utils.book_append_sheet(wb2, ws2_same, 'Products');
  
  // Sheet3 - Orders removed, Sheet4 - Customers added
  const customers = [
    ['Customer', 'Location'],
    ['ACME Corp', 'New York'],
    ['Global Inc', 'London']
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(customers);
  XLSX.utils.book_append_sheet(wb2, ws4, 'Customers');
  
  // Write files
  XLSX.writeFile(wb1, 'multi1.xlsx');
  XLSX.writeFile(wb2, 'multi2.xlsx');
  
  console.log('✅ Created multi-sheet test files');
  
  // Compare files
  const result = await diffXlsx('multi1.xlsx', 'multi2.xlsx', false);
  
  console.log('\n=== Multi-Sheet Comparison Results ===');
  console.log(`Added sheets: ${result.added_sheets.join(', ') || 'None'}`);
  console.log(`Removed sheets: ${result.removed_sheets.join(', ') || 'None'}`);
  console.log(`Unchanged sheets: ${result.no_change_sheets.join(', ') || 'None'}`);
  console.log(`Modified sheets: ${result.modified_sheets.map(s => s.sheet_name).join(', ') || 'None'}`);
  
  // Show detailed diff for modified sheet
  if (result.modified_sheets.length > 0) {
    const employeesDiff = result.modified_sheets.find(s => s.sheet_name === 'Employees');
    if (employeesDiff) {
      console.log(`\nEmployees sheet has ${employeesDiff.diff.length} changes:`);
      employeesDiff.diff.forEach((item, i) => {
        console.log(`  ${i + 1}. ${item.op}: ${JSON.stringify(item.value).substring(0, 50)}...`);
      });
    }
  }
  
  // Clean up
  fs.unlinkSync('multi1.xlsx');
  fs.unlinkSync('multi2.xlsx');
  console.log('\n✅ Cleaned up test files');
}

testMultipleSheets().catch(console.error);