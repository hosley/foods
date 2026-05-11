import { fireEvent, render, screen } from '@testing-library/react';
import { atom, Provider } from 'jotai';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EditMealDialog } from './edit-meal-dialog';

// Use vi.hoisted to provide the mock functions for the vi.mock factory
const { mockUpdateMeal, mockRemoveMeal } = vi.hoisted(() => ({
	mockRemoveMeal: vi.fn(),
	mockUpdateMeal: vi.fn(),
}));

vi.mock('../../../atoms/meal-plan/meal-plan', async importOriginal => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		removeMealAtom: atom(null, (_get, _set, payload) => mockRemoveMeal(payload)),
		updateMealDetailsAtom: atom(null, (_get, _set, payload) => mockUpdateMeal(payload)),
	};
});

describe('EditMealDialog', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders with current meal details', async () => {
		render(
			<Provider>
				<EditMealDialog date="2026-05-10" mealName="Dinner" time="18:00" />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /edit meal/i }));

		expect(screen.getByText('Edit Meal Details')).toBeInTheDocument();
		expect(screen.getByLabelText('Meal Name')).toHaveValue('Dinner');
		expect(screen.getByLabelText('Time')).toHaveValue('18:00');
	});

	it('calls updateMealDetails when saved', async () => {
		render(
			<Provider>
				<EditMealDialog date="2026-05-10" mealName="Dinner" time="18:00" />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /edit meal/i }));

		fireEvent.change(screen.getByLabelText('Meal Name'), { target: { value: 'Festive Dinner' } });
		fireEvent.change(screen.getByLabelText('Time'), { target: { value: '20:00' } });

		fireEvent.click(screen.getByText('Save Changes'));

		expect(mockUpdateMeal).toHaveBeenCalledWith({
			date: '2026-05-10',
			newMealName: 'Festive Dinner',
			newTime: '20:00',
			oldMealName: 'Dinner',
		});
	});

	it('calls removeMeal when deleted', async () => {
		render(
			<Provider>
				<EditMealDialog date="2026-05-10" mealName="Dinner" time="18:00" />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /edit meal/i }));
		fireEvent.click(screen.getByText(/Delete Meal/i));

		expect(mockRemoveMeal).toHaveBeenCalledWith({
			date: '2026-05-10',
			mealName: 'Dinner',
		});
	});
});
