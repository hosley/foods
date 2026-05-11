import { get, update } from 'idb-keyval';

/**
 * Represents a single meal entry on a given date.
 */
export interface MealEntry {
	mealName: string;
	recipeIds: string[];
	time: string;
}

/**
 * Represents the entire meal plan, keyed by date string (YYYY-MM-DD).
 */
export interface WeeklyMealPlan {
	[date: string]: MealEntry[];
}

const MEAL_PLAN_KEY = 'meal-plan-data';

/**
 * Retrieves the entire meal plan from IndexedDB.
 */
export const getMealPlan = async (): Promise<WeeklyMealPlan> => {
	const plan = await get<WeeklyMealPlan>(MEAL_PLAN_KEY);
	return plan ?? {};
};

/**
 * Saves a list of recipe IDs to a specific date and meal slot.
 */
export const saveRecipesForDate = async (
	date: string,
	mealName: string,
	time: string,
	recipeIds: string[],
): Promise<void> => {
	await update<WeeklyMealPlan>(MEAL_PLAN_KEY, val => {
		const current = val ?? {};
		const dayMeals = current[date] ?? [];

		const mealIndex = dayMeals.findIndex(m => m.mealName === mealName);
		const newMeal: MealEntry = { mealName, recipeIds, time };

		if (mealIndex >= 0) {
			dayMeals[mealIndex] = newMeal;
		} else {
			dayMeals.push(newMeal);
		}

		return {
			...current,
			[date]: dayMeals,
		};
	});
};

/**
 * Saves all meals for a given date, replacing any existing data for that date.
 */
export const saveDayMeals = async (date: string, meals: MealEntry[]): Promise<void> => {
	await update<WeeklyMealPlan>(MEAL_PLAN_KEY, val => {
		const current = val ?? {};
		return {
			...current,
			[date]: meals,
		};
	});
};

/**
 * Saves multiple days of meals at once.
 */
export const bulkSaveMeals = async (plan: WeeklyMealPlan): Promise<void> => {
	await update<WeeklyMealPlan>(MEAL_PLAN_KEY, val => {
		const current = val ?? {};
		return {
			...current,
			...plan,
		};
	});
};

/**
 * Removes a specific meal entry from a date.
 */
export const removeMealFromDate = async (date: string, mealName: string): Promise<void> => {
	await update<WeeklyMealPlan>(MEAL_PLAN_KEY, val => {
		const current = val ?? {};
		const dayMeals = current[date] ?? [];
		const updated = dayMeals.filter(m => m.mealName !== mealName);

		return {
			...current,
			[date]: updated,
		};
	});
};

/**
 * Identifies and deletes meal plan entries that are stale based on the Wednesday rule.
 */
export const purgeStaleData = async (): Promise<void> => {
	const now = new Date();
	const currentDay = now.getDay();
	const daysSinceWednesday = (currentDay + 7 - 3) % 7;

	const mostRecentWednesday = new Date(now);
	mostRecentWednesday.setDate(now.getDate() - daysSinceWednesday);
	mostRecentWednesday.setHours(0, 0, 0, 0);

	const lastSaturdayToPurge = new Date(mostRecentWednesday);
	lastSaturdayToPurge.setDate(mostRecentWednesday.getDate() - 4);
	const thresholdStr = lastSaturdayToPurge.toISOString().split('T')[0];
	if (!thresholdStr) return;

	await update<WeeklyMealPlan>(MEAL_PLAN_KEY, val => {
		if (!val) return {};

		const updated: WeeklyMealPlan = {};
		for (const date of Object.keys(val)) {
			if (date > thresholdStr) {
				const entries = val[date];
				if (entries) {
					updated[date] = entries;
				}
			}
		}
		return updated;
	});
};
