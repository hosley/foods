import { allRecipes } from "../../recipes/all-recipes";
import type { RecipeSummary } from "../../recipes/schema";

export const getSearchIndex = (): RecipeSummary[] => {
	return allRecipes.map((recipe) => ({
		id: recipe.id,
		title: recipe.title,
		cuisine: recipe.cuisine,
		primaryProtein: recipe.primaryProtein,
		totalTimeMinutes: recipe.prepTimeMinutes + recipe.cookTimeMinutes,
		searchableIngredients: recipe.ingredients.map((i) => i.name.toLowerCase()),
		searchableEquipment: [], // In the future, this can be extracted from steps or added to RecipeSchema
	}));
};
