import * as idb from 'idb-keyval';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getMealPlan, purgeStaleData, removeMealFromDate, saveDayMeals, saveRecipesForDate } from './meal-plan-storage';

vi.mock('idb-keyval', () => ({
	get: vi.fn(),
	update: vi.fn(),
}));

describe('meal-plan-storage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should return an empty object if no plan is found', async () => {
		vi.mocked(idb.get).mockResolvedValue(undefined);
		const plan = await getMealPlan();
		expect(plan).toEqual({});
	});

	it('should return the saved plan', async () => {
		const mockPlan = { '2026-05-10': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }] };
		vi.mocked(idb.get).mockResolvedValue(mockPlan);
		const plan = await getMealPlan();
		expect(plan).toEqual(mockPlan);
	});

	it('should add a new meal to a date', async () => {
		let storedValue: any = {};
		vi.mocked(idb.update).mockImplementation(async (_key, updater) => {
			storedValue = updater(storedValue);
		});

		await saveRecipesForDate('2026-05-10', 'Lunch', '12:00', ['2']);
		expect(storedValue).toEqual({
			'2026-05-10': [{ mealName: 'Lunch', recipeIds: ['2'], time: '12:00' }],
		});
	});

	it('should replace an existing meal on the same date with the same name', async () => {
		let storedValue: any = {
			'2026-05-10': [{ mealName: 'Lunch', recipeIds: ['2'], time: '12:00' }],
		};
		vi.mocked(idb.update).mockImplementation(async (_key, updater) => {
			storedValue = updater(storedValue);
		});

		await saveRecipesForDate('2026-05-10', 'Lunch', '13:00', ['3']);
		expect(storedValue['2026-05-10']).toHaveLength(1);
		expect(storedValue['2026-05-10'][0]).toEqual({
			mealName: 'Lunch',
			recipeIds: ['3'],
			time: '13:00',
		});
	});

	it('should add a second meal to the same date', async () => {
		let storedValue: any = {
			'2026-05-10': [{ mealName: 'Lunch', recipeIds: ['2'], time: '12:00' }],
		};
		vi.mocked(idb.update).mockImplementation(async (_key, updater) => {
			storedValue = updater(storedValue);
		});

		await saveRecipesForDate('2026-05-10', 'Dinner', '18:00', ['1']);
		expect(storedValue['2026-05-10']).toHaveLength(2);
		expect(storedValue['2026-05-10'][1]).toEqual({
			mealName: 'Dinner',
			recipeIds: ['1'],
			time: '18:00',
		});
	});

	it('should save all meals for a day', async () => {
		let storedValue: any = {};
		vi.mocked(idb.update).mockImplementation(async (_key, updater) => {
			storedValue = updater(storedValue);
		});

		const meals = [{ mealName: 'Breakfast', recipeIds: ['1'], time: '08:00' }];
		await saveDayMeals('2026-05-10', meals);
		expect(storedValue).toEqual({ '2026-05-10': meals });
	});

	it('should handle null value in update for saveDayMeals', async () => {
		let storedValue: any = null;
		vi.mocked(idb.update).mockImplementation(async (_key, updater) => {
			storedValue = updater(storedValue);
		});

		await saveDayMeals('2026-05-10', []);
		expect(storedValue).toEqual({ '2026-05-10': [] });
	});

	it('should remove a meal from a date', async () => {
		let storedValue: any = {
			'2026-05-10': [
				{ mealName: 'Lunch', recipeIds: ['1'], time: '12:00' },
				{ mealName: 'Dinner', recipeIds: ['2'], time: '18:00' },
			],
		};
		vi.mocked(idb.update).mockImplementation(async (_key, updater) => {
			storedValue = updater(storedValue);
		});

		await removeMealFromDate('2026-05-10', 'Lunch');
		expect(storedValue['2026-05-10']).toHaveLength(1);
		expect(storedValue['2026-05-10'][0].mealName).toBe('Dinner');
	});

	it('should handle null value in update for removeMealFromDate', async () => {
		let storedValue: any = null;
		vi.mocked(idb.update).mockImplementation(async (_key, updater) => {
			storedValue = updater(storedValue);
		});

		await removeMealFromDate('2026-05-10', 'Lunch');
		expect(storedValue).toEqual({ '2026-05-10': [] });
	});

	it('should purge stale data based on the Wednesday rule (Scenario: Today is Wednesday)', async () => {
		vi.setSystemTime(new Date('2026-05-13T12:00:00Z'));

		let storedValue: any = {
			'2026-05-09': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }],
			'2026-05-10': [{ mealName: 'Dinner', recipeIds: ['2'], time: '18:00' }],
		};

		vi.mocked(idb.update).mockImplementation(async (_key, updater) => {
			storedValue = updater(storedValue);
		});

		await purgeStaleData();

		expect(storedValue).toEqual({
			'2026-05-10': [{ mealName: 'Dinner', recipeIds: ['2'], time: '18:00' }],
		});
	});

	it('should purge stale data based on the Wednesday rule (Scenario: Today is Tuesday)', async () => {
		vi.setSystemTime(new Date('2026-05-12T12:00:00Z'));

		let storedValue: any = {
			'2026-05-02': [{ mealName: 'Dinner', recipeIds: ['old'], time: '18:00' }],
			'2026-05-09': [{ mealName: 'Dinner', recipeIds: ['keep'], time: '18:00' }],
		};

		vi.mocked(idb.update).mockImplementation(async (_key, updater) => {
			storedValue = updater(storedValue);
		});

		await purgeStaleData();

		expect(storedValue).toEqual({
			'2026-05-09': [{ mealName: 'Dinner', recipeIds: ['keep'], time: '18:00' }],
		});
	});

	it('should handle null value in update in saveRecipesForDate', async () => {
		let storedValue: any = null;
		vi.mocked(idb.update).mockImplementation(async (_key, updater) => {
			storedValue = updater(storedValue);
		});

		await saveRecipesForDate('2026-05-10', 'Lunch', '12:00', ['2']);
		expect(storedValue).toEqual({
			'2026-05-10': [{ mealName: 'Lunch', recipeIds: ['2'], time: '12:00' }],
		});
	});

	it('should handle null value in update in purgeStaleData', async () => {
		let storedValue: any = null;
		vi.mocked(idb.update).mockImplementation(async (_key, updater) => {
			storedValue = updater(storedValue);
		});

		await purgeStaleData();
		expect(storedValue).toEqual({});
	});

	it('should handle missing entries for a date during purge', async () => {
		vi.setSystemTime(new Date('2026-05-13T12:00:00Z'));

		let storedValue: any = {
			'2026-05-10': undefined,
		};

		vi.mocked(idb.update).mockImplementation(async (_key, updater) => {
			storedValue = updater(storedValue);
		});

		await purgeStaleData();
		expect(storedValue).toEqual({});
	});
});
