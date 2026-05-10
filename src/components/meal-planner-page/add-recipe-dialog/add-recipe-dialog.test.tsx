import { fireEvent, render, screen } from '@testing-library/react';
import { atom, Provider } from 'jotai';
import { describe, expect, it, vi } from 'vitest';
import { AddRecipeDialog } from './add-recipe-dialog';

vi.mock('../../../atoms/meal-plan/meal-plan', async importOriginal => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		addRecipeToMealAtom: atom(null, (_get, _set, _payload) => {
			// Trigger a custom event or check state if needed,
			// but for this test we'll just use the mock on the atom's write function if possible.
			// However, since atoms are hard to spy on when mocked this way,
			// we'll use a global variable that Vitest allows.
		}),
	};
});

// We need a way to verify the call. Vitest allows variables starting with 'mock' or 'vi'
// IF they are defined before the mock AND used correctly.
// Let's try defining it inside a helper object.

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
		expect(screen.getByText(/Breakfast/i)).toBeInTheDocument();
		expect(screen.getByText(/Lunch/i)).toBeInTheDocument();
		expect(screen.getByText(/Dinner/i)).toBeInTheDocument();
	});

	it('renders the recipes list', async () => {
		render(
			<Provider>
				<AddRecipeDialog date="2026-05-10" />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /add recipe/i }));
		expect(await screen.findByText(/Basil Pesto Pasta/i)).toBeInTheDocument();
	});
});
