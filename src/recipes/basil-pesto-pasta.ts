import type { Recipe } from "./schema";

export const basilPestoPasta: Recipe = {
	id: "basil-pesto-pasta",
	title: "Fresh Basil Pesto Pasta",
	description:
		"A vibrant, herbaceous pesto tossed with al dente pasta and toasted pine nuts.",
	summary: {
		typeOfMeal: "Dinner",
		typeOfProtein: "Vegetarian",
		cookTimeMinutes: 15,
		prepTimeMinutes: 15,
	},
	ingredients: [
		{
			id: "ing-1",
			name: "Fresh basil leaves",
			quantity: 2,
			measurement: "cups",
		},
		{ id: "ing-2", name: "Pine nuts", quantity: 0.33, measurement: "cup" },
		{ id: "ing-3", name: "Garlic cloves", quantity: 2, measurement: "pieces" },
		{
			id: "ing-4",
			name: "Parmesan cheese, grated",
			quantity: 0.5,
			measurement: "cup",
		},
		{
			id: "ing-5",
			name: "Extra virgin olive oil",
			quantity: 0.5,
			measurement: "cup",
		},
		{ id: "ing-6", name: "Linguine pasta", quantity: 1, measurement: "lb" },
		{ id: "ing-7", name: "Kosher salt", quantity: 1, measurement: "tsp" },
	],
	steps: [
		{
			id: "step-1",
			instruction:
				"Bring a large pot of salted water to a boil. Cook the linguine according to package directions until al dente.",
			ingredientIds: ["ing-6", "ing-7"],
		},
		{
			id: "step-2",
			instruction:
				"In a food processor, combine basil, pine nuts, garlic, and parmesan. Pulse until coarsely chopped.",
			ingredientIds: ["ing-1", "ing-2", "ing-3", "ing-4"],
		},
		{
			id: "step-3",
			instruction:
				"With the processor running, slowly drizzle in the olive oil until a smooth emulsion forms.",
			ingredientIds: ["ing-5"],
		},
		{
			id: "step-4",
			instruction:
				"Drain the pasta, reserving 1/2 cup of pasta water. Toss the pasta with the pesto, adding pasta water as needed to create a glossy sauce.",
			ingredientIds: ["ing-6"],
		},
	],
};
