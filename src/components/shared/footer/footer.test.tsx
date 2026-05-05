/**
 * @vitest-environment happy-dom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './footer';

describe('Footer', () => {
	it('renders correctly with current year and rebranded name', () => {
		render(<Footer />);
		const year = new Date().getFullYear().toString();
		expect(screen.getByText(new RegExp(year))).toBeTruthy();
		expect(screen.getByText(/Hosley Foods/i)).toBeTruthy();
		expect(screen.queryByText(/Built with TanStack Start/i)).toBeNull();
	});
});
