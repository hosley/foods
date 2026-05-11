import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from '@tanstack/react-router';
import { LandingPage } from './landing-page';

const rootRoute = createRootRoute();
const indexRoute = createRoute({
	component: LandingPage,
	getParentRoute: () => rootRoute,
	path: '/',
});
const routeTree = rootRoute.addChildren([indexRoute]);
const history = createMemoryHistory({ initialEntries: ['/'] });
const router = createRouter({ history, routeTree });

const meta: Meta<typeof LandingPage> = {
	component: LandingPage,
	decorators: [
		Story => (
			<RouterProvider router={router as any}>
				<Story />
			</RouterProvider>
		),
	],
	title: 'Features/LandingPage',
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(await canvas.findByText(/Discover Exceptional Recipes/i)).toBeInTheDocument();

		// Verify recipe cards render
		await expect(canvas.getByText(/Fresh Basil Pesto Pasta/i)).toBeInTheDocument();
		await expect(canvas.getByText(/Sear-Roasted Chicken Thighs/i)).toBeInTheDocument();
	},
};
