import type { Recipe } from "./schema";

export const castIronChicken: Recipe = {
	id: "cast-iron-chicken",
	title: "Sear-Roasted Chicken Thighs",
	description:
		"Perfectly crispy, juicy chicken thighs cooked in a Field Company machined cast iron skillet.",
	cuisine: "American",
	primaryProtein: "Chicken",
	prepTimeMinutes: 10,
	cookTimeMinutes: 25,
	ingredients: [
		{
			id: "ing-1",
			name: "Bone-in, skin-on chicken thighs",
			quantity: 4,
			measurement: "pieces",
		},
		{ id: "ing-2", name: "Kosher salt", quantity: 1, measurement: "tbsp" },
		{ id: "ing-3", name: "Black pepper", quantity: 1, measurement: "tsp" },
		{ id: "ing-4", name: "Avocado oil", quantity: 1, measurement: "tbsp" },
	],
	steps: [
		{
			id: "step-1",
			instruction:
				"Pat the chicken thighs dry with a paper towel. Season generously with salt and pepper.",
			ingredientIds: ["ing-1", "ing-2", "ing-3"],
		},
		{
			id: "step-2",
			instruction:
				"Heat a Field Company cast iron skillet over medium-high heat. Add avocado oil.",
			ingredientIds: ["ing-4"],
		},
		{
			id: "step-3",
			instruction:
				"Place chicken thighs skin-side down in the skillet. Cook undisturbed until the skin is golden and crispy, about 12 minutes.",
			ingredientIds: ["ing-1"],
		},
		{
			id: "step-4",
			instruction:
				"Flip the thighs and transfer the skillet to a 425°F oven. Roast until cooked through, about 10-15 minutes.",
			ingredientIds: ["ing-1"],
		},
	],
};
