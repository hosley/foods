import { z } from 'zod';

export const IngredientSchema = z.object({
	id: z.string(),
	measurement: z.string(),
	name: z.string(),
	quantity: z.number(),
});

export const StepSchema = z.object({
	id: z.string(),
	ingredientIds: z.array(z.string()),
	instruction: z.string(),
});

export const RecipeSummarySchema = z.object({
	cuisine: z.string(),
	id: z.string(),
	primaryProtein: z.string().optional(),
	searchableEquipment: z.array(z.string()).default([]),
	searchableIngredients: z.array(z.string()).default([]),
	title: z.string(),
	totalTimeMinutes: z.number().int(),
});

export const RecipeSchema = z.object({
	cookTimeMinutes: z.number().int(),
	cuisine: z.string(),
	description: z.string(),
	id: z.string(),
	ingredients: z.array(IngredientSchema),
	prepTimeMinutes: z.number().int(),
	primaryProtein: z.string().optional(),
	steps: z.array(StepSchema),
	title: z.string(),
});

export const SearchIndexSchema = z.array(RecipeSummarySchema);

export const MealPlanSchema = z.object({
	id: z.string(),
	recipes: z.array(z.string()), // IDs of recipes
	startDate: z.string(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
export type Step = z.infer<typeof StepSchema>;
export type RecipeSummary = z.infer<typeof RecipeSummarySchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type SearchIndex = z.infer<typeof SearchIndexSchema>;
export type MealPlan = z.infer<typeof MealPlanSchema>;
