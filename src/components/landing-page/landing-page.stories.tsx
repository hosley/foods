import type { Meta, StoryObj } from '@storybook/react';
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
