import { atom } from "jotai";
import { savedRecipesAtom } from "../saved-recipes";
import { getRecipeById } from "../../selectors/get-recipe-by-id";

export interface AggregatedIngredient {
	name: string;
	quantity: number;
	measurement: string;
}

export const shoppingListAtom = atom<AggregatedIngredient[]>((get) => {
	const savedRecipeIds = get(savedRecipesAtom);
	const ingredientMap = new Map<string, AggregatedIngredient>();

	for (const id of savedRecipeIds) {
		const recipe = getRecipeById(id);
		if (!recipe) continue;

		for (const ingredient of recipe.ingredients) {
			const key = `${ingredient.name.toLowerCase()}-${ingredient.measurement.toLowerCase()}`;
			const existing = ingredientMap.get(key);

			if (existing) {
				ingredientMap.set(key, {
					...existing,
					quantity: existing.quantity + ingredient.quantity,
				});
			} else {
				ingredientMap.set(key, {
					name: ingredient.name,
					quantity: ingredient.quantity,
					measurement: ingredient.measurement,
				});
			}
		}
	}

	return Array.from(ingredientMap.values());
});
