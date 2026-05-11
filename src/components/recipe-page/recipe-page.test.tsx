import { fireEvent, render, screen } from '@testing-library/react';
import { atom, Provider } from 'jotai';
import { describe, expect, it, vi } from 'vitest';
import type { Recipe } from '../../recipes/schema';
import { RecipePage } from './recipe-page';

// Mock the atoms to prevent storage access and simplify state testing
vi.mock('../../atoms/meal-plan/meal-plan', async importOriginal => {
	const actual = await importOriginal<any>();
	const mockMealPlanAtom = atom<any>({});
	const mockAddRecipeToMealAtom = atom(null, (get, set, { date, recipeId, mealName, time }: any) => {
		const current = get(mockMealPlanAtom);
		set(mockMealPlanAtom, {
			...current,
			[date]: [{ mealName, recipeIds: [recipeId], time }],
		});
	});
	return {
		...actual,
		addRecipeToMealAtom: mockAddRecipeToMealAtom,
		mealPlanAtom: mockMealPlanAtom,
	};
});

const mockRecipe: Recipe = {
	cookTimeMinutes: 20,
	cuisine: 'Testian',
	description: 'A delicious test recipe',
	id: 'test-recipe',
	ingredients: [
		{ id: 'ing1', measurement: 'cup', name: 'ingredient 1', quantity: 1 },
		{ id: 'ing2', measurement: 'tbsp', name: 'ingredient 2', quantity: 2 },
	],
	prepTimeMinutes: 10,
	primaryProtein: 'Mock',
	steps: [
		{ id: 'step1', ingredientIds: ['ing1'], instruction: 'Step 1 instruction' },
		{ id: 'step2', ingredientIds: ['ing1', 'ing2'], instruction: 'Step 2 instruction' },
	],
	title: 'Test Recipe',
};

const mockRecipeNoProtein: Recipe = {
	...mockRecipe,
	primaryProtein: '',
};

describe('RecipePage', () => {
	it('renders recipe details correctly', () => {
		render(
			<Provider>
				<RecipePage recipe={mockRecipe} />
			</Provider>,
		);

		// Use getAllByText for titles that might appear multiple times (header and modal)
		expect(screen.getAllByText('Test Recipe').length).toBeGreaterThan(0);
		expect(screen.getByText('A delicious test recipe')).toBeInTheDocument();
		expect(screen.getByText('Testian')).toBeInTheDocument();
		expect(screen.getByText('Mock')).toBeInTheDocument();
	});

	it('renders correctly without primary protein', () => {
		render(
			<Provider>
				<RecipePage recipe={mockRecipeNoProtein} />
			</Provider>,
		);

		expect(screen.queryByText('Mock')).not.toBeInTheDocument();
	});

	it('toggles saved state when button is clicked', () => {
		render(
			<Provider>
				<RecipePage recipe={mockRecipe} />
			</Provider>,
		);

		const saveButton = screen.getByRole('button', { name: /save recipe/i });
		fireEvent.click(saveButton);
		expect(screen.getByRole('button', { name: /saved/i })).toBeInTheDocument();
	});

	it('renders the "Add to Meal Plan" button', () => {
		render(
			<Provider>
				<RecipePage recipe={mockRecipe} />
			</Provider>,
		);

		expect(screen.getByRole('button', { name: /add to meal plan/i })).toBeInTheDocument();
	});
});
