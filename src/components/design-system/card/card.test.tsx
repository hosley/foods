/**
 * @vitest-environment happy-dom
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";

describe("Card", () => {
	it("renders all card components correctly", () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Title</CardTitle>
					<CardDescription>Description</CardDescription>
				</CardHeader>
				<CardContent>Content</CardContent>
				<CardFooter>Footer</CardFooter>
			</Card>
		);
		expect(screen.getByText("Title")).toBeTruthy();
		expect(screen.getByText("Description")).toBeTruthy();
		expect(screen.getByText("Content")).toBeTruthy();
		expect(screen.getByText("Footer")).toBeTruthy();
	});
});
