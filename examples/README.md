# Examples

This folder contains various examples demonstrating how to use the xlsx-diff TypeScript library.

## Running Examples

Make sure you've built the project first:
```bash
npm run build
```

Then run any example:
```bash
# Basic usage example
npx ts-node examples/simple-example.ts

# Multi-sheet comparison
npx ts-node examples/multi-sheet-test.ts

# Original example (requires data files)
npx ts-node examples/example.ts
```

## Available Examples

### 1. `simple-example.ts`
- Creates test Excel files programmatically
- Demonstrates file path comparison
- Shows buffer comparison
- Tests with realistic employee data

### 2. `multi-sheet-test.ts`  
- Tests multiple worksheet scenarios
- Shows added/removed sheet detection
- Demonstrates unchanged sheet identification
- Complex workbook comparison

### 3. `example.ts`
- Mirrors the original Rust test functionality
- Uses external data files in `data/` directory (1.xlsx, 2.xlsx, 3.xlsx)
- Shows comparison with and without raw data
- Saves results to JSON file (1_2_result_ts.json)

## Example Output

Each example will show:
- Added sheets
- Removed sheets  
- Modified sheets with change counts
- Unchanged sheets
- Detailed diff operations for modified sheets