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
	typeOfMeal: z.string(),
	typeOfProtein: z.string(),
	cookTimeMinutes: z.number(),
	prepTimeMinutes: z.number(),
});

export const RecipeSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	summary: RecipeSummarySchema,
	ingredients: z.array(IngredientSchema),
	steps: z.array(StepSchema),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
export type Step = z.infer<typeof StepSchema>;
export type RecipeSummary = z.infer<typeof RecipeSummarySchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
