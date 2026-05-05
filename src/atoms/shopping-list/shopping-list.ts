import { atom } from 'jotai';
import { getRecipeById } from '../../selectors/get-recipe-by-id/get-recipe-by-id';
import { savedRecipesAtom } from '../saved-recipes/saved-recipes';

export interface AggregatedIngredient {
	measurement: string;
	name: string;
	quantity: number;
}

export const shoppingListAtom = atom<AggregatedIngredient[]>(get => {
	const savedRecipeIds = get(savedRecipesAtom);

	const ingredientMap = savedRecipeIds.reduce((acc, id) => {
		const recipe = getRecipeById(id);
		if (!recipe) {
			return acc;
		}

		recipe.ingredients.forEach(ingredient => {
			const key = `${ingredient.name.toLowerCase()}-${ingredient.measurement.toLowerCase()}`;
			const existing = acc.get(key);

			if (existing) {
				acc.set(key, {
					...existing,
					quantity: existing.quantity + ingredient.quantity,
				});
			} else {
				acc.set(key, {
					measurement: ingredient.measurement,
					name: ingredient.name,
					quantity: ingredient.quantity,
				});
			}
		});

		return acc;
	}, new Map<string, AggregatedIngredient>());

	return Array.from(ingredientMap.values());
});
