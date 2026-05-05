import type { Meta, StoryObj } from '@storybook/react';
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from '@tanstack/react-router';
import { DefaultLayout } from './default-layout';

const rootRoute = createRootRoute({
	component: DefaultLayout,
});
const indexRoute = createRoute({
	component: () => <div>Content goes here</div>,
	getParentRoute: () => rootRoute,
	path: '/',
});
const routeTree = rootRoute.addChildren([indexRoute]);
const history = createMemoryHistory({ initialEntries: ['/'] });
const router = createRouter({ history, routeTree });

const meta: Meta<typeof DefaultLayout> = {
	component: DefaultLayout,
	decorators: [
		Story => (
			<RouterProvider router={router as any}>
				<Story />
			</RouterProvider>
		),
	],
	parameters: {
		layout: 'fullscreen',
	},
	title: 'Shared/DefaultLayout',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
