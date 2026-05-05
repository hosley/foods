import { createStore } from 'jotai';
import { describe, expect, it } from 'vitest';
import { savedRecipesAtom, toggleSavedRecipeAtom } from './saved-recipes';

describe('saved-recipes atoms', () => {
	it('should start with an empty list', () => {
		const store = createStore();
		expect(store.get(savedRecipesAtom)).toEqual([]);
	});

	it('should toggle a recipe ID in the list', () => {
		const store = createStore();
		const recipeId = 'test-recipe';

		// Add
		store.set(toggleSavedRecipeAtom, recipeId);
		expect(store.get(savedRecipesAtom)).toContain(recipeId);

		// Remove
		store.set(toggleSavedRecipeAtom, recipeId);
		expect(store.get(savedRecipesAtom)).not.toContain(recipeId);
	});
});
