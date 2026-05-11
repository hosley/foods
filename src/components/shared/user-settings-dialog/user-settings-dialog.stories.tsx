import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Provider } from 'jotai';
import { UserSettingsDialog } from './user-settings-dialog';

const meta = {
	component: UserSettingsDialog,
	decorators: [
		Story => (
			<Provider>
				<div className="p-10 bg-sea-ink flex items-center justify-center">
					<Story />
				</div>
			</Provider>
		),
	],
	title: 'Components/UserSettingsDialog',
} satisfies Meta<typeof UserSettingsDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('button');
		await userEvent.click(trigger);

		const body = within(canvasElement.ownerDocument.body);

		await expect(await body.findByText(/User Settings/i)).toBeInTheDocument();
		await expect(body.getByText(/Default Meal Times/i)).toBeInTheDocument();
		await expect(body.getByText(/Import Strategy/i)).toBeInTheDocument();

		// Check strategy buttons
		const overwriteBtn = body.getByRole('button', { name: /^Overwrite$/i });
		const mergeBtn = body.getByRole('button', { name: /^Merge$/i });

		await expect(overwriteBtn).toBeInTheDocument();
		await expect(mergeBtn).toBeInTheDocument();

		// Toggle strategy (just verify click doesn't crash,
		// and button text remains to confirm it's still there)
		await userEvent.click(mergeBtn);
		await expect(mergeBtn).toBeInTheDocument();

		await userEvent.click(overwriteBtn);
		await expect(overwriteBtn).toBeInTheDocument();
	},
};
