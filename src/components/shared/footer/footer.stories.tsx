import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './footer';

const meta: Meta<typeof Footer> = {
	component: Footer,
	tags: ['autodocs'],
	title: 'Shared/Footer',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
