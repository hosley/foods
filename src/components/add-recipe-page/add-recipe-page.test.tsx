import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddRecipePage } from './add-recipe-page';

// Mock crypto for UUIDs
Object.defineProperty(window, 'crypto', {
	value: {
		randomUUID: () => `test-uuid-${Math.random().toString(36).substring(2, 9)}`,
	},
});

// Mock clipboard
Object.defineProperty(navigator, 'clipboard', {
	value: {
		writeText: vi.fn().mockResolvedValue(undefined),
	},
});

describe('AddRecipePage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders correctly with initial state', () => {
		render(<AddRecipePage />);
		expect(screen.getByText(/add new recipe/i)).toBeInTheDocument();
	});

	it('handles basic info inputs', () => {
		render(<AddRecipePage />);

		const titleInput = screen.getByLabelText(/title/i);
		fireEvent.change(titleInput, { target: { value: 'New Test Recipe' } });
		expect(titleInput).toHaveValue('New Test Recipe');

		const descInput = screen.getByLabelText(/description/i);
		fireEvent.change(descInput, { target: { value: 'A test description' } });
		expect(descInput).toHaveValue('A test description');

		const cuisineInput = screen.getByLabelText(/cuisine/i);
		fireEvent.change(cuisineInput, { target: { value: 'Test Cuisine' } });
		expect(cuisineInput).toHaveValue('Test Cuisine');

		const proteinInput = screen.getByLabelText(/primary protein/i);
		fireEvent.change(proteinInput, { target: { value: 'Tofu' } });
		expect(proteinInput).toHaveValue('Tofu');
	});

	it('handles time inputs with blur parsing', () => {
		render(<AddRecipePage />);

		const prepInput = screen.getByLabelText(/prep time/i);
		fireEvent.change(prepInput, { target: { value: '15.5' } });
		fireEvent.blur(prepInput);
		expect(prepInput).toHaveValue('15.5');

		const cookInput = screen.getByLabelText(/cook time/i);
		fireEvent.change(cookInput, { target: { value: '30' } });
		fireEvent.blur(cookInput);
		expect(cookInput).toHaveValue('30');
	});

	it('adds and removes ingredients', () => {
		render(<AddRecipePage />);

		const addButton = screen.getByRole('button', { name: /add ingredient/i });
		fireEvent.click(addButton);

		expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

		const nameInput = screen.getByLabelText(/name/i);
		fireEvent.change(nameInput, { target: { value: 'Salt' } });

		const quantityInput = screen.getByLabelText(/quantity/i);
		fireEvent.change(quantityInput, { target: { value: '1/2' } });
		fireEvent.blur(quantityInput);
		expect(quantityInput).toHaveValue('0.5');

		const measureInput = screen.getByLabelText(/measurement/i);
		fireEvent.change(measureInput, { target: { value: 'pinch' } });
		expect(measureInput).toHaveValue('pinch');

		const removeButton = screen.getByLabelText(/remove ingredient/i);
		fireEvent.click(removeButton);
		expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
	});

	it('adds and removes steps', () => {
		render(<AddRecipePage />);

		const addButton = screen.getByRole('button', { name: /add step/i });
		fireEvent.click(addButton);

		expect(screen.getByLabelText(/instruction/i)).toBeInTheDocument();

		const instructionInput = screen.getByLabelText(/instruction/i);
		fireEvent.change(instructionInput, { target: { value: 'Boil water' } });

		const removeButton = screen.getByLabelText(/remove step/i);
		fireEvent.click(removeButton);
		expect(screen.queryByLabelText(/instruction/i)).not.toBeInTheDocument();
	});

	it('shows error when submitting with unused ingredients', async () => {
		render(<AddRecipePage />);

		// Add ingredient
		fireEvent.click(screen.getByRole('button', { name: /add ingredient/i }));
		fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Salt' } });
		fireEvent.blur(screen.getByLabelText(/quantity/i));

		// Add step but don't link ingredient
		fireEvent.click(screen.getByRole('button', { name: /add step/i }));
		fireEvent.change(screen.getByLabelText(/instruction/i), { target: { value: 'Boil water' } });

		fireEvent.click(screen.getByRole('button', { name: /generate recipe file/i }));

		await waitFor(() => {
			expect(screen.getByText(/the following ingredients are not used in any step/i)).toBeInTheDocument();
		});
	});

	it('shows error when submitting with unnamed unused ingredient', async () => {
		render(<AddRecipePage />);

		// Add ingredient without name
		fireEvent.click(screen.getByRole('button', { name: /add ingredient/i }));
		fireEvent.blur(screen.getByLabelText(/quantity/i));

		// Add step but don't link ingredient
		fireEvent.click(screen.getByRole('button', { name: /add step/i }));
		fireEvent.change(screen.getByLabelText(/instruction/i), { target: { value: 'Boil water' } });

		fireEvent.click(screen.getByRole('button', { name: /generate recipe file/i }));

		await waitFor(() => {
			// The mock UUID starts with 'test-uuid-'
			expect(screen.getByText(/the following ingredients are not used in any step: ing-/i)).toBeInTheDocument();
		});
	});

	it('submits successfully with unnamed ingredient and shows output sheet', async () => {
		render(<AddRecipePage />);

		// Add ingredient without name
		fireEvent.click(screen.getByRole('button', { name: /add ingredient/i }));
		fireEvent.blur(screen.getByLabelText(/quantity/i));

		// Add step and link ingredient
		fireEvent.click(screen.getByRole('button', { name: /add step/i }));
		fireEvent.change(screen.getByLabelText(/instruction/i), { target: { value: 'Add something' } });

		// Open popover to select ingredient
		const selectButton = screen.getByRole('combobox');
		fireEvent.click(selectButton);

		const option = screen.getByRole('option');
		fireEvent.click(option);

		fireEvent.click(screen.getByRole('button', { name: /generate recipe file/i }));

		await waitFor(() => {
			expect(screen.getByText(/generated output/i)).toBeInTheDocument();
		});
	});

	it('submits successfully with empty title and shows output sheet', async () => {
		render(<AddRecipePage />);

		// Skip title to trigger fallback branches

		// Add ingredient
		fireEvent.click(screen.getByRole('button', { name: /add ingredient/i }));
		fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Salt' } });
		fireEvent.blur(screen.getByLabelText(/quantity/i));

		// Add step and link ingredient
		fireEvent.click(screen.getByRole('button', { name: /add step/i }));
		fireEvent.change(screen.getByLabelText(/instruction/i), { target: { value: 'Add salt' } });

		// Open popover to select ingredient
		const selectButton = screen.getByRole('combobox');
		fireEvent.click(selectButton);

		const option = screen.getByRole('option');
		fireEvent.click(option);

		fireEvent.click(screen.getByRole('button', { name: /generate recipe file/i }));

		await waitFor(() => {
			expect(screen.getByText(/generated output/i)).toBeInTheDocument();
			// Verify fallback variable name
			expect(screen.getByText(/export const newRecipe: Recipe/i)).toBeInTheDocument();
		});
	});

	it('submits successfully and shows output sheet', async () => {
		render(<AddRecipePage />);

		fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Recipe' } });

		// Add ingredient
		fireEvent.click(screen.getByRole('button', { name: /add ingredient/i }));
		fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Salt' } });
		fireEvent.blur(screen.getByLabelText(/quantity/i));

		// Add step and link ingredient
		fireEvent.click(screen.getByRole('button', { name: /add step/i }));
		fireEvent.change(screen.getByLabelText(/instruction/i), { target: { value: 'Add salt' } });

		// Open popover to select ingredient
		const selectButton = screen.getByRole('combobox');
		fireEvent.click(selectButton);

		const option = screen.getByRole('option');
		fireEvent.click(option);

		// Deselect it to cover that branch
		fireEvent.click(option);
		// Select it again for final submission
		fireEvent.click(option);

		fireEvent.click(screen.getByRole('button', { name: /generate recipe file/i }));

		await waitFor(() => {
			expect(screen.getByText(/generated output/i)).toBeInTheDocument();
		});

		const copyButton = screen.getByRole('button', { name: /copy code/i });
		fireEvent.click(copyButton);
		expect(navigator.clipboard.writeText).toHaveBeenCalled();

		await waitFor(
			() => {
				expect(screen.getByText(/copied!/i)).toBeInTheDocument();
			},
			{ timeout: 2500 },
		);
	});
});
