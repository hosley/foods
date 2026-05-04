export const ThemeMode = {
	Light: "light",
	Dark: "dark",
	Auto: "auto",
} as const;

export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];

export const MealType = {
	Breakfast: "Breakfast",
	Lunch: "Lunch",
	Dinner: "Dinner",
	Dessert: "Dessert",
	Snack: "Snack",
} as const;

export type MealType = (typeof MealType)[keyof typeof MealType];
