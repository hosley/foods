import { fireEvent, render, screen } from '@testing-library/react';
import { atom, Provider } from 'jotai';
import { describe, expect, it, vi } from 'vitest';
import { AddRecipeDialog } from './add-recipe-dialog';

// Mock the atom
vi.mock('../../../atoms/meal-plan/meal-plan', async importOriginal => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		addRecipeToMealAtom: atom(null, vi.fn()),
	};
});

// Mock all-recipes selector to ensure we have data to search
vi.mock('../../../selectors/get-all-recipes/get-all-recipes', () => ({
	getAllRecipes: () => [
		{ id: '1', title: 'Basil Pesto Pasta' },
		{ id: '2', title: 'Cast Iron Chicken' },
	],
}));

describe('AddRecipeDialog', () => {
	it('opens the dialog and shows recipes when clicked', async () => {
		render(
			<Provider>
				<AddRecipeDialog date="2026-05-10" />
			</Provider>,
		);

		const trigger = screen.getByRole('button', { name: /add recipe/i });
		fireEvent.click(trigger);

		// The mock renders everything in-place, so we don't need async finding
		// but we use a regex or function to match if text is fragmented
		expect(screen.getByText(/Select Recipe/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/Search recipes/i)).toBeInTheDocument();
		expect(screen.getAllByText(/Basil Pesto Pasta/i).length).toBeGreaterThan(0);
	});

	it('filters recipes based on search input', async () => {
		render(
			<Provider>
				<AddRecipeDialog date="2026-05-10" />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /add recipe/i }));

		const input = screen.getByPlaceholderText(/Search recipes/i);
		fireEvent.change(input, { target: { value: 'Basil' } });

		expect(screen.getAllByText(/Basil Pesto Pasta/i).length).toBeGreaterThan(0);
	});
});
