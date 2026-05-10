/**
 * @vitest-environment happy-dom
 */

import { vi } from 'vitest';

// Mock storage via aliased path FIRST
vi.mock('#/lib/meal-plan-storage', () => ({
	getMealPlan: vi.fn().mockResolvedValue({}),
	purgeStaleData: vi.fn().mockResolvedValue(undefined),
}));

import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getCommonContent } from '../../../selectors/get-content/get-content';
import { DefaultLayout } from './default-layout';

describe('DefaultLayout', () => {
	it('renders the layout with header and footer', async () => {
		const content = getCommonContent();
		const rootRoute = createRootRoute({
			component: DefaultLayout,
		});
		const indexRoute = createRoute({
			component: () => null,
			getParentRoute: () => rootRoute,
			path: '/',
		});
		const routeTree = rootRoute.addChildren([indexRoute]);
		const history = createMemoryHistory({ initialEntries: ['/'] });
		const router = createRouter({ history, routeTree });

		render(<RouterProvider router={router} />);

		// Verify main structural elements
		expect(await screen.findByRole('banner')).toBeTruthy(); // Header
		expect(screen.getByRole('contentinfo')).toBeTruthy(); // Footer
		expect(screen.getByRole('main')).toBeTruthy(); // Main content area

		// Header navigation links
		const nav = screen.getByRole('navigation');
		expect(nav).toBeTruthy();

		// The app name link (Stylized as Ho + sley Foods)
		expect(await screen.findByRole('link', { name: /Ho sley Foods/i })).toBeTruthy();

		// Navigation items - testing specifically within nav to avoid footer duplicates
		const homeLink = screen.getByRole('link', { name: /Home/i });
		expect(homeLink).toBeTruthy();

		// Footer content
		const footer = screen.getByRole('contentinfo');
		expect(footer.textContent).toContain(new Date().getFullYear().toString());
		expect(footer.textContent).toContain(content.footer.rights);
	});
});
