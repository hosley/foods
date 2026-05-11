import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'jotai';
import { ImportPreviewModal } from './import-preview-modal';

const meta = {
	component: ImportPreviewModal,
	decorators: [
		Story => (
			<Provider>
				<Story />
			</Provider>
		),
	],
	title: 'Components/ImportPreviewModal',
} satisfies Meta<typeof ImportPreviewModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Note: To see the modal in storybook, we must pass a valid encoded share string.
// As a placeholder, we pass an invalid one, which will just call onClearShare.
// A real valid encoded plan would render the dialog.
export const Default: Story = {
	args: {
		onClearShare: () => console.log('Clear share called'),
		shareCode: 'invalid',
	},
};
