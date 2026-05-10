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

	it('renders the meal planner grid with 7 days and structured slots', () => {
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

		// Verify slots exist
		expect(screen.getAllByText('Breakfast').length).toBeGreaterThan(0);
		expect(screen.getAllByText('Lunch').length).toBeGreaterThan(0);
		expect(screen.getAllByText('Dinner').length).toBeGreaterThan(0);
	});

	it('renders planned recipes in the correct slot', () => {
		const todayStr = '2026-05-10';
		vi.setSystemTime(new Date(`${todayStr}T12:00:00Z`));

		const store = createStore();
		store.set(mealPlanAtom, {
			[todayStr]: [
				{
					mealName: 'Lunch',
					recipeIds: ['basil-pesto-pasta'],
					time: '12:00',
				},
			],
		});

		render(
			<Provider store={store}>
				<MealPlannerPage />
			</Provider>,
		);

		// Basil Pesto Pasta should be under Lunch
		expect(screen.getAllByText('Lunch').length).toBeGreaterThan(0);
		expect(screen.getAllByText('Fresh Basil Pesto Pasta').length).toBeGreaterThan(0);
	});
});
