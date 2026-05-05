import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '../label/label';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
	component: Checkbox,
	tags: ['autodocs'],
	title: 'Design System/Checkbox',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="flex items-center space-x-2">
			<Checkbox id="terms" />
			<Label htmlFor="terms">Accept terms and conditions</Label>
		</div>
	),
};
