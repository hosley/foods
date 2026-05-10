/**
 * Gets the ISO date string (YYYY-MM-DD) for a given Date object in local time.
 */
export const toISODateString = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

/**
 * Parses an ISO date string (YYYY-MM-DD) into a local Date object.
 */
export const parseISODate = (dateStr: string): Date => {
	const [year, month, day] = dateStr.split('-').map(Number);
	return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
};

/**
 * Gets an array of 7 Date objects representing the week (Sunday to Saturday)
 * that contains the provided reference date.
 */
export const getWeekDates = (referenceDate: Date): Date[] => {
	const day = referenceDate.getDay(); // Sunday is 0
	const sunday = new Date(referenceDate);
	sunday.setDate(referenceDate.getDate() - day);
	sunday.setHours(0, 0, 0, 0);

	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(sunday);
		d.setDate(sunday.getDate() + i);
		return d;
	});
};

/**
 * Adds a specific number of days to a Date object, returning a new Date.
 */
export const addDays = (date: Date, days: number): Date => {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};
