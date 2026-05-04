import { describe, it, expect } from "vitest";
import { getRecipeById } from "./get-recipe-by-id";

describe("getRecipeById", () => {
	it("returns the correct recipe when id exists", () => {
		const recipe = getRecipeById("basil-pesto-pasta");
		expect(recipe).toBeDefined();
		expect(recipe?.id).toBe("basil-pesto-pasta");
	});

	it("returns undefined when id does not exist", () => {
		const recipe = getRecipeById("non-existent-id");
		expect(recipe).toBeUndefined();
	});
});
