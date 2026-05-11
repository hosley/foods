import type { Meta, StoryObj } from '@storybook/react';
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from '@tanstack/react-router';
import { Provider } from 'jotai';
import { MealPlannerPage } from './meal-planner-page';

const rootRoute = createRootRoute();
const indexRoute = createRoute({
	component: MealPlannerPage,
	getParentRoute: () => rootRoute,
	path: '/meal-planner',
});
const routeTree = rootRoute.addChildren([indexRoute]);

const router = createRouter({
	history: createMemoryHistory({ initialEntries: ['/meal-planner'] }),
	routeTree,
});

const meta = {
	component: MealPlannerPage,
	decorators: [
		() => (
			<Provider>
				<RouterProvider router={router} />
			</Provider>
		),
	],
	title: 'Pages/MealPlannerPage',
} satisfies Meta<typeof MealPlannerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
