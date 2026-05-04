import type { Meta, StoryObj } from "@storybook/react";
import { DefaultLayout } from "./default-layout";
import {
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
	createMemoryHistory,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
	component: DefaultLayout,
});
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () => <div>Content goes here</div>,
});
const routeTree = rootRoute.addChildren([indexRoute]);
const history = createMemoryHistory({ initialEntries: ["/"] });
const router = createRouter({ routeTree, history });

const meta: Meta<typeof DefaultLayout> = {
	title: "Shared/DefaultLayout",
	component: DefaultLayout,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
			(Story) => (
					<RouterProvider router={router as any}>
							<Story />
					</RouterProvider>
			),
	],};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
