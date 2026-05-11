import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Provider } from 'jotai';
import { EditMealDialog } from './edit-meal-dialog';

const meta = {
	component: EditMealDialog,
	decorators: [
		Story => (
			<Provider>
				<div className="p-10">
					<Story />
				</div>
			</Provider>
		),
	],
	title: 'Components/EditMealDialog',
} satisfies Meta<typeof EditMealDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		date: '2026-05-10',
		mealName: 'Dinner',
		time: '18:00',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// The trigger is a button with an icon
		const trigger = canvas.getByRole('button');
		await userEvent.click(trigger);

		const body = within(canvasElement.ownerDocument.body);

		// Wait for dialog content to be visible by searching for its title
		await expect(await body.findByText(/Edit Meal Details/i)).toBeInTheDocument();

		const nameInput = body.getByLabelText(/Meal Name/i);
		const timeInput = body.getByLabelText(/Time/i);

		await expect(nameInput).toHaveValue('Dinner');
		await expect(timeInput).toHaveValue('18:00');
	},
};
