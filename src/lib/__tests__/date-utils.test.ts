import { describe, it, expect } from 'vitest';
import { formatDateISO, formatDateCompact } from '../date-utils';

describe('date-utils', () => {
  describe('formatDateISO', () => {
    it('formats date correctly', () => {
      const date = new Date('February 23, 2025 03:24:00');
      const result = formatDateISO(date);

      expect(result).toEqual('2025-02-23');
    });
  });

  describe('formatDateCompact', () => {
    it('formats date correctly', () => {
      const date = new Date('February 23, 2025 03:24:00');
      const result = formatDateCompact(date);

      expect(result).toEqual('20250223');
    });
  });
});
