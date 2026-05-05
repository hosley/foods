import { allRecipes } from '../../recipes/all-recipes';
import type { RecipeSummary } from '../../recipes/schema';

export const getSearchIndex = (): RecipeSummary[] => {
	return allRecipes.map(recipe => ({
		cuisine: recipe.cuisine,
		id: recipe.id,
		primaryProtein: recipe.primaryProtein,
		searchableEquipment: [], // In the future, this can be extracted from steps or added to RecipeSchema
		searchableIngredients: recipe.ingredients.map(i => i.name.toLowerCase()),
		title: recipe.title,
		totalTimeMinutes: recipe.prepTimeMinutes + recipe.cookTimeMinutes,
	}));
};
