import { allRecipes } from "../../recipes/all-recipes";
import type { Recipe } from "../../recipes/schema";

export const getAllRecipes = (): Recipe[] => {
	return allRecipes;
};
