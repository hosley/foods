import { createStore } from 'jotai';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as storage from '#/lib/meal-plan-storage';
import { addRecipeToMealAtom, loadMealPlanAtom, mealPlanAtom } from './meal-plan';

// We mock the entire storage module using the aliased path
vi.mock('#/lib/meal-plan-storage', () => ({
	getMealPlan: vi.fn(),
	purgeStaleData: vi.fn(),
	saveRecipesForDate: vi.fn(),
}));

describe('meal-plan-atoms', () => {
	let store: ReturnType<typeof createStore>;

	beforeEach(() => {
		store = createStore();
		vi.clearAllMocks();
	});

	it('should initialize with an empty object', () => {
		expect(store.get(mealPlanAtom)).toEqual({});
	});

	it('should load the meal plan from storage after purging stale data', async () => {
		const mockPlan = { '2026-05-10': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }] };
		vi.mocked(storage.getMealPlan).mockResolvedValue(mockPlan);
		vi.mocked(storage.purgeStaleData).mockResolvedValue(undefined);

		await store.set(loadMealPlanAtom);
		expect(storage.purgeStaleData).toHaveBeenCalled();
		expect(store.get(mealPlanAtom)).toEqual(mockPlan);
	});

	it('should add a recipe to the meal plan', async () => {
		vi.mocked(storage.getMealPlan).mockResolvedValue({});
		vi.mocked(storage.purgeStaleData).mockResolvedValue(undefined);
		await store.set(loadMealPlanAtom);

		const updatedPlan = { '2026-05-10': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }] };
		vi.mocked(storage.getMealPlan).mockResolvedValue(updatedPlan);
		vi.mocked(storage.saveRecipesForDate).mockResolvedValue(undefined);

		await store.set(addRecipeToMealAtom, {
			date: '2026-05-10',
			mealName: 'Dinner',
			recipeId: '1',
			time: '18:00',
		});

		expect(storage.saveRecipesForDate).toHaveBeenCalledWith('2026-05-10', 'Dinner', '18:00', ['1']);
		expect(store.get(mealPlanAtom)).toEqual(updatedPlan);
	});

	it('should not add a duplicate recipe to the same meal', async () => {
		const existingPlan = {
			'2026-05-10': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }],
		};
		vi.mocked(storage.getMealPlan).mockResolvedValue(existingPlan);
		vi.mocked(storage.purgeStaleData).mockResolvedValue(undefined);
		await store.set(loadMealPlanAtom);

		vi.mocked(storage.saveRecipesForDate).mockResolvedValue(undefined);

		await store.set(addRecipeToMealAtom, {
			date: '2026-05-10',
			mealName: 'Dinner',
			recipeId: '1',
			time: '18:00',
		});

		expect(storage.saveRecipesForDate).toHaveBeenCalledWith('2026-05-10', 'Dinner', '18:00', ['1']);
	});

	it('should append a new recipe to an existing meal slot', async () => {
		const existingPlan = {
			'2026-05-10': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }],
		};
		vi.mocked(storage.getMealPlan).mockResolvedValue(existingPlan);
		vi.mocked(storage.purgeStaleData).mockResolvedValue(undefined);
		await store.set(loadMealPlanAtom);

		vi.mocked(storage.saveRecipesForDate).mockResolvedValue(undefined);

		await store.set(addRecipeToMealAtom, {
			date: '2026-05-10',
			mealName: 'Dinner',
			recipeId: '2',
			time: '18:00',
		});

		expect(storage.saveRecipesForDate).toHaveBeenCalledWith('2026-05-10', 'Dinner', '18:00', ['1', '2']);
	});
});
