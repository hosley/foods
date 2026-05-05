import type { Recipe } from './schema';

export const basilPestoPasta: Recipe = {
	cookTimeMinutes: 15,
	cuisine: 'Italian',
	description: 'A vibrant, herbaceous pesto tossed with al dente pasta and toasted pine nuts.',
	id: 'basil-pesto-pasta',
	ingredients: [
		{
			id: 'ing-1',
			measurement: 'cups',
			name: 'Fresh basil leaves',
			quantity: 2,
		},
		{ id: 'ing-2', measurement: 'cup', name: 'Pine nuts', quantity: 0.33 },
		{ id: 'ing-3', measurement: 'pieces', name: 'Garlic cloves', quantity: 2 },
		{
			id: 'ing-4',
			measurement: 'cup',
			name: 'Parmesan cheese, grated',
			quantity: 0.5,
		},
		{
			id: 'ing-5',
			measurement: 'cup',
			name: 'Extra virgin olive oil',
			quantity: 0.5,
		},
		{ id: 'ing-6', measurement: 'lb', name: 'Linguine pasta', quantity: 1 },
		{ id: 'ing-7', measurement: 'tsp', name: 'Kosher salt', quantity: 1 },
	],
	prepTimeMinutes: 15,
	primaryProtein: 'Vegetarian',
	steps: [
		{
			id: 'step-1',
			ingredientIds: ['ing-6', 'ing-7'],
			instruction:
				'Bring a large pot of salted water to a boil. Cook the linguine according to package directions until al dente.',
		},
		{
			id: 'step-2',
			ingredientIds: ['ing-1', 'ing-2', 'ing-3', 'ing-4'],
			instruction: 'In a food processor, combine basil, pine nuts, garlic, and parmesan. Pulse until coarsely chopped.',
		},
		{
			id: 'step-3',
			ingredientIds: ['ing-5'],
			instruction: 'With the processor running, slowly drizzle in the olive oil until a smooth emulsion forms.',
		},
		{
			id: 'step-4',
			ingredientIds: ['ing-6'],
			instruction:
				'Drain the pasta, reserving 1/2 cup of pasta water. Toss the pasta with the pesto, adding pasta water as needed to create a glossy sauce.',
		},
	],
	title: 'Fresh Basil Pesto Pasta',
};
