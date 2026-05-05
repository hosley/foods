import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './theme-toggle';

const meta: Meta<typeof ThemeToggle> = {
	component: ThemeToggle,
	tags: ['autodocs'],
	title: 'Shared/ThemeToggle',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
