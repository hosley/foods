import { allRecipes } from "../../recipes";
import type { Recipe } from "../../recipes";

export const getAllRecipes = (): Recipe[] => {
	return allRecipes;
};
