import { describe, it, expect } from "vitest";
import {
	getContent,
	getLandingPageContent,
	getShoppingListContent,
	getRecipePageContent,
	getCommonContent,
} from "./get-content";

describe("get-content selectors", () => {
	it("returns the full AppContent object", () => {
		const content = getContent();
		expect(content).toHaveProperty("landingPage");
		expect(content).toHaveProperty("shoppingList");
	});

	it("returns landing page content", () => {
		const landing = getLandingPageContent();
		expect(landing).toHaveProperty("title");
		expect(landing).toHaveProperty("description");
	});

	it("returns shopping list content", () => {
		const shopping = getShoppingListContent();
		expect(shopping).toHaveProperty("title");
		expect(shopping).toHaveProperty("empty");
	});

	it("returns recipe page content", () => {
		const recipe = getRecipePageContent();
		expect(recipe).toHaveProperty("saveButton");
		expect(recipe).toHaveProperty("sections");
	});

	it("returns common content", () => {
		const common = getCommonContent();
		expect(common).toHaveProperty("appName");
	});
});
