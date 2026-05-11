import { atomWithStorage } from 'jotai/utils';

export interface DefaultMealTimes {
	Breakfast: string;
	Dinner: string;
	Lunch: string;
}

export type ImportStrategy = 'merge' | 'overwrite';

export interface UserSettings {
	defaultTimes: DefaultMealTimes;
	importStrategy: ImportStrategy;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
	defaultTimes: {
		Breakfast: '07:00',
		Dinner: '18:00',
		Lunch: '12:00',
	},
	importStrategy: 'overwrite',
};

/**
 * Atom for persisting user settings in localStorage.
 */
export const userSettingsAtom = atomWithStorage<UserSettings>('user-settings', DEFAULT_USER_SETTINGS);
