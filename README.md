# xlsx-diff-ts

A TypeScript library for comparing differences between two XLSX files. This is a TypeScript port of the Rust xlsx-diff library, implementing the Myers diff algorithm for Excel file comparison.

## Installation

```bash
npm install xlsx-diff-ts
```

## Features

- Compare XLSX files from file paths or buffers
- Myers diff algorithm for accurate change detection
- Identifies added, removed, and modified sheets
- Row-level diff with operation tracking (Insert, Delete)
- Optional raw data inclusion in results
- Full TypeScript support with type definitions

## Usage

### Basic Usage

```typescript
import { diffXlsx } from 'xlsx-diff-ts';

async function compareFiles() {
  const result = await diffXlsx('old.xlsx', 'new.xlsx');
  console.log(JSON.stringify(result, null, 2));
}
```

### With Raw Data

```typescript
import { diffXlsx } from 'xlsx-diff-ts';

async function compareWithData() {
  const result = await diffXlsx('old.xlsx', 'new.xlsx', true);
  // result.data will contain the raw sheet data
}
```

### From Buffers

```typescript
import { diffXlsxFromBuffer } from 'xlsx-diff-ts';
import * as fs from 'fs';

async function compareFromBuffers() {
  const oldBuffer = fs.readFileSync('old.xlsx');
  const newBuffer = fs.readFileSync('new.xlsx');
  
  const result = await diffXlsxFromBuffer(oldBuffer, newBuffer);
  console.log(result);
}
```

## API

### `diffXlsx(oldFilePath, newFilePath, rawData?)`

Compare two XLSX files by file path.

- `oldFilePath`: string - Path to the old XLSX file
- `newFilePath`: string - Path to the new XLSX file
- `rawData`: boolean (optional) - Whether to include raw sheet data (default: false)
- Returns: `Promise<DiffResult>`

### `diffXlsxFromBuffer(oldFile, newFile, rawData?)`

Compare two XLSX files from buffers.

- `oldFile`: Buffer - Buffer containing the old XLSX file
- `newFile`: Buffer - Buffer containing the new XLSX file  
- `rawData`: boolean (optional) - Whether to include raw sheet data (default: false)
- Returns: `Promise<DiffResult>`

## Result Format

The library returns a `DiffResult` object with the following structure:

```typescript
interface DiffResult {
  added_sheets: string[];           // Sheets only in new file
  removed_sheets: string[];         // Sheets only in old file
  no_change_sheets: string[];       // Unchanged sheets
  modified_sheets: ModifiedSheet[]; // Changed sheets with diff details
  data: OriginData;                // Raw data (if requested)
}

interface ModifiedSheet {
  sheet_name: string;
  diff: DiffItem<SerializableData[]>[];
}

interface DiffItem<T> {
  op: 'Insert' | 'Delete' | 'Equal';
  old_index: number | null;
  new_index: number | null;
  value: T;
}
```

## Example Output

```json
{
  "added_sheets": [],
  "removed_sheets": [],
  "no_change_sheets": ["Sheet2"],
  "modified_sheets": [
    {
      "sheet_name": "Sheet1",
      "diff": [
        {
          "op": "Delete",
          "old_index": 0,
          "new_index": null,
          "value": ["old", "row", "data"]
        },
        {
          "op": "Insert",
          "old_index": null,
          "new_index": 0,
          "value": ["new", "row", "data"]
        }
      ]
    }
  ],
  "data": {
    "old": {
      "sheet_names": ["Sheet1", "Sheet2"],
      "data": null
    },
    "new": {
      "sheet_names": ["Sheet1", "Sheet2"],
      "data": null
    }
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Run examples
npm run example:simple      # Basic usage example
npm run example:multi       # Multi-sheet comparison  
npm run example:original    # Original data files test
```

## License

MIT - Same as the original Rust implementation