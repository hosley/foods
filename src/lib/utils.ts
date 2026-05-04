import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Parses a string representation of a quantity (integer, decimal, or fraction) into a number.
 * Handles "1", "1.5", "1/2", and "1 1/2".
 */
export function parseQuantity(input: string): number {
	const trimmed = input.trim();
	if (!trimmed) return 0;

	// Handle mixed numbers "1 1/2"
	const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
	if (mixedMatch) {
		const whole = Number.parseInt(mixedMatch[1], 10);
		const num = Number.parseInt(mixedMatch[2], 10);
		const den = Number.parseInt(mixedMatch[3], 10);
		return whole + num / den;
	}

	// Handle fractions "1/2"
	const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/);
	if (fractionMatch) {
		const num = Number.parseInt(fractionMatch[1], 10);
		const den = Number.parseInt(fractionMatch[2], 10);
		return num / den;
	}

	// Handle decimal or integer
	const num = Number.parseFloat(trimmed);
	return Number.isNaN(num) ? 0 : Math.max(0, num);
}

/**
 * Capitalizes the first letter of each word in a string.
 */
export function toTitleCase(str: string): string {
	return str
		.trim()
		.toLowerCase()
		.split(/\s+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
