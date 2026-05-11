import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Provider } from 'jotai';
import { AddToMealPlanModal } from './add-to-meal-plan-modal';

const meta = {
	component: AddToMealPlanModal,
	decorators: [
		Story => (
			<Provider>
				<div className="p-10 w-[300px]">
					<Story />
				</div>
			</Provider>
		),
	],
	title: 'Components/AddToMealPlanModal',
} satisfies Meta<typeof AddToMealPlanModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		recipeId: 'basil-pesto-pasta',
		recipeTitle: 'Fresh Basil Pesto Pasta',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('button', { name: /add to meal plan/i });
		await userEvent.click(trigger);

		const body = within(canvasElement.ownerDocument.body);

		// Use findByRole to wait for dialog and avoid ambiguity with trigger
		await expect(await body.findByRole('heading', { name: /Add to Meal Plan/i })).toBeInTheDocument();
		await expect(body.getByText(/Fresh Basil Pesto Pasta/i)).toBeInTheDocument();

		await expect(body.getByLabelText(/Select Date/i)).toBeInTheDocument();

		// Check confirm button
		await expect(body.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
	},
};
