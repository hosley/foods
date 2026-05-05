/**
 * @vitest-environment happy-dom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
	beforeEach(() => {
		window.localStorage.clear();
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.removeAttribute('data-theme');

		// Mock matchMedia
		Object.defineProperty(window, 'matchMedia', {
			value: vi.fn().mockImplementation(query => ({
				addEventListener: vi.fn(),
				addListener: vi.fn(), // Deprecated
				dispatchEvent: vi.fn(),
				matches: false,
				media: query,
				onchange: null,
				removeEventListener: vi.fn(),
				removeListener: vi.fn(), // Deprecated
			})),
			writable: true,
		});
	});

	it('renders with initial auto state', () => {
		render(<ThemeToggle />);
		expect(screen.getByText(/Auto/i)).toBeTruthy();
	});

	it('renders with initial state from localStorage', () => {
		window.localStorage.setItem('theme', 'dark');
		render(<ThemeToggle />);
		expect(screen.getByText(/Dark/i)).toBeTruthy();
	});

	it('responds to media query changes in auto mode', () => {
		let changeHandler: any;
		Object.defineProperty(window, 'matchMedia', {
			value: vi.fn().mockImplementation(query => ({
				addEventListener: vi.fn((event, handler) => {
					if (event === 'change') changeHandler = handler;
				}),
				matches: false,
				media: query,
				onchange: null,
				removeEventListener: vi.fn(),
			})),
			writable: true,
		});

		render(<ThemeToggle />);
		expect(changeHandler).toBeDefined();

		// Trigger change
		changeHandler();
		// Should have called applyThemeMode again
		expect(
			document.documentElement.classList.contains('light') || document.documentElement.classList.contains('dark'),
		).toBe(true);
	});

	it('initializes with dark theme if preferred in auto mode', () => {
		Object.defineProperty(window, 'matchMedia', {
			value: vi.fn().mockImplementation(query => ({
				addEventListener: vi.fn(),
				matches: query === '(prefers-color-scheme: dark)',
				media: query,
				onchange: null,
				removeEventListener: vi.fn(),
			})),
			writable: true,
		});

		render(<ThemeToggle />);
		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});

	it('toggles between modes when clicked', () => {
		render(<ThemeToggle />);
		const button = screen.getByRole('button');

		// Initial: Auto -> Click -> Light
		fireEvent.click(button);
		expect(screen.getByText(/Light/i)).toBeTruthy();
		expect(document.documentElement.classList.contains('light')).toBe(true);
		expect(window.localStorage.getItem('theme')).toBe('light');

		// Light -> Click -> Dark
		fireEvent.click(button);
		expect(screen.getByText(/Dark/i)).toBeTruthy();
		expect(document.documentElement.classList.contains('dark')).toBe(true);
		expect(window.localStorage.getItem('theme')).toBe('dark');

		// Dark -> Click -> Auto
		fireEvent.click(button);
		expect(screen.getByText(/Auto/i)).toBeTruthy();
		expect(window.localStorage.getItem('theme')).toBe('auto');
	});
});
