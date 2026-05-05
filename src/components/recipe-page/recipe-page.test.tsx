import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { describe, expect, it } from 'vitest';
import type { Recipe } from '../../recipes/schema';
import { RecipePage } from './recipe-page';

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

		expect(screen.getByText('Test Recipe')).toBeInTheDocument();
		expect(screen.getByText('A delicious test recipe')).toBeInTheDocument();
		expect(screen.getByText('Testian')).toBeInTheDocument();
		expect(screen.getByText('Mock')).toBeInTheDocument();

		// Stats
		expect(screen.getByText(/10/)).toBeInTheDocument();
		expect(screen.getByText(/20/)).toBeInTheDocument();
		expect(screen.getByText(/30/)).toBeInTheDocument();
		expect(screen.getAllByText(/mins/).length).toBe(3);

		// Ingredients
		expect(screen.getAllByText('Ingredient 1').length).toBeGreaterThan(0);
		expect(screen.getAllByText('Ingredient 2').length).toBeGreaterThan(0);

		// Steps
		expect(screen.getByText('Step 1 instruction')).toBeInTheDocument();
		expect(screen.getByText('Step 2 instruction')).toBeInTheDocument();
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
		expect(saveButton).toBeInTheDocument();

		// Save it
		fireEvent.click(saveButton);
		expect(screen.getByRole('button', { name: /saved/i })).toBeInTheDocument();

		// Unsave it
		fireEvent.click(screen.getByRole('button', { name: /saved/i }));
		expect(screen.getByRole('button', { name: /save recipe/i })).toBeInTheDocument();
	});
});
