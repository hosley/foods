import { z } from "zod";

export const IngredientSchema = z.object({
	id: z.string(),
	name: z.string(),
	quantity: z.number(),
	measurement: z.string(),
});

export const StepSchema = z.object({
	id: z.string(),
	instruction: z.string(),
	ingredientIds: z.array(z.string()),
});

export const RecipeSummarySchema = z.object({
	id: z.string(),
	title: z.string(),
	cuisine: z.string(),
	primaryProtein: z.string().optional(),
	totalTimeMinutes: z.number().int(),
	searchableIngredients: z.array(z.string()).default([]),
	searchableEquipment: z.array(z.string()).default([]),
});

export const RecipeSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	cuisine: z.string(),
	primaryProtein: z.string().optional(),
	prepTimeMinutes: z.number().int(),
	cookTimeMinutes: z.number().int(),
	ingredients: z.array(IngredientSchema),
	steps: z.array(StepSchema),
});

export const SearchIndexSchema = z.array(RecipeSummarySchema);

export const MealPlanSchema = z.object({
	id: z.string(),
	startDate: z.string(),
	recipes: z.array(z.string()), // IDs of recipes
});

export type Ingredient = z.infer<typeof IngredientSchema>;
export type Step = z.infer<typeof StepSchema>;
export type RecipeSummary = z.infer<typeof RecipeSummarySchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type SearchIndex = z.infer<typeof SearchIndexSchema>;
export type MealPlan = z.infer<typeof MealPlanSchema>;
