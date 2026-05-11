import { describe, expect, it, vi } from 'vitest';
import { downloadICS, escapeICSValue, formatICSDate, generateICS } from './ics';

describe('ICS Utility', () => {
	it('formats dates correctly for ICS', () => {
		const date = new Date(2026, 4, 10, 18, 30, 0); // May 10, 2026, 18:30:00
		expect(formatICSDate(date)).toBe('20260510T183000');
	});

	it('escapes special characters correctly', () => {
		const input = 'Dinner, and Brunch; with "special" chars\nNew line\\back';
		const expected = 'Dinner\\, and Brunch\\; with "special" chars\\nNew line\\\\back';
		expect(escapeICSValue(input)).toBe(expected);
	});

	it('generates a valid iCalendar string with one event', () => {
		const start = new Date(2026, 4, 10, 18, 0, 0);
		const end = new Date(2026, 4, 10, 19, 0, 0);
		const event = {
			description: 'Link: http://localhost/recipe/1',
			end,
			location: 'Home',
			start,
			summary: 'Dinner: Pasta',
			url: 'http://localhost/recipe/1',
		};

		const ics = generateICS([event]);

		expect(ics).toContain('BEGIN:VCALENDAR');
		expect(ics).toContain('VERSION:2.0');
		expect(ics).toContain('BEGIN:VEVENT');
		expect(ics).toContain('SUMMARY:Dinner: Pasta');
		expect(ics).toContain('DTSTART:20260510T180000');
		expect(ics).toContain('DTEND:20260510T190000');
		expect(ics).toContain('DESCRIPTION:Link: http://localhost/recipe/1');
		expect(ics).toContain('URL:http://localhost/recipe/1');
		expect(ics).toContain('LOCATION:Home');
		expect(ics).toContain('END:VEVENT');
		expect(ics).toContain('END:VCALENDAR');
		expect(ics).toContain('\r\n');
	});

	it('generates multiple events', () => {
		const event1 = {
			end: new Date(2026, 4, 10, 9, 0),
			start: new Date(2026, 4, 10, 8, 0),
			summary: 'Event 1',
		};
		const event2 = {
			end: new Date(2026, 4, 11, 9, 0),
			start: new Date(2026, 4, 11, 8, 0),
			summary: 'Event 2',
		};

		const ics = generateICS([event1, event2]);
		const events = ics.match(/BEGIN:VEVENT/g);
		expect(events).toHaveLength(2);
	});

	it('triggers a download', () => {
		// Mock static methods only
		const createObjectURLMock = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url');
		const revokeObjectURLMock = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

		const blobMock = vi.fn();
		vi.stubGlobal('Blob', blobMock);

		const appendChildMock = vi.spyOn(document.body, 'appendChild');
		const removeChildMock = vi.spyOn(document.body, 'removeChild');

		downloadICS('test.ics', 'content');

		expect(blobMock).toHaveBeenCalled();
		expect(createObjectURLMock).toHaveBeenCalled();
		expect(appendChildMock).toHaveBeenCalled();
		expect(removeChildMock).toHaveBeenCalled();
		expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:url');

		vi.unstubAllGlobals();
		createObjectURLMock.mockRestore();
		revokeObjectURLMock.mockRestore();
	});
});
