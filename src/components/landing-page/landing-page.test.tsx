/**
 * @vitest-environment happy-dom
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
	createMemoryHistory,
} from "@tanstack/react-router";
import { LandingPage } from "./landing-page";

describe("LandingPage", () => {
	it("renders a list of recipes", async () => {
		const rootRoute = createRootRoute();
		const indexRoute = createRoute({
			getParentRoute: () => rootRoute,
			path: "/",
			component: LandingPage,
		});
		const routeTree = rootRoute.addChildren([indexRoute]);
		const history = createMemoryHistory({ initialEntries: ["/"] });
		const router = createRouter({ routeTree, history });

		render(<RouterProvider router={router} />);

		expect(await screen.findByText(/Discover Exceptional Recipes/i)).toBeTruthy();
		expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
	});
});
