import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
	argTypes: {
		size: {
			control: 'select',
			options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
		},
		variant: {
			control: 'select',
			options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
		},
	},
	component: Button,
	tags: ['autodocs'],
	title: 'Design System/Button',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'Button',
		size: 'default',
		variant: 'default',
	},
};

export const Destructive: Story = {
	args: {
		children: 'Destructive',
		variant: 'destructive',
	},
};

export const Outline: Story = {
	args: {
		children: 'Outline',
		variant: 'outline',
	},
};

export const Secondary: Story = {
	args: {
		children: 'Secondary',
		variant: 'secondary',
	},
};

export const Ghost: Story = {
	args: {
		children: 'Ghost',
		variant: 'ghost',
	},
};

export const Link: Story = {
	args: {
		children: 'Link',
		variant: 'link',
	},
};
