export type SerializableData = string | number | boolean | null;

export interface DiffItem<T> {
  op: 'Insert' | 'Delete' | 'Equal';
  old_index: number | null;
  new_index: number | null;
  value: T;
}

export interface ModifiedSheet {
  sheet_name: string;
  diff: DiffItem<SerializableData[]>[];
}

export interface WorkbookData {
  [sheetName: string]: SerializableData[][];
}

export interface OriginWorkbookData {
  sheet_names: string[];
  data: WorkbookData | null;
}

export interface OriginData {
  old: OriginWorkbookData;
  new: OriginWorkbookData;
}

export interface DiffResult {
  added_sheets: string[];
  removed_sheets: string[];
  no_change_sheets: string[];
  modified_sheets: ModifiedSheet[];
  data: OriginData;
}

export interface CalamineWorkbook {
  sheet_names: string[];
  data: WorkbookData;
}