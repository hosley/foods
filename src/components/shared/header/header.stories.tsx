import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './header';

const meta: Meta<typeof Header> = {
	component: Header,
	tags: ['autodocs'],
	title: 'Shared/Header',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
