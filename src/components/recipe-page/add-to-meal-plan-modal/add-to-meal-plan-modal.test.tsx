import { fireEvent, render, screen } from '@testing-library/react';
import { atom, Provider } from 'jotai';
import { describe, expect, it, vi } from 'vitest';
import { AddToMealPlanModal } from './add-to-meal-plan-modal';

// Use vi.hoisted to provide the mock functions for the vi.mock factory
const { mockAddRecipeAction } = vi.hoisted(() => ({
	mockAddRecipeAction: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../atoms/meal-plan/meal-plan', async importOriginal => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		addRecipeToMealAtom: atom(null, (_get, _set, payload) => mockAddRecipeAction(payload)),
	};
});

describe('AddToMealPlanModal', () => {
	it('opens the modal and shows details when clicked', async () => {
		render(
			<Provider>
				<AddToMealPlanModal recipeId="test-recipe" recipeTitle="Test Recipe" />
			</Provider>,
		);

		const trigger = screen.getByRole('button', { name: /add to meal plan/i });
		fireEvent.click(trigger);

		expect(await screen.findByRole('heading', { name: /add to meal plan/i })).toBeInTheDocument();
		expect(screen.getAllByText(/Test Recipe/i).length).toBeGreaterThan(0);
	});

	it('calls addRecipeToMeal and shows success state', async () => {
		render(
			<Provider>
				<AddToMealPlanModal recipeId="test-recipe" recipeTitle="Test Recipe" />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /add to meal plan/i }));

		// Confirm
		fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

		expect(mockAddRecipeAction).toHaveBeenCalled();

		// Check for success state
		expect(await screen.findByText(/Added to Plan/i)).toBeInTheDocument();
	});
});
