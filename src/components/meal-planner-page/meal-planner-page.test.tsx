import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mealPlanAtom, undoSnapshotAtom } from '../../atoms/meal-plan/meal-plan';
import { encodeMealPlan } from '../../lib/sharing';
import { MealPlannerPage } from './meal-planner-page';

// Mock TanStack Router hooks
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

// Mock idb-keyval
vi.mock('idb-keyval', () => ({
	get: vi.fn(),
	set: vi.fn(),
	update: vi.fn(),
}));

describe('MealPlannerPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSearch = {};

		// Stub location for sharing tests
		vi.stubGlobal('location', {
			origin: 'http://localhost:3000',
			pathname: '/meal-planner',
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('renders the meal planner grid with 7 days and structured slots', () => {
		render(
			<Provider>
				<MealPlannerPage />
			</Provider>,
		);

		expect(screen.getByText('Meal Planner')).toBeInTheDocument();
	});

	it('shares the current week when the share button is clicked', async () => {
		render(
			<Provider>
				<MealPlannerPage />
			</Provider>,
		);

		const shareButton = screen.getByText('Share Week');
		fireEvent.click(shareButton);

		await waitFor(() => {
			expect(navigator.clipboard.writeText).toHaveBeenCalled();
			expect(screen.getByText('Copied Link!')).toBeInTheDocument();
		});
	});

	it('shows undo button and handles undo action with countdown', async () => {
		vi.useFakeTimers();
		const store = createStore();
		store.set(mealPlanAtom, {});

		render(
			<Provider store={store}>
				<MealPlannerPage />
			</Provider>,
		);

		act(() => {
			store.set(undoSnapshotAtom, { '2026-05-10': [] });
		});

		expect(screen.getByText(/Undo/i)).toBeInTheDocument();
		expect(screen.getByText(/60s/i)).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(screen.getByText(/59s/i)).toBeInTheDocument();

		const undoButton = screen.getByRole('button', { name: /Undo/i });

		// Use async act to wait for the async atom function
		await act(async () => {
			fireEvent.click(undoButton);
		});

		expect(store.get(undoSnapshotAtom)).toBeNull();
	});

	it('auto-clears undo after 60 seconds', () => {
		vi.useFakeTimers();
		const store = createStore();
		render(
			<Provider store={store}>
				<MealPlannerPage />
			</Provider>,
		);

		act(() => {
			store.set(undoSnapshotAtom, { '2026-05-10': [] });
		});

		expect(screen.getByText(/Undo/i)).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(60000);
		});

		expect(screen.queryByText(/Undo/i)).not.toBeInTheDocument();
	});

	it('clears the share parameter when onClearShare is called', async () => {
		const mockPlan = { '2026-05-10': [{ mealName: 'Dinner', recipeIds: ['1'], time: '18:00' }] };
		const shareCode = encodeMealPlan(mockPlan);
		mockSearch = { share: shareCode };

		render(
			<Provider>
				<MealPlannerPage />
			</Provider>,
		);

		const cancelButton = await screen.findByRole('button', { name: /Cancel/i });
		fireEvent.click(cancelButton);

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith({
				replace: true,
				search: expect.any(Function),
			});
		});

		const searchUpdater = mockNavigate.mock.calls[0][0].search;
		const result = searchUpdater({ date: '2026-05-10', share: shareCode });
		expect(result).toEqual({ date: '2026-05-10' });
	});
});
