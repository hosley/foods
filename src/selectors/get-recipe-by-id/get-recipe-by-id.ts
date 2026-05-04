import { allRecipes } from "../../recipes/all-recipes";
import type { Recipe } from "../../recipes/schema";

export const getRecipeById = (id: string): Recipe | undefined => {
	return allRecipes.find((recipe) => recipe.id === id);
};
