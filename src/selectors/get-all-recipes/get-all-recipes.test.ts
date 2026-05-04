import { describe, it, expect } from "vitest";
import { getAllRecipes } from "./get-all-recipes";

describe("getAllRecipes", () => {
	it("returns all recipes", () => {
		const recipes = getAllRecipes();
		expect(recipes.length).toBeGreaterThan(0);
		expect(recipes[0]).toHaveProperty("id");
		expect(recipes[0]).toHaveProperty("title");
	});
});
