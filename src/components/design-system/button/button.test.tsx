/**
 * @vitest-environment happy-dom
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { Button } from "./button";

describe("Button", () => {
	it("renders correctly and forwards ref", () => {
		const ref = React.createRef<HTMLButtonElement>();
		render(<Button ref={ref}>Click Me</Button>);

		const button = screen.getByRole("button", { name: /click me/i });
		expect(button).toBeTruthy();
		expect(ref.current).toBe(button);
	});

	it("handles click events", () => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Click Me</Button>);

		const button = screen.getByRole("button", { name: /click me/i });
		button.click();
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("applies variant classes correctly", () => {
		render(<Button variant="destructive">Destructive Action</Button>);
		const button = screen.getByRole("button", { name: /destructive/i });
		expect(button.className).toContain("bg-destructive");
	});
});
