import type { Meta, StoryObj } from "@storybook/react";
import { ShoppingListPage } from "./shopping-list-page";
import { Provider, createStore } from "jotai";
import { savedRecipesAtom } from "../../../atoms/saved-recipes/saved-recipes";
import {
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
	createMemoryHistory,
} from "@tanstack/react-router";

const rootRoute = createRootRoute();
const shoppingListRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/shopping-list",
	component: ShoppingListPage,
});
const routeTree = rootRoute.addChildren([shoppingListRoute]);
const history = createMemoryHistory({ initialEntries: ["/shopping-list"] });
const router = createRouter({ routeTree, history });

const meta: Meta<typeof ShoppingListPage> = {
	title: "Features/ShoppingListPage",
	component: ShoppingListPage,
	decorators: [
		(Story) => {
			const store = createStore();
			store.set(savedRecipesAtom, ["basil-pesto-pasta"]);
			return (
				<Provider store={store}>
				        <RouterProvider router={router as any}>
				                <Story />
				        </RouterProvider>
				</Provider>			);
		},
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
	decorators: [
		(Story) => {
			const store = createStore();
			return (
				<Provider store={store}>
				        <RouterProvider router={router as any}>
				                <Story />
				        </RouterProvider>
				</Provider>			);
		},
	],
};
