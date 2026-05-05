import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

const meta: Meta<typeof Card> = {
	component: Card,
	tags: ['autodocs'],
	title: 'Design System/Card',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Recipe Title</CardTitle>
				<CardDescription>Cuisine Type</CardDescription>
			</CardHeader>
			<CardContent>
				<p>This is where the recipe details go.</p>
			</CardContent>
			<CardFooter>
				<p>Prep: 10m | Cook: 20m</p>
			</CardFooter>
		</Card>
	),
};
