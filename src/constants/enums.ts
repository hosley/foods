export const ThemeMode = {
	Auto: 'auto',
	Dark: 'dark',
	Light: 'light',
} as const;

export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];

export const MealType = {
	Breakfast: 'Breakfast',
	Dessert: 'Dessert',
	Dinner: 'Dinner',
	Lunch: 'Lunch',
	Snack: 'Snack',
} as const;

export type MealType = (typeof MealType)[keyof typeof MealType];
