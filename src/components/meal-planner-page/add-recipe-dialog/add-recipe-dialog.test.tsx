import { atom } from 'jotai';
import { vi } from 'vitest';

// Use vi.hoisted to ensure the mock function is available during vi.mock hoisting
const { mockAddRecipeAction } = vi.hoisted(() => ({
	mockAddRecipeAction: vi.fn(),
}));

// Mock storage via aliased path FIRST
vi.mock('#/lib/meal-plan-storage', () => ({
	getMealPlan: vi.fn().mockResolvedValue({}),
	purgeStaleData: vi.fn().mockResolvedValue(undefined),
	saveRecipesForDate: vi.fn().mockResolvedValue(undefined),
}));

// Mock the atoms
vi.mock('../../../atoms/meal-plan/meal-plan', async importOriginal => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		addRecipeToMealAtom: atom(null, mockAddRecipeAction),
	};
});

import { fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { describe, expect, it } from 'vitest';
import { DEFAULT_USER_SETTINGS, userSettingsAtom } from '../../../atoms/user-settings/user-settings';
import { AddRecipeDialog } from './add-recipe-dialog';

// Mock all-recipes selector
vi.mock('../../../selectors/get-all-recipes/get-all-recipes', () => ({
	getAllRecipes: () => [{ id: '1', title: 'Basil Pesto Pasta' }],
}));

describe('AddRecipeDialog', () => {
	it('opens the dialog and shows recipes when clicked', async () => {
		render(
			<Provider>
				<AddRecipeDialog date="2026-05-10" />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /add recipe/i }));
		expect(await screen.findByText(/Select Recipe/i)).toBeInTheDocument();
	});

	it('calls addRecipeToMeal with the user defined default time', async () => {
		const store = createStore();
		const customSettings = {
			...DEFAULT_USER_SETTINGS,
			defaultTimes: {
				...DEFAULT_USER_SETTINGS.defaultTimes,
				Dinner: '19:45',
			},
		};
		store.set(userSettingsAtom, customSettings);

		render(
			<Provider store={store}>
				<AddRecipeDialog date="2026-05-10" />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /add recipe/i }));

		// Select recipe
		fireEvent.click(await screen.findByText(/Basil Pesto Pasta/i));

		expect(mockAddRecipeAction).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
			date: '2026-05-10',
			mealName: 'Dinner',
			recipeId: '1',
			time: '19:45',
		});
	});

	it('can add a custom meal', async () => {
		render(
			<Provider>
				<AddRecipeDialog date="2026-05-10" />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /add recipe/i }));
		fireEvent.click(screen.getByText(/Custom/i));

		fireEvent.change(screen.getByLabelText(/Meal Name/i), { target: { value: 'Brunch' } });
		fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '11:00' } });

		fireEvent.click(screen.getByText(/Basil Pesto Pasta/i));

		expect(mockAddRecipeAction).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
			date: '2026-05-10',
			mealName: 'Brunch',
			recipeId: '1',
			time: '11:00',
		});
	});

	it('uses default name when custom meal name is empty', async () => {
		render(
			<Provider>
				<AddRecipeDialog date="2026-05-10" />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /add recipe/i }));
		fireEvent.click(screen.getByText(/Custom/i));
		fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '15:00' } });

		fireEvent.click(screen.getByText(/Basil Pesto Pasta/i));

		expect(mockAddRecipeAction).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
			date: '2026-05-10',
			mealName: 'Custom Meal',
			recipeId: '1',
			time: '15:00',
		});
	});

	it('uses hardcoded default time if settings are missing for a slot', async () => {
		const store = createStore();
		store.set(userSettingsAtom, {
			defaultTimes: {
				Breakfast: '07:00',
				Dinner: '',
				Lunch: '12:00',
			} as any,
			importStrategy: 'overwrite',
		});

		render(
			<Provider store={store}>
				<AddRecipeDialog date="2026-05-10" />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /add recipe/i }));
		fireEvent.click(screen.getByText(/Basil Pesto Pasta/i));

		expect(mockAddRecipeAction).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
			date: '2026-05-10',
			mealName: 'Dinner',
			recipeId: '1',
			time: '18:00',
		});
	});
});
