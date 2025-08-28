# Tests

This folder contains all test files for the xlsx-diff TypeScript library.

## Test Structure

### `diff.test.ts`
Unit tests for the Myers diff algorithm:
- Identical sequences
- Insertion detection
- Deletion detection
- Empty sequence handling
- Complex change scenarios

### `integration.test.ts`
Integration tests for the complete library:
- File path comparison
- Buffer comparison
- Raw data inclusion
- Identical file handling
- End-to-end functionality

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npx jest tests/diff.test.ts

# Run tests in watch mode
npx jest --watch
```

## Test Coverage

Tests cover:
- ✅ Core diff algorithm functionality
- ✅ Excel file parsing and loading
- ✅ Both file path and buffer input methods
- ✅ Raw data inclusion/exclusion
- ✅ Multi-sheet workbook scenarios
- ✅ Error handling and edge cases

All tests use Jest with TypeScript support via ts-jest.