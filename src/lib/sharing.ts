import LZString from 'lz-string';
import type { WeeklyMealPlan } from './meal-plan-storage';

/**
 * Encodes a partial meal plan into a compressed base64 string for URL sharing.
 */
export const encodeMealPlan = (plan: WeeklyMealPlan): string => {
	const json = JSON.stringify(plan);
	return LZString.compressToEncodedURIComponent(json);
};

/**
 * Decodes a compressed base64 string back into a partial meal plan.
 */
export const decodeMealPlan = (encoded: string): WeeklyMealPlan | null => {
	try {
		const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
		if (!decompressed) return null;
		return JSON.parse(decompressed) as WeeklyMealPlan;
	} catch (error) {
		console.error('Failed to decode meal plan:', error);
		return null;
	}
};

/**
 * Generates a full sharing URL for the given partial plan.
 */
export const generateShareUrl = (plan: WeeklyMealPlan, baseUrl: string): string => {
	const encoded = encodeMealPlan(plan);
	const url = new URL(baseUrl);
	url.searchParams.set('share', encoded);
	return url.toString();
};
