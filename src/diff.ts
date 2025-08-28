import { DiffItem } from './types';

/**
 * Myers diff algorithm implementation for comparing two sequences
 * Based on the Rust implementation from the original xlsx-diff
 */
export function myersDiff<T>(
  old_seq: T[],
  new_seq: T[]
): DiffItem<T>[] {
  const n = old_seq.length;
  const m = new_seq.length;
  const max = n + m;
  
  if (n === 0) {
    return new_seq.map((value, index) => ({
      op: 'Insert' as const,
      old_index: null,
      new_index: index,
      value
    }));
  }
  
  if (m === 0) {
    return old_seq.map((value, index) => ({
      op: 'Delete' as const,
      old_index: index,
      new_index: null,
      value
    }));
  }

  const v: number[] = new Array(2 * max + 1).fill(-1);
  const offset = max;
  v[offset + 1] = 0;

  const trace: number[][] = [];

  for (let d = 0; d <= max; d++) {
    const current_v = [...v];
    
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      
      if (k === -d || (k !== d && v[k - 1 + offset] < v[k + 1 + offset])) {
        x = v[k + 1 + offset];
      } else {
        x = v[k - 1 + offset] + 1;
      }
      
      let y = x - k;
      
      while (x < n && y < m && deepEqual(old_seq[x], new_seq[y])) {
        x++;
        y++;
      }
      
      v[k + offset] = x;
      
      if (x >= n && y >= m) {
        trace.push(current_v);
        return buildPath(trace, old_seq, new_seq, n, m);
      }
    }
    
    trace.push(current_v);
  }
  
  return [];
}

function deepEqual<T>(a: T, b: T): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  return a === b;
}

function buildPath<T>(
  trace: number[][],
  old_seq: T[],
  new_seq: T[],
  n: number,
  m: number
): DiffItem<T>[] {
  const result: DiffItem<T>[] = [];
  let x = n;
  let y = m;
  
  for (let d = trace.length - 1; d >= 0; d--) {
    const v = trace[d];
    const offset = n + m;
    const k = x - y;
    
    let prev_k: number;
    if (k === -d || (k !== d && v[k - 1 + offset] < v[k + 1 + offset])) {
      prev_k = k + 1;
    } else {
      prev_k = k - 1;
    }
    
    const prev_x = v[prev_k + offset];
    const prev_y = prev_x - prev_k;
    
    while (x > prev_x && y > prev_y) {
      x--;
      y--;
      // Equal elements - we can skip these for now or add them if needed
    }
    
    if (d > 0) {
      if (x > prev_x) {
        result.unshift({
          op: 'Delete',
          old_index: x - 1,
          new_index: null,
          value: old_seq[x - 1]
        });
        x = prev_x;
      } else if (y > prev_y) {
        result.unshift({
          op: 'Insert',
          old_index: null,
          new_index: y - 1,
          value: new_seq[y - 1]
        });
        y = prev_y;
      }
    }
  }
  
  return result;
}