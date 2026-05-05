import type { Recipe } from './schema';

export const castIronChicken: Recipe = {
	cookTimeMinutes: 25,
	cuisine: 'American',
	description: 'Perfectly crispy, juicy chicken thighs cooked in a Field Company machined cast iron skillet.',
	id: 'cast-iron-chicken',
	ingredients: [
		{
			id: 'ing-1',
			measurement: 'pieces',
			name: 'Bone-in, skin-on chicken thighs',
			quantity: 4,
		},
		{ id: 'ing-2', measurement: 'tbsp', name: 'Kosher salt', quantity: 1 },
		{ id: 'ing-3', measurement: 'tsp', name: 'Black pepper', quantity: 1 },
		{ id: 'ing-4', measurement: 'tbsp', name: 'Avocado oil', quantity: 1 },
	],
	prepTimeMinutes: 10,
	primaryProtein: 'Chicken',
	steps: [
		{
			id: 'step-1',
			ingredientIds: ['ing-1', 'ing-2', 'ing-3'],
			instruction: 'Pat the chicken thighs dry with a paper towel. Season generously with salt and pepper.',
		},
		{
			id: 'step-2',
			ingredientIds: ['ing-4'],
			instruction: 'Heat a Field Company cast iron skillet over medium-high heat. Add avocado oil.',
		},
		{
			id: 'step-3',
			ingredientIds: ['ing-1'],
			instruction:
				'Place chicken thighs skin-side down in the skillet. Cook undisturbed until the skin is golden and crispy, about 12 minutes.',
		},
		{
			id: 'step-4',
			ingredientIds: ['ing-1'],
			instruction:
				'Flip the thighs and transfer the skillet to a 425°F oven. Roast until cooked through, about 10-15 minutes.',
		},
	],
	title: 'Sear-Roasted Chicken Thighs',
};
