import { atom } from 'jotai';
import { vi } from 'vitest';

// Mock storage
vi.mock('#/lib/meal-plan-storage', () => ({
	getMealPlan: vi.fn().mockResolvedValue({}),
	purgeStaleData: vi.fn().mockResolvedValue(undefined),
	saveRecipesForDate: vi.fn().mockResolvedValue(undefined),
}));

const { mockAddRecipeAction } = vi.hoisted(() => ({
	mockAddRecipeAction: vi.fn(),
}));

vi.mock('../../../atoms/meal-plan/meal-plan', async importOriginal => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		addRecipeToMealAtom: atom(null, mockAddRecipeAction),
	};
});

import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { describe, expect, it } from 'vitest';
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
		expect(screen.getByText(/Custom/i)).toBeInTheDocument();
	});

	it('can add a custom meal', async () => {
		render(
			<Provider>
				<AddRecipeDialog date="2026-05-10" />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /add recipe/i }));

		// Click Custom
		fireEvent.click(screen.getByText(/Custom/i));

		// Fill details
		fireEvent.change(screen.getByLabelText(/Meal Name/i), { target: { value: 'Brunch' } });
		fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '11:00' } });

		// Select recipe
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

		// Fill only time
		fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '15:00' } });

		fireEvent.click(screen.getByText(/Basil Pesto Pasta/i));

		expect(mockAddRecipeAction).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
			date: '2026-05-10',
			mealName: 'Custom Meal',
			recipeId: '1',
			time: '15:00',
		});
	});
});
