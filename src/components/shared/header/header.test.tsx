/**
 * @vitest-environment happy-dom
 */

import { createMemoryHistory, createRootRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './header';

describe('Header', () => {
	it('renders correctly with navigation links and rebranded name', async () => {
		const rootRoute = createRootRoute({
			component: () => (
				<>
					<Header />
					<Outlet />
				</>
			),
		});
		const history = createMemoryHistory({ initialEntries: ['/'] });
		const router = createRouter({ history, routeTree: rootRoute });

		render(<RouterProvider router={router} />);

		expect(await screen.findByText(/sley Foods/i)).toBeTruthy();
		expect(screen.getByText(/^Ho$/i)).toBeTruthy(); // Use start/end anchors to be specific to the stylized Ho
		expect(screen.getByText(/Home/i)).toBeTruthy();
		expect(screen.getByText(/Shopping List/i)).toBeTruthy();

		expect(screen.queryByText(/About/i)).toBeNull();
		expect(screen.queryByText(/Docs/i)).toBeNull();
	});
});
