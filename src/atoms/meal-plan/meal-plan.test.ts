import { createStore } from 'jotai';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as storage from '#/lib/meal-plan-storage';
import {
	addRecipeToMealAtom,
	clearUndoSnapshotAtom,
	importMealPlanAtom,
	loadMealPlanAtom,
	mealPlanAtom,
	removeMealAtom,
	undoImportAtom,
	undoSnapshotAtom,
	updateMealDetailsAtom,
} from './meal-plan';

// We mock the entire storage module using the aliased path
vi.mock('#/lib/meal-plan-storage', () => ({
	bulkMergeMeals: vi.fn(),
	bulkSaveMeals: vi.fn(),
	getMealPlan: vi.fn(),
	purgeStaleData: vi.fn(),
	removeMealFromDate: vi.fn(),
	replaceMealPlan: vi.fn(),
	saveDayMeals: vi.fn(),
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

		const updatedPlan = {
			'2026-05-10': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }],
		};
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

	it('should update meal details (name and time)', async () => {
		const existingPlan = {
			'2026-05-10': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }],
		};
		vi.mocked(storage.getMealPlan).mockResolvedValue(existingPlan);
		await store.set(loadMealPlanAtom);

		const updatedPlan = {
			'2026-05-10': [{ mealName: 'Festive Dinner', recipeIds: ['1'], time: '20:00' }],
		};
		vi.mocked(storage.getMealPlan).mockResolvedValue(updatedPlan);
		vi.mocked(storage.saveDayMeals).mockResolvedValue(undefined);

		await store.set(updateMealDetailsAtom, {
			date: '2026-05-10',
			newMealName: 'Festive Dinner',
			newTime: '20:00',
			oldMealName: 'Dinner',
		});

		expect(storage.saveDayMeals).toHaveBeenCalledWith('2026-05-10', [
			{ mealName: 'Festive Dinner', recipeIds: ['1'], time: '20:00' },
		]);
		expect(store.get(mealPlanAtom)).toEqual(updatedPlan);
	});

	it('should do nothing when updating a non-existent meal', async () => {
		vi.mocked(storage.getMealPlan).mockResolvedValue({});
		await store.set(loadMealPlanAtom);

		await store.set(updateMealDetailsAtom, {
			date: '2026-05-10',
			newMealName: 'Festive Dinner',
			newTime: '20:00',
			oldMealName: 'Dinner',
		});

		expect(storage.saveDayMeals).not.toHaveBeenCalled();
	});

	it('should remove a meal entry', async () => {
		const existingPlan = {
			'2026-05-10': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }],
		};
		vi.mocked(storage.getMealPlan).mockResolvedValue(existingPlan);
		await store.set(loadMealPlanAtom);

		vi.mocked(storage.getMealPlan).mockResolvedValue({});
		vi.mocked(storage.removeMealFromDate).mockResolvedValue(undefined);

		await store.set(removeMealAtom, {
			date: '2026-05-10',
			mealName: 'Dinner',
		});

		expect(storage.removeMealFromDate).toHaveBeenCalledWith('2026-05-10', 'Dinner');
		expect(store.get(mealPlanAtom)).toEqual({});
	});

	it('should import a shared meal plan using the overwrite strategy', async () => {
		const mockPlan = { '2026-05-10': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }] };
		vi.mocked(storage.getMealPlan).mockResolvedValue(mockPlan);
		vi.mocked(storage.bulkSaveMeals).mockResolvedValue(undefined);

		await store.set(importMealPlanAtom, { plan: mockPlan, strategy: 'overwrite' });
		expect(storage.bulkSaveMeals).toHaveBeenCalledWith(mockPlan);
		expect(store.get(mealPlanAtom)).toEqual(mockPlan);
	});

	it('should import a shared meal plan using the merge strategy', async () => {
		const mockPlan = { '2026-05-10': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }] };
		vi.mocked(storage.getMealPlan).mockResolvedValue(mockPlan);
		vi.mocked(storage.bulkMergeMeals).mockResolvedValue(undefined);

		await store.set(importMealPlanAtom, { plan: mockPlan, strategy: 'merge' });
		expect(storage.bulkMergeMeals).toHaveBeenCalledWith(mockPlan);
		expect(store.get(mealPlanAtom)).toEqual(mockPlan);
	});

	it('should take a snapshot before import and allow undo', async () => {
		const initialState = { '2026-05-10': [{ mealName: 'Dinner', recipeIds: ['initial'], time: '18:00' }] };
		const importedState = { '2026-05-10': [{ mealName: 'Dinner', recipeIds: ['imported'], time: '18:00' }] };

		vi.mocked(storage.getMealPlan).mockResolvedValue(initialState);
		await store.set(loadMealPlanAtom);

		vi.mocked(storage.getMealPlan).mockResolvedValue(importedState);
		await store.set(importMealPlanAtom, { plan: importedState, strategy: 'overwrite' });

		expect(store.get(undoSnapshotAtom)).toEqual(initialState);
		expect(store.get(mealPlanAtom)).toEqual(importedState);

		// Perform Undo
		await store.set(undoImportAtom);
		expect(storage.replaceMealPlan).toHaveBeenCalledWith(initialState);
		expect(store.get(mealPlanAtom)).toEqual(initialState);
		expect(store.get(undoSnapshotAtom)).toBeNull();
	});

	it('should clear undo snapshot', () => {
		store.set(undoSnapshotAtom, { test: [] } as any);
		store.set(clearUndoSnapshotAtom);
		expect(store.get(undoSnapshotAtom)).toBeNull();
	});
});
