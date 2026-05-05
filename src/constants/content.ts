export const AppContent = {
	addRecipe: {
		description: 'Fill out the form below to generate a TypeScript recipe file.',
		errorPrefix: 'The following ingredients are not used in any step:',
		sections: {
			basicInfo: {
				description: 'Main details about the dish.',
				fields: {
					cookTime: 'Cook Time (mins)',
					cuisine: 'Cuisine',
					description: 'Description',
					prepTime: 'Prep Time (mins)',
					primaryProtein: 'Primary Protein (Optional)',
					title: 'Title',
				},
				title: 'Basic Information',
			},
			ingredients: {
				addButton: 'Add Ingredient',
				description: 'Add all required components.',
				fields: {
					measurement: 'Measurement',
					name: 'Name',
					quantity: 'Quantity',
				},
				title: 'Ingredients',
			},
			steps: {
				addButton: 'Add Step',
				description: 'Instructions for preparation and cooking.',
				fields: {
					emptyResults: 'No ingredient found.',
					instruction: 'Instruction',
					relatedIngredients: 'Related Ingredients',
					searchPlaceholder: 'Search ingredients...',
					selectPlaceholder: 'Select ingredients...',
				},
				title: 'Steps',
			},
		},
		sheet: {
			copiedButton: 'Copied!',
			copyButton: 'Copy Code',
			description: 'Copy this into a new .ts file in src/recipes/',
			title: 'Generated Output',
		},
		submitButton: 'Generate Recipe File',
		title: 'Add New Recipe',
	},
	common: {
		appName: 'Hosley Foods',
		footer: {
			rights: 'All rights reserved.',
		},
		nav: {
			home: 'Home',
			shoppingList: 'Shopping List',
		},
	},
	landingPage: {
		cookSuffix: 'm cook',
		description:
			'Curated dishes designed for maximum flavor and perfect execution, focusing on quality ingredients and reliable techniques.',
		prepSuffix: 'm prep',
		title: 'Discover Exceptional Recipes',
	},
	recipePage: {
		saveButton: {
			default: 'Save Recipe',
			saved: 'Saved to List',
		},
		sections: {
			ingredients: 'Ingredients',
			instructions: 'Instructions',
		},
		stats: {
			cookTime: 'Cook Time',
			minutesSuffix: 'mins',
			prepTime: 'Prep Time',
			totalTime: 'Total Time',
		},
	},
	shoppingList: {
		description: 'Aggregated ingredients for all your saved recipes.',
		empty: {
			cta: 'Browse Recipes',
			description:
				"You haven't saved any recipes yet. Browse our collection and save some meals to automatically generate your shopping list.",
			title: 'Your List is Empty',
		},
		title: 'Shopping List',
	},
} as const;

export type AppContent = typeof AppContent;
