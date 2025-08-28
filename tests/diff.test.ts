import { myersDiff } from '../src/diff';

describe('Myers Diff Algorithm', () => {
  test('should handle identical sequences', () => {
    const seq1 = [['a', 'b'], ['c', 'd']];
    const seq2 = [['a', 'b'], ['c', 'd']];
    
    const result = myersDiff(seq1, seq2);
    expect(result).toHaveLength(0);
  });

  test('should detect insertions', () => {
    const seq1 = [['a', 'b']];
    const seq2 = [['a', 'b'], ['c', 'd']];
    
    const result = myersDiff(seq1, seq2);
    expect(result).toHaveLength(1);
    expect(result[0].op).toBe('Insert');
    expect(result[0].old_index).toBeNull();
    expect(result[0].new_index).toBe(1);
    expect(result[0].value).toEqual(['c', 'd']);
  });

  test('should detect deletions', () => {
    const seq1 = [['a', 'b'], ['c', 'd']];
    const seq2 = [['a', 'b']];
    
    const result = myersDiff(seq1, seq2);
    expect(result).toHaveLength(1);
    expect(result[0].op).toBe('Delete');
    expect(result[0].old_index).toBe(1);
    expect(result[0].new_index).toBeNull();
    expect(result[0].value).toEqual(['c', 'd']);
  });

  test('should handle empty sequences', () => {
    const seq1: string[][] = [];
    const seq2 = [['a', 'b']];
    
    const result = myersDiff(seq1, seq2);
    expect(result).toHaveLength(1);
    expect(result[0].op).toBe('Insert');
  });

  test('should handle complex changes', () => {
    const seq1 = [['1', '2'], ['3', '4'], ['5', '6']];
    const seq2 = [['1', '2'], ['7', '8'], ['5', '6']];
    
    const result = myersDiff(seq1, seq2);
    expect(result.length).toBeGreaterThan(0);
    
    // Should detect deletion and insertion for the middle row change
    const deleteOp = result.find(r => r.op === 'Delete');
    const insertOp = result.find(r => r.op === 'Insert');
    
    expect(deleteOp).toBeDefined();
    expect(insertOp).toBeDefined();
  });
});