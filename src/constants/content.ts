export const AppContent = {
	landingPage: {
		title: 'Discover Exceptional Recipes',
		description:
			'Curated dishes designed for maximum flavor and perfect execution, focusing on quality ingredients and reliable techniques.',
		prepSuffix: 'm prep',
		cookSuffix: 'm cook',
	},
	shoppingList: {
		title: "Shopping List",
		description: "Aggregated ingredients for all your saved recipes.",
		empty: {
			title: "Your List is Empty",
			description:
				"You haven't saved any recipes yet. Browse our collection and save some meals to automatically generate your shopping list.",
			cta: "Browse Recipes",
		},
	},
	recipePage: {
		saveButton: {
			default: "Save Recipe",
			saved: "Saved to List",
		},
		sections: {
			ingredients: "Ingredients",
			instructions: "Instructions",
		},
		stats: {
			prepTime: "Prep Time",
			cookTime: "Cook Time",
			totalTime: "Total Time",
			minutesSuffix: "mins",
		},
	},
	addRecipe: {
		title: 'Add New Recipe',
		description: 'Fill out the form below to generate a TypeScript recipe file.',
		errorPrefix: 'The following ingredients are not used in any step:',
		submitButton: 'Generate Recipe File',
		sheet: {
			title: 'Generated Output',
			description: 'Copy this into a new .ts file in src/recipes/',
			copyButton: 'Copy Code',
			copiedButton: 'Copied!',
		},
		sections: {
			basicInfo: {
				title: 'Basic Information',
				description: 'Main details about the dish.',
				fields: {
					title: 'Title',
					description: 'Description',
					cuisine: 'Cuisine',
					primaryProtein: 'Primary Protein (Optional)',
					prepTime: 'Prep Time (mins)',
					cookTime: 'Cook Time (mins)',
				},
			},
			ingredients: {
				title: 'Ingredients',
				description: 'Add all required components.',
				addButton: 'Add Ingredient',
				fields: {
					name: 'Name',
					quantity: 'Quantity',
					measurement: 'Measurement',
				},
			},
			steps: {
				title: 'Steps',
				description: 'Instructions for preparation and cooking.',
				addButton: 'Add Step',
				fields: {
					instruction: 'Instruction',
					relatedIngredients: 'Related Ingredients',
					selectPlaceholder: 'Select ingredients...',
					searchPlaceholder: 'Search ingredients...',
					emptyResults: 'No ingredient found.',
				},
			},
		},
	},
	common: {
		appName: 'Hosley Foods',
		nav: {
			home: 'Home',
			shoppingList: 'Shopping List',
		},
		footer: {
			rights: 'All rights reserved.',
		},
	},
} as const;

export type AppContent = typeof AppContent;
