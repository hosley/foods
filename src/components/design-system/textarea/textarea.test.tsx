/**
 * @vitest-environment happy-dom
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
	it("renders correctly", () => {
		render(<Textarea placeholder="Test Textarea" />);
		expect(screen.getByPlaceholderText("Test Textarea")).toBeTruthy();
	});
});
