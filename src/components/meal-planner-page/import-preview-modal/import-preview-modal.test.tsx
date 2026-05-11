import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { atom, Provider } from 'jotai';
import { describe, expect, it, vi } from 'vitest';
import type { WeeklyMealPlan } from '../../../lib/meal-plan-storage';
import { encodeMealPlan } from '../../../lib/sharing';
import { ImportPreviewModal } from './import-preview-modal';

// Use vi.hoisted to provide the mock functions for the vi.mock factory
const { mockImportMealPlanAction } = vi.hoisted(() => ({
	mockImportMealPlanAction: vi.fn(),
}));

vi.mock('../../../atoms/meal-plan/meal-plan', async importOriginal => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		importMealPlanAtom: atom(null, async (_get, _set, payload) => {
			await mockImportMealPlanAction(payload);
		}),
	};
});

describe('ImportPreviewModal', () => {
	const mockPlan: WeeklyMealPlan = {
		'2026-05-10': [
			{
				mealName: 'Dinner',
				recipeIds: ['basil-pesto-pasta'],
				time: '18:00',
			},
		],
	};
	const shareCode = encodeMealPlan(mockPlan);

	it('opens the modal when a valid share code is provided', async () => {
		const onClear = vi.fn();
		render(
			<Provider>
				<ImportPreviewModal onClearShare={onClear} shareCode={shareCode} />
			</Provider>,
		);

		expect(await screen.findByText(/Import Shared Meal Plan/i)).toBeInTheDocument();
		expect(screen.getByText('2026-05-10')).toBeInTheDocument();
		expect(screen.getByText('Dinner')).toBeInTheDocument();
		expect(screen.getByText('Fresh Basil Pesto Pasta')).toBeInTheDocument();
	});

	it('calls importMealPlan when confirmed', async () => {
		const onClear = vi.fn();
		render(
			<Provider>
				<ImportPreviewModal onClearShare={onClear} shareCode={shareCode} />
			</Provider>,
		);

		fireEvent.click(await screen.findByText(/Import Plan/i));

		await waitFor(() => {
			expect(mockImportMealPlanAction).toHaveBeenCalledWith(mockPlan);
			expect(onClear).toHaveBeenCalled();
		});
	});

	it('calls onClearShare when cancelled', async () => {
		const onClear = vi.fn();
		render(
			<Provider>
				<ImportPreviewModal onClearShare={onClear} shareCode={shareCode} />
			</Provider>,
		);

		fireEvent.click(await screen.findByText(/Cancel/i));
		await waitFor(() => {
			expect(onClear).toHaveBeenCalled();
		});
	});

	it('calls onClearShare if share code is invalid', async () => {
		const onClear = vi.fn();
		render(
			<Provider>
				<ImportPreviewModal onClearShare={onClear} shareCode="invalid-code" />
			</Provider>,
		);

		expect(onClear).toHaveBeenCalled();
	});

	it('renders "Unknown Recipe" if recipe ID is not found', async () => {
		const unknownPlan: WeeklyMealPlan = {
			'2026-05-10': [
				{
					mealName: 'Dinner',
					recipeIds: ['unknown-id'],
					time: '18:00',
				},
			],
		};
		const unknownCode = encodeMealPlan(unknownPlan);

		render(
			<Provider>
				<ImportPreviewModal onClearShare={vi.fn()} shareCode={unknownCode} />
			</Provider>,
		);

		expect(await screen.findByText(/Unknown Recipe/i)).toBeInTheDocument();
	});
});
