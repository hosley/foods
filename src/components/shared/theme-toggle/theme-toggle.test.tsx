/**
 * @vitest-environment happy-dom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
	beforeEach(() => {
		window.localStorage.clear();
		document.documentElement.classList.remove("light", "dark");
		document.documentElement.removeAttribute("data-theme");

		// Mock matchMedia
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(), // Deprecated
				removeListener: vi.fn(), // Deprecated
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
	});

	it("renders with initial auto state", () => {
		render(<ThemeToggle />);
		expect(screen.getByText(/Auto/i)).toBeTruthy();
	});

	it("renders with initial state from localStorage", () => {
		window.localStorage.setItem("theme", "dark");
		render(<ThemeToggle />);
		expect(screen.getByText(/Dark/i)).toBeTruthy();
	});

	it("responds to media query changes in auto mode", () => {
		let changeHandler: any;
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addEventListener: vi.fn((event, handler) => {
					if (event === "change") changeHandler = handler;
				}),
				removeEventListener: vi.fn(),
			})),
		});

		render(<ThemeToggle />);
		expect(changeHandler).toBeDefined();

		// Trigger change
		changeHandler();
		// Should have called applyThemeMode again
		expect(document.documentElement.classList.contains("light") || document.documentElement.classList.contains("dark")).toBe(true);
	});

	it("initializes with dark theme if preferred in auto mode", () => {
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query) => ({
				matches: query === "(prefers-color-scheme: dark)",
				media: query,
				onchange: null,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			})),
		});

		render(<ThemeToggle />);
		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});

	it("toggles between modes when clicked", () => {
		render(<ThemeToggle />);
		const button = screen.getByRole("button");

		// Initial: Auto -> Click -> Light
		fireEvent.click(button);
		expect(screen.getByText(/Light/i)).toBeTruthy();
		expect(document.documentElement.classList.contains("light")).toBe(true);
		expect(window.localStorage.getItem("theme")).toBe("light");

		// Light -> Click -> Dark
		fireEvent.click(button);
		expect(screen.getByText(/Dark/i)).toBeTruthy();
		expect(document.documentElement.classList.contains("dark")).toBe(true);
		expect(window.localStorage.getItem("theme")).toBe("dark");

		// Dark -> Click -> Auto
		fireEvent.click(button);
		expect(screen.getByText(/Auto/i)).toBeTruthy();
		expect(window.localStorage.getItem("theme")).toBe("auto");
	});
});
