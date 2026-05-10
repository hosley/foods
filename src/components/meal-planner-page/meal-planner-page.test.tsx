import { render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mealPlanAtom } from '../../atoms/meal-plan/meal-plan';
import { MealPlannerPage } from './meal-planner-page';

// Mock TanStack Router hooks to avoid Context errors
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', async importOriginal => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useSearch: () => ({}),
	};
});

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
		expect(screen.getAllByText('Sunday').length).toBeGreaterThan(0);
		expect(screen.getAllByText('Saturday').length).toBeGreaterThan(0);
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

		expect(screen.getAllByText('Dinner').length).toBeGreaterThan(0);
		expect(screen.getAllByText('Fresh Basil Pesto Pasta').length).toBeGreaterThan(0);
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

		expect(screen.getAllByText('Unknown Recipe').length).toBeGreaterThan(0);
	});
});
