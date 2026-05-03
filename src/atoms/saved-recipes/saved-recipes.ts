import { atom } from "jotai";

export const savedRecipesAtom = atom<string[]>([]);

export const toggleSavedRecipeAtom = atom(
	null,
	(get, set, recipeId: string) => {
		const saved = get(savedRecipesAtom);
		if (saved.includes(recipeId)) {
			set(
				savedRecipesAtom,
				saved.filter((id) => id !== recipeId),
			);
		} else {
			set(savedRecipesAtom, [...saved, recipeId]);
		}
	},
);
