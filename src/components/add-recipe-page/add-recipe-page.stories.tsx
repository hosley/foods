import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { AddRecipePage } from './add-recipe-page';

const meta: Meta<typeof AddRecipePage> = {
	component: AddRecipePage,
	decorators: [
		Story => (
			<div className="p-8 bg-bg-base min-h-screen">
				<Story />
			</div>
		),
	],
	parameters: {
		layout: 'fullscreen',
	},
	title: 'Features/AddRecipePage',
} satisfies Meta<typeof AddRecipePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(await canvas.findByText(/Add New Recipe/i)).toBeInTheDocument();

		// Verify main sections
		await expect(canvas.getByText(/Basic Information/i)).toBeInTheDocument();
		await expect(canvas.getByText(/Ingredients/i)).toBeInTheDocument();
		await expect(canvas.getByText(/Steps/i)).toBeInTheDocument();

		// Verify form fields
		await expect(canvas.getByLabelText(/Title/i)).toBeInTheDocument();
	},
};
