export interface MealSlot {
	defaultTime: string;
	name: string;
}

export const DEFAULT_MEAL_SLOTS: MealSlot[] = [
	{ defaultTime: '07:00', name: 'Breakfast' },
	{ defaultTime: '12:00', name: 'Lunch' },
	{ defaultTime: '18:00', name: 'Dinner' },
];

export type DefaultMealName = 'Breakfast' | 'Lunch' | 'Dinner';
