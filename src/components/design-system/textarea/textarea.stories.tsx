import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
	component: Textarea,
	tags: ['autodocs'],
	title: 'Design System/Textarea',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: 'Type your content here...',
	},
};
