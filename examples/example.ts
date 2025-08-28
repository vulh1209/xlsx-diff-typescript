import { diffXlsx, diffXlsxFromBuffer } from '../src/index';
import * as fs from 'fs';

/**
 * Example usage of the xlsx-diff TypeScript library
 * This demonstrates the same functionality as the Rust test_data_diff.rs
 */
async function main() {
  try {
    console.log('Testing diff between data/1.xlsx and data/2.xlsx');
    
    // Example 1: Diff from file paths
    const result = await diffXlsx('data/1.xlsx', 'data/2.xlsx', false);
    
    console.log('\n=== DIFF RESULTS ===');
    console.log(JSON.stringify(result, null, 2));
    
    // Example 2: Diff with raw data
    console.log('\n=== WITH RAW DATA ===');
    const resultWithData = await diffXlsx('data/2.xlsx', 'data/3.xlsx', true);
    console.log(JSON.stringify(resultWithData, null, 2));
    
    // Example 3: Diff from buffers
    console.log('\n=== FROM BUFFERS ===');
    const buffer1 = fs.readFileSync('data/1.xlsx');
    const buffer2 = fs.readFileSync('data/2.xlsx');
    
    const bufferResult = await diffXlsxFromBuffer(buffer1, buffer2, false);
    console.log(JSON.stringify(bufferResult, null, 2));
    
    // Save result to file (like the Rust version)
    const jsonOutput = JSON.stringify(resultWithData, null, 2);
    fs.writeFileSync('1_2_result_ts.json', jsonOutput);
    console.log('\n=== SAVED TO FILE ===');
    console.log('Result saved to 1_2_result_ts.json');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}