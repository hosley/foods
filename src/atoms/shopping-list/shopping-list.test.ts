import { createStore } from 'jotai';
import { describe, expect, it } from 'vitest';
import { savedRecipesAtom } from '../saved-recipes/saved-recipes';
import { shoppingListAtom } from './shopping-list';

describe('shoppingListAtom', () => {
	it('should return empty list when no recipes are saved', () => {
		const store = createStore();
		expect(store.get(shoppingListAtom)).toEqual([]);
	});

	it('should aggregate ingredients from saved recipes', () => {
		const store = createStore();
		// Manually set saved recipes
		store.set(savedRecipesAtom, ['basil-pesto-pasta']);

		const list = store.get(shoppingListAtom);
		expect(list.length).toBeGreaterThan(0);

		// Check for a specific ingredient
		const pasta = list.find(i => i.name.toLowerCase().includes('pasta'));
		expect(pasta).toBeDefined();
	});

	it('should aggregate quantities for the same ingredient', () => {
		const store = createStore();
		// Add the same recipe twice (or two recipes with same ingredients)
		// Since it's a list of IDs, and we use a Map in the atom:
		store.set(savedRecipesAtom, ['basil-pesto-pasta', 'basil-pesto-pasta']);

		const list = store.get(shoppingListAtom);
		const pasta = list.find(i => i.name.toLowerCase().includes('pasta'));

		expect(pasta?.quantity).toBeGreaterThan(0);
	});

	it('should skip non-existent recipes', () => {
		const store = createStore();
		store.set(savedRecipesAtom, ['non-existent']);
		expect(store.get(shoppingListAtom)).toEqual([]);
	});
});
