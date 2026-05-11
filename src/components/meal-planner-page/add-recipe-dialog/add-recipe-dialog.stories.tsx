import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Provider } from 'jotai';
import { AddRecipeDialog } from './add-recipe-dialog';

const meta = {
	component: AddRecipeDialog,
	decorators: [
		Story => (
			<Provider>
				<div className="p-10 w-[200px]">
					<Story />
				</div>
			</Provider>
		),
	],
	title: 'Components/AddRecipeDialog',
} satisfies Meta<typeof AddRecipeDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		date: '2026-05-10',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('button', { name: /add recipe/i });

		await userEvent.click(trigger);

		// The dialog is rendered in a portal, so we query the document body
		const body = within(canvasElement.ownerDocument.body);

		// Verify standard slots are visible
		await expect(body.getByRole('button', { name: /^Breakfast$/i })).toBeInTheDocument();
		await expect(body.getByRole('button', { name: /^Lunch$/i })).toBeInTheDocument();
		await expect(body.getByRole('button', { name: /^Dinner$/i })).toBeInTheDocument();

		// Switch to custom
		const customTab = body.getByRole('button', { name: /^Custom$/i });
		await userEvent.click(customTab);

		// Verify custom inputs appear
		await expect(body.getByLabelText(/Meal Name/i)).toBeInTheDocument();
		await expect(body.getByLabelText(/Time/i)).toBeInTheDocument();

		// Search for a recipe
		const searchInput = body.getByPlaceholderText(/Search recipes/i);
		await userEvent.type(searchInput, 'pesto');

		// Verify filtered results
		await expect(body.getByText(/Basil Pesto Pasta/i)).toBeInTheDocument();
	},
};
