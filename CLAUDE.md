# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

xlsx-diff is a Rust library and command-line tool for comparing differences between two XLSX files. It implements the Myers diff algorithm to identify changes between Excel workbooks and provides results in JSON format.

## Architecture

The project follows a modular structure:

- **`src/lib.rs`**: Library entry point exposing `diff_xlsx` and `diff_xlsx_from_u8` functions
- **`src/main.rs`**: CLI binary (`xlsx_diff`) with StructOpt argument parsing
- **`src/core/mod.rs`**: Core functionality coordinating parsing and diffing
- **`src/core/parse.rs`**: Excel file parsing using the `calamine` crate
- **`src/core/diff.rs`**: Myers diff algorithm implementation for row-based comparison
- **`test_data_diff.rs`**: Standalone test binary for development testing

Key data structures:
- `DiffResult`: Main output structure containing added/removed/modified sheets
- `FileLike`: Enum supporting both file paths and byte arrays
- `SerializableData`: Type-safe representation of cell values

## Commands

### Build
```bash
cargo build
```

### Run CLI Tool
```bash
cargo run --bin xlsx_diff -- <old_file> <new_file> [OPTIONS]
cargo run --bin xlsx_diff -- --help  # Show usage
```

Options:
- `-d, --with-data`: Include raw sheet data in output
- `-h, --header-row <N>`: Header row (not implemented)

### Run Test Binary
```bash
cargo run --bin test_data_diff
```
Tests comparison between files in `data/` directory and saves output to `1_2_result.json`.

### Test
```bash
cargo test
```
Note: No unit tests are currently implemented.

## Dependencies

- **calamine**: Excel file reading (.xlsx support)
- **serde**: Serialization framework
- **serde_json**: JSON output formatting
- **structopt**: CLI argument parsing

## Output Format

The tool outputs JSON with structure:
- `added_sheets`: List of sheets only in new file
- `removed_sheets`: List of sheets only in old file
- `no_change_sheets`: List of unchanged sheets
- `modified_sheets`: Array of diff results per changed sheet
- `data`: Original sheet data (when `--with-data` flag used)

Each diff item contains:
- `op`: Operation type ("Insert", "Delete", etc.)
- `old_index`/`new_index`: Row positions
- `value`: Cell values as array