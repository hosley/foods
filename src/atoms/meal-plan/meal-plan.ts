import { atom } from 'jotai';
import { getMealPlan, purgeStaleData, saveRecipesForDate, type WeeklyMealPlan } from '#/lib/meal-plan-storage';

/**
 * The core atom containing the meal plan data.
 */
export const mealPlanAtom = atom<WeeklyMealPlan>({});

/**
 * An atom to trigger loading the meal plan from IndexedDB.
 */
export const loadMealPlanAtom = atom(null, async (_get, set) => {
	await purgeStaleData();
	const plan = await getMealPlan();
	set(mealPlanAtom, plan);
});

/**
 * An atom to add a recipe to a specific date and meal.
 */
export const addRecipeToMealAtom = atom(
	null,
	async (
		get,
		set,
		{ date, mealName, time, recipeId }: { date: string; mealName: string; time: string; recipeId: string },
	) => {
		const current = get(mealPlanAtom);
		const dayMeals = current[date] ?? [];
		const meal = dayMeals.find(m => m.mealName === mealName);

		const currentRecipeIds = meal?.recipeIds ?? [];
		const newRecipeIds = currentRecipeIds.includes(recipeId) ? currentRecipeIds : [...currentRecipeIds, recipeId];

		await saveRecipesForDate(date, mealName, time, newRecipeIds);

		// Re-fetch to ensure sync with storage
		const updatedPlan = await getMealPlan();
		set(mealPlanAtom, updatedPlan);
	},
);
