import { describe, expect, it } from 'vitest';
import type { WeeklyMealPlan } from './meal-plan-storage';
import { decodeMealPlan, encodeMealPlan, generateShareUrl } from './sharing';

describe('sharing utils', () => {
	const mockPlan: WeeklyMealPlan = {
		'2026-05-10': [
			{
				mealName: 'Dinner',
				recipeIds: ['basil-pesto-pasta'],
				time: '18:00',
			},
		],
	};

	it('should encode and decode a meal plan accurately', () => {
		const encoded = encodeMealPlan(mockPlan);
		expect(typeof encoded).toBe('string');
		expect(encoded.length).toBeGreaterThan(0);

		const decoded = decodeMealPlan(encoded);
		expect(decoded).toEqual(mockPlan);
	});

	it('should return null for malformed encoded strings', () => {
		expect(decodeMealPlan('not-base64-compressed-json')).toBeNull();
		expect(decodeMealPlan('')).toBeNull();
	});

	it('should generate a valid share URL', () => {
		const baseUrl = 'https://foods.app/meal-planner';
		const url = generateShareUrl(mockPlan, baseUrl);

		expect(url).toContain(baseUrl);
		expect(url).toContain('share=');

		const urlObj = new URL(url);
		const shareParam = urlObj.searchParams.get('share');
		expect(shareParam).not.toBeNull();

		if (shareParam) {
			const decoded = decodeMealPlan(shareParam);
			expect(decoded).toEqual(mockPlan);
		}
	});
});
