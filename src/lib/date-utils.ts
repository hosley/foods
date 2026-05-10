/**
 * Gets the ISO date string (YYYY-MM-DD) for a given Date object.
 */
export const toISODateString = (date: Date): string => {
	return date.toISOString().split('T')[0] as string;
};

/**
 * Gets an array of 7 Date objects representing the week (Sunday to Saturday)
 * that contains the provided reference date.
 */
export const getWeekDates = (referenceDate: Date): Date[] => {
	const day = referenceDate.getDay(); // Sunday is 0
	const diff = referenceDate.getDate() - day;
	const sunday = new Date(referenceDate);
	sunday.setDate(diff);
	sunday.setHours(0, 0, 0, 0);

	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(sunday);
		d.setDate(sunday.getDate() + i);
		return d;
	});
};
