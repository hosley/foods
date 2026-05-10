import { vi } from 'vitest';

// Mock idb-keyval to prevent ReferenceErrors
vi.mock('idb-keyval', () => ({
	get: vi.fn(),
	update: vi.fn(),
}));

import { render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mealPlanAtom } from '../../atoms/meal-plan/meal-plan';
import { MealPlannerPage } from './meal-planner-page';

describe('MealPlannerPage', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('renders the meal planner grid with 7 days', () => {
		// Wednesday, May 13, 2026
		const today = new Date('2026-05-13T12:00:00Z');
		vi.setSystemTime(today);

		render(
			<Provider>
				<MealPlannerPage />
			</Provider>,
		);

		expect(screen.getByText('Meal Planner')).toBeInTheDocument();
		// Should show the week of May 10 (Sun) to May 16 (Sat)
		expect(screen.getByText('Sunday')).toBeInTheDocument();
		expect(screen.getByText('May 10')).toBeInTheDocument();
		expect(screen.getByText('Saturday')).toBeInTheDocument();
		expect(screen.getByText('May 16')).toBeInTheDocument();
	});

	it('renders planned recipes in the grid', () => {
		// Sunday, May 10, 2026
		const todayStr = '2026-05-10';
		vi.setSystemTime(new Date(`${todayStr}T12:00:00Z`));

		const store = createStore();
		store.set(mealPlanAtom, {
			[todayStr]: [
				{
					mealName: 'Dinner',
					recipeIds: ['basil-pesto-pasta'],
					time: '18:00',
				},
			],
		});

		render(
			<Provider store={store}>
				<MealPlannerPage />
			</Provider>,
		);

		expect(screen.getByText('Dinner')).toBeInTheDocument();
		expect(screen.getByText('Fresh Basil Pesto Pasta')).toBeInTheDocument();
	});

	it('handles missing recipes gracefully', () => {
		const todayStr = '2026-05-10';
		vi.setSystemTime(new Date(`${todayStr}T12:00:00Z`));

		const store = createStore();
		store.set(mealPlanAtom, {
			[todayStr]: [
				{
					mealName: 'Lunch',
					recipeIds: ['non-existent-recipe'],
					time: '12:00',
				},
			],
		});

		render(
			<Provider store={store}>
				<MealPlannerPage />
			</Provider>,
		);

		expect(screen.getByText('Unknown Recipe')).toBeInTheDocument();
	});
});
