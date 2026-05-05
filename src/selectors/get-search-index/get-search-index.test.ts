import { describe, expect, it } from 'vitest';
import { getSearchIndex } from './get-search-index';

describe('getSearchIndex', () => {
	it('returns a list of recipe summaries', () => {
		const index = getSearchIndex();
		expect(index.length).toBeGreaterThan(0);

		const first = index[0];
		expect(first).toHaveProperty('id');
		expect(first).toHaveProperty('title');
		expect(first).toHaveProperty('cuisine');
		expect(first).toHaveProperty('totalTimeMinutes');
		expect(Array.isArray(first.searchableIngredients)).toBe(true);
	});
});
