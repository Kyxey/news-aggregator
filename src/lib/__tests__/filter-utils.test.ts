import { describe, it, expect } from 'vitest';
import { toggleArraySelection, toggleItemInArray } from '../filter-utils';

describe('filter-utils', () => {
  describe('toggleArraySelection', () => {
    it('deselects all when none are selected', () => {
      const allItems = ['a', 'b', 'c'];
      const result = toggleArraySelection([], allItems);

      expect(result).toEqual([]);
    });

    it('deselects all items when all are selected', () => {
      const allItems = ['a', 'b', 'c'];
      const result = toggleArraySelection(['a', 'b', 'c'], allItems);

      expect(result).toEqual([]);
    });

    it('selects all items when some are selected', () => {
      const allItems = ['a', 'b', 'c'];
      const result = toggleArraySelection(['a'], allItems);

      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('works with numbers', () => {
      const allItems = [1, 2, 3, 4, 5];
      const result = toggleArraySelection([1, 2], allItems);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('toggleItemInArray', () => {
    it('adds item when not present', () => {
      const current = ['a', 'b'];
      const result = toggleItemInArray(current, 'c');

      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('removes item when present', () => {
      const current = ['a', 'b', 'c'];
      const result = toggleItemInArray(current, 'b');

      expect(result).toEqual(['a', 'c']);
    });

    it('handles empty array', () => {
      const result = toggleItemInArray([], 'a');

      expect(result).toEqual(['a']);
    });

    it('does not mutate original array', () => {
      const current = ['a', 'b'];
      const result = toggleItemInArray(current, 'c');

      expect(current).toEqual(['a', 'b']);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('works with objects', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const current = [obj1];
      const result = toggleItemInArray(current, obj2);

      expect(result).toEqual([obj1, obj2]);
    });
  });
});
