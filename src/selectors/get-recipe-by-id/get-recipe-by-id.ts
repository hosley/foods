import { allRecipes } from "../../recipes";
import type { Recipe } from "../../recipes";

export const getRecipeById = (id: string): Recipe | undefined => {
	return allRecipes.find((recipe) => recipe.id === id);
};
