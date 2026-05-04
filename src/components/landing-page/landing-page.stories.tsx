import type { Meta, StoryObj } from "@storybook/react";
import { LandingPage } from "./landing-page";
import {
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
	createMemoryHistory,
} from "@tanstack/react-router";

const rootRoute = createRootRoute();
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: LandingPage,
});
const routeTree = rootRoute.addChildren([indexRoute]);
const history = createMemoryHistory({ initialEntries: ["/"] });
const router = createRouter({ routeTree, history });

const meta: Meta<typeof LandingPage> = {
	title: "Features/LandingPage",
	component: LandingPage,
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
