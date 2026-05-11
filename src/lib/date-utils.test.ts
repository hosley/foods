import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getWeekDates, parseISODate, toISODateString } from './date-utils';

describe('date-utils', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should convert a date to ISO string', () => {
		const date = new Date('2026-05-10T12:00:00Z');
		expect(toISODateString(date)).toBe('2026-05-10');
	});

	it('should get all dates for the current week (Sun-Sat)', () => {
		// Sunday, May 10, 2026
		const sunday = new Date('2026-05-10T12:00:00Z');
		const dates = getWeekDates(sunday);

		expect(dates).toHaveLength(7);
		expect(toISODateString(dates[0])).toBe('2026-05-10'); // Sun
		expect(toISODateString(dates[1])).toBe('2026-05-11'); // Mon
		expect(toISODateString(dates[6])).toBe('2026-05-16'); // Sat
	});

	it('should get the correct week dates when starting from a Saturday', () => {
		// Saturday, May 16, 2026
		const saturday = new Date('2026-05-16T12:00:00Z');
		const dates = getWeekDates(saturday);

		expect(dates).toHaveLength(7);
		expect(toISODateString(dates[0])).toBe('2026-05-10'); // Sun
		expect(toISODateString(dates[6])).toBe('2026-05-16'); // Sat
	});

	it('should handle crossing month boundaries', () => {
		// Wednesday, April 1, 2026
		const reference = new Date('2026-04-01T12:00:00Z');
		const dates = getWeekDates(reference);

		expect(toISODateString(dates[0])).toBe('2026-03-29'); // Previous month's Sun
		expect(toISODateString(dates[6])).toBe('2026-04-04'); // Next Sat
	});

	it('should handle malformed date strings in parseISODate', () => {
		const date = parseISODate('invalid');
		// NaN results in "Invalid Date"
		expect(date.toString()).toBe('Invalid Date');
	});

	it('should handle partial date strings in parseISODate', () => {
		const date = parseISODate('2026-05');
		expect(date.getFullYear()).toBe(2026);
		expect(date.getMonth()).toBe(4); // May (0-indexed)
		expect(date.getDate()).toBe(1); // Default
	});
});
