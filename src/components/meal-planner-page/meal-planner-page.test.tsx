import { vi } from 'vitest';

// Mock idb-keyval
vi.mock('idb-keyval', () => ({
	get: vi.fn(),
	update: vi.fn(),
}));

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

import { fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mealPlanAtom } from '../../atoms/meal-plan/meal-plan';
import { MealPlannerPage } from './meal-planner-page';

describe('MealPlannerPage', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
		mockSearch = {};
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

	it('disables the "Previous Week" button on the current week if no past data exists', () => {
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

	it('enables the "Previous Week" button on the next week to allow returning to current', () => {
		const today = new Date('2026-05-13T12:00:00Z');
		vi.setSystemTime(today);
		mockSearch = { date: '2026-05-20' };

		render(
			<Provider>
				<MealPlannerPage />
			</Provider>,
		);

		const prevButton = screen.getByText('Previous Week');
		expect(prevButton).not.toBeDisabled();
	});

	it('enables the "Previous Week" button on the current week if data exists in the previous week', () => {
		const today = new Date('2026-05-13T12:00:00Z');
		vi.setSystemTime(today);

		const store = createStore();
		// Data in the previous week (May 3-9)
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

	it('navigates to the previous week (Sunday) when clicked and enabled', () => {
		const today = new Date('2026-05-13T12:00:00Z'); // Wednesday
		vi.setSystemTime(today);

		const store = createStore();
		// Data in the previous week (May 3-9)
		store.set(mealPlanAtom, {
			'2026-05-05': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }],
		});

		render(
			<Provider store={store}>
				<MealPlannerPage />
			</Provider>,
		);

		const prevButton = screen.getByText('Previous Week');
		fireEvent.click(prevButton);

		expect(mockNavigate).toHaveBeenCalledWith({
			search: { date: '2026-05-03' }, // Previous Sunday
		});
	});

	it('navigates to the next week (Sunday) when clicked', () => {
		const today = new Date('2026-05-13T12:00:00Z'); // Wednesday
		vi.setSystemTime(today);

		render(
			<Provider>
				<MealPlannerPage />
			</Provider>,
		);

		const nextButton = screen.getByText('Next Week');
		fireEvent.click(nextButton);

		expect(mockNavigate).toHaveBeenCalledWith({
			search: { date: '2026-05-17' }, // Next Sunday
		});
	});

	it('disables the "Next Week" button when at the forward limit (+1 week)', () => {
		// Real today is May 13.
		// Current week is May 10-16.
		// Forward limit (+1 week) is May 17-23.
		const today = new Date('2026-05-13T12:00:00Z');
		vi.setSystemTime(today);

		// Mock that we are already viewing the next week
		mockSearch = { date: '2026-05-20' };

		render(
			<Provider>
				<MealPlannerPage />
			</Provider>,
		);

		const nextButton = screen.getByText('Next Week');
		expect(nextButton).toBeDisabled();
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
