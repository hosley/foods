/**
 * Utility to generate iCalendar (.ics) files for digital calendar integration.
 * Complies with RFC 5545.
 */

export interface ICSEvent {
	description?: string;
	end: Date;
	location?: string;
	start: Date;
	summary: string;
	url?: string;
}

/**
 * Formats a Date object into the iCalendar format (YYYYMMDDTHHMMSS).
 * Uses local time representation as per app standards.
 */
export const formatICSDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

/**
 * Escapes special characters in ICS values.
 */
export const escapeICSValue = (value: string): string => {
	return value.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
};

/**
 * Generates a full iCalendar string from a list of events.
 */
export const generateICS = (events: ICSEvent[]): string => {
	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Foods//Meal Planner//EN',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH',
	];

	for (const event of events) {
		lines.push('BEGIN:VEVENT');
		lines.push(`SUMMARY:${escapeICSValue(event.summary)}`);
		lines.push(`DTSTART:${formatICSDate(event.start)}`);
		lines.push(`DTEND:${formatICSDate(event.end)}`);

		if (event.description) {
			lines.push(`DESCRIPTION:${escapeICSValue(event.description)}`);
		}

		if (event.location) {
			lines.push(`LOCATION:${escapeICSValue(event.location)}`);
		}

		if (event.url) {
			lines.push(`URL:${event.url}`);
		}

		// Generate a simple UID based on timestamp and summary
		const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@foods.app`;
		lines.push(`UID:${uid}`);
		lines.push(`DTSTAMP:${formatICSDate(new Date())}`);
		lines.push('END:VEVENT');
	}

	lines.push('END:VCALENDAR');

	return lines.join('\r\n');
};

/**
 * Triggers a browser download of the generated ICS file.
 */
export const downloadICS = (filename: string, content: string): void => {
	const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', filename);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
};
