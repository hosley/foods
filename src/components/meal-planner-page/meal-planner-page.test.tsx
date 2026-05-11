import { fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mealPlanAtom } from '../../atoms/meal-plan/meal-plan';
import { userSettingsAtom } from '../../atoms/user-settings/user-settings';
import { MealPlannerPage } from './meal-planner-page';

// Mock TanStack Router hooks
const mockNavigate = vi.fn();
let mockSearch: any = {};
vi.mock('@tanstack/react-router', async importOriginal => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useSearch: () => mockSearch,
	};
});

// Mock idb-keyval
vi.mock('idb-keyval', () => ({
	get: vi.fn(),
	update: vi.fn(),
}));

describe('MealPlannerPage', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
		mockSearch = {};
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('renders the meal planner grid with 7 days and structured slots', () => {
		const today = new Date('2026-05-13T12:00:00Z');
		vi.setSystemTime(today);

		render(
			<Provider>
				<MealPlannerPage />
			</Provider>,
		);

		expect(screen.getByText('Meal Planner')).toBeInTheDocument();
		expect(screen.getAllByText('Sunday').length).toBeGreaterThan(0);
		expect(screen.getAllByText('Breakfast').length).toBeGreaterThan(0);
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

		expect(screen.getAllByText(/Fresh Basil Pesto Pasta/i).length).toBeGreaterThan(0);
	});

	it('renders custom meal entries with their specific times', () => {
		const todayStr = '2026-05-10';
		vi.setSystemTime(new Date(`${todayStr}T12:00:00Z`));

		const store = createStore();
		store.set(mealPlanAtom, {
			[todayStr]: [
				{
					mealName: 'Midnight Snack',
					recipeIds: ['cast-iron-chicken'],
					time: '23:30',
				},
			],
		});

		render(
			<Provider store={store}>
				<MealPlannerPage />
			</Provider>,
		);

		expect(screen.getByText('Midnight Snack')).toBeInTheDocument();
		expect(screen.getByText('23:30')).toBeInTheDocument();
		expect(screen.getAllByText(/Sear-Roasted Chicken Thighs/i).length).toBeGreaterThan(0);
	});

	it('navigates between weeks', () => {
		const today = new Date('2026-05-13T12:00:00Z');
		vi.setSystemTime(today);

		render(
			<Provider>
				<MealPlannerPage />
			</Provider>,
		);

		const nextButton = screen.getByText('Next Week');
		fireEvent.click(nextButton);

		expect(mockNavigate).toHaveBeenCalledWith({
			search: { date: '2026-05-17' },
		});
	});

	it('disables "Previous Week" on current week without data', () => {
		const today = new Date('2026-05-13T12:00:00Z');
		vi.setSystemTime(today);

		render(
			<Provider>
				<MealPlannerPage />
			</Provider>,
		);

		const prevButton = screen.getByText('Previous Week');
		expect(prevButton).toBeDisabled();
	});

	it('enables "Previous Week" on current week WITH data in previous week', () => {
		const today = new Date('2026-05-13T12:00:00Z');
		vi.setSystemTime(today);

		const store = createStore();
		// Previous week (May 3-9)
		store.set(mealPlanAtom, {
			'2026-05-05': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }],
		});

		render(
			<Provider store={store}>
				<MealPlannerPage />
			</Provider>,
		);

		const prevButton = screen.getByText('Previous Week');
		expect(prevButton).not.toBeDisabled();
	});

	it('respects user defined default times', () => {
		const today = new Date('2026-05-13T12:00:00Z');
		vi.setSystemTime(today);

		const store = createStore();
		store.set(userSettingsAtom, {
			defaultTimes: {
				Breakfast: '08:30',
				Dinner: '19:30',
				Lunch: '13:30',
			},
			importStrategy: 'overwrite',
		});

		render(
			<Provider store={store}>
				<MealPlannerPage />
			</Provider>,
		);

		expect(screen.getAllByText('08:30').length).toBeGreaterThan(0);
		expect(screen.getAllByText('13:30').length).toBeGreaterThan(0);
		expect(screen.getAllByText('19:30').length).toBeGreaterThan(0);
	});
});
