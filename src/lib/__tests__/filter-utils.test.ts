import { describe, it, expect } from 'vitest';
import {
  toggleArraySelection,
  toggleItemInArray,
  clearFilterByKey,
  hasAnyActiveFilters,
} from '../filter-utils';
import { createMockFilters } from '@/test/mock-data';

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

  const mockFilters = createMockFilters({
    startDate: new Date('February 22, 2025 03:24:00'),
    endDate: new Date('February 23, 2025 03:24:00'),
    apiFilters: {
      newsapi: {
        enabled: true,
        category: 'general',
        sources: ['Test'],
      },
      guardian: {
        enabled: true,
        sections: ['general'],
      },
      nytimes: {
        enabled: true,
        author: 'John Doe',
        desks: ['Business', 'Culture'],
      },
    },
  });
  describe('clearFilterByKey', () => {
    it('clears startDate correctly', () => {
      const newMockedFilters = createMockFilters({ ...mockFilters, startDate: undefined });
      const result = clearFilterByKey(mockFilters, 'startDate');

      expect(result).to.deep.equal(newMockedFilters);
    });
    it('clears endDate correctly', () => {
      const newMockedFilters = createMockFilters({ ...mockFilters, endDate: undefined });
      const result = clearFilterByKey(mockFilters, 'endDate');

      expect(result).to.deep.equal(newMockedFilters);
    });
    it('clears newsapi-category correctly', () => {
      const newMockedFilters = createMockFilters({
        ...mockFilters,
        apiFilters: {
          ...mockFilters.apiFilters,
          newsapi: {
            ...mockFilters.apiFilters?.newsapi!,
            category: undefined,
          },
        },
      });
      const result = clearFilterByKey(mockFilters, 'newsapi-category');

      expect(result).to.deep.equal(newMockedFilters);
    });
    it('clears newsapi-sources correctly', () => {
      const newMockedFilters = createMockFilters({
        ...mockFilters,
        apiFilters: {
          ...mockFilters.apiFilters,
          newsapi: {
            ...mockFilters.apiFilters?.newsapi!,
            sources: undefined,
          },
        },
      });
      const result = clearFilterByKey(mockFilters, 'newsapi-sources');

      expect(result).to.deep.equal(newMockedFilters);
    });
    it('clears guardian-sections correctly', () => {
      const newMockedFilters = createMockFilters({
        ...mockFilters,
        apiFilters: {
          ...mockFilters.apiFilters,
          guardian: {
            ...mockFilters.apiFilters?.guardian!,
            sections: undefined,
          },
        },
      });
      const result = clearFilterByKey(mockFilters, 'guardian-sections');

      expect(result).to.deep.equal(newMockedFilters);
    });
    it('clears nytimes-desks correctly', () => {
      const newMockedFilters = createMockFilters({
        ...mockFilters,
        apiFilters: {
          ...mockFilters.apiFilters,
          nytimes: {
            ...mockFilters.apiFilters?.nytimes!,
            desks: undefined,
          },
        },
      });
      const result = clearFilterByKey(mockFilters, 'nytimes-desks');

      expect(result).to.deep.equal(newMockedFilters);
    });
    it('clears nytimes-author correctly', () => {
      const newMockedFilters = createMockFilters({
        ...mockFilters,
        apiFilters: {
          ...mockFilters.apiFilters,
          nytimes: {
            ...mockFilters.apiFilters?.nytimes!,
            author: undefined,
          },
        },
      });
      const result = clearFilterByKey(mockFilters, 'nytimes-author');

      expect(result).to.deep.equal(newMockedFilters);
    });
  });
  describe('hasAnyActiveFilters', () => {
    it('works on no filters', () => {
      const mockedFilters = createMockFilters();
      const result = hasAnyActiveFilters(undefined, mockedFilters);

      expect(result).toEqual(false);
    });
    it('works on searchQuery filter', () => {
      const mockedFilters = createMockFilters();
      const result = hasAnyActiveFilters('Test', mockedFilters);

      expect(result).toEqual(true);
    });
    it('works on startDate filter', () => {
      const mockedFilters = createMockFilters({
        startDate: new Date('February 22, 2025 03:24:00'),
      });
      const result = hasAnyActiveFilters(undefined, mockedFilters);

      expect(result).toEqual(true);
    });
    it('works on endDate filter', () => {
      const mockedFilters = createMockFilters({
        endDate: new Date('February 23, 2025 03:24:00'),
      });
      const result = hasAnyActiveFilters(undefined, mockedFilters);

      expect(result).toEqual(true);
    });
    it('works on newsapi-category filter', () => {
      const mockedFilters = createMockFilters({
        apiFilters: {
          newsapi: {
            enabled: true,
            category: 'business',
          },
        },
      });
      const result = hasAnyActiveFilters(undefined, mockedFilters);

      expect(result).toEqual(true);
    });
    it('works on newsapi-sources filter', () => {
      const mockedFilters = createMockFilters({
        apiFilters: {
          newsapi: {
            enabled: true,
            sources: ['Test'],
          },
        },
      });
      const result = hasAnyActiveFilters(undefined, mockedFilters);

      expect(result).toEqual(true);
    });
    it('works on guardian-sections filter', () => {
      const mockedFilters = createMockFilters({
        apiFilters: {
          guardian: {
            enabled: true,
            sections: ['general'],
          },
        },
      });
      const result = hasAnyActiveFilters(undefined, mockedFilters);

      expect(result).toEqual(true);
    });
    it('works on nytimes-author filter', () => {
      const mockedFilters = createMockFilters({
        apiFilters: {
          nytimes: {
            enabled: true,
            author: 'John Doe',
          },
        },
      });
      const result = hasAnyActiveFilters(undefined, mockedFilters);

      expect(result).toEqual(true);
    });
    it('works on nytimes-desks filter', () => {
      const mockedFilters = createMockFilters({
        apiFilters: {
          nytimes: {
            enabled: true,
            desks: ['Business'],
          },
        },
      });
      const result = hasAnyActiveFilters(undefined, mockedFilters);

      expect(result).toEqual(true);
    });
    it('works on all filters and searchQuery', () => {
      const result = hasAnyActiveFilters('Test', mockFilters);

      expect(result).toEqual(true);
    });
  });
});
