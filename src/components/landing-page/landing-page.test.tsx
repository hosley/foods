/**
 * @vitest-environment happy-dom
 */

import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LandingPage } from './landing-page';

describe('LandingPage', () => {
	it('renders a list of recipes', async () => {
		const rootRoute = createRootRoute();
		const indexRoute = createRoute({
			component: LandingPage,
			getParentRoute: () => rootRoute,
			path: '/',
		});
		const routeTree = rootRoute.addChildren([indexRoute]);
		const history = createMemoryHistory({ initialEntries: ['/'] });
		const router = createRouter({ history, routeTree });

		render(<RouterProvider router={router} />);

		expect(await screen.findByText(/Discover Exceptional Recipes/i)).toBeTruthy();
		expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
	});
});
