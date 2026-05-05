import type { Meta, StoryObj } from '@storybook/react';
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from '@tanstack/react-router';
import { createStore, Provider } from 'jotai';
import { savedRecipesAtom } from '../../../atoms/saved-recipes/saved-recipes';
import { ShoppingListPage } from './shopping-list-page';

const rootRoute = createRootRoute();
const shoppingListRoute = createRoute({
	component: ShoppingListPage,
	getParentRoute: () => rootRoute,
	path: '/shopping-list',
});
const routeTree = rootRoute.addChildren([shoppingListRoute]);
const history = createMemoryHistory({ initialEntries: ['/shopping-list'] });
const router = createRouter({ history, routeTree });

const meta: Meta<typeof ShoppingListPage> = {
	component: ShoppingListPage,
	decorators: [
		Story => {
			const store = createStore();
			store.set(savedRecipesAtom, ['basil-pesto-pasta']);
			return (
				<Provider store={store}>
					<RouterProvider router={router as any}>
						<Story />
					</RouterProvider>
				</Provider>
			);
		},
	],
	title: 'Features/ShoppingListPage',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
	decorators: [
		Story => {
			const store = createStore();
			return (
				<Provider store={store}>
					<RouterProvider router={router as any}>
						<Story />
					</RouterProvider>
				</Provider>
			);
		},
	],
};
