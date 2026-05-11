import { createStore } from 'jotai';
import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_USER_SETTINGS, userSettingsAtom } from './user-settings';

describe('user-settings atom', () => {
	let store: ReturnType<typeof createStore>;

	beforeEach(() => {
		store = createStore();
		localStorage.clear();
	});

	it('should initialize with default settings', () => {
		expect(store.get(userSettingsAtom)).toEqual(DEFAULT_USER_SETTINGS);
	});

	it('should persist settings to localStorage', () => {
		const newSettings = {
			...DEFAULT_USER_SETTINGS,
			importStrategy: 'merge' as const,
		};
		store.set(userSettingsAtom, newSettings);
		expect(store.get(userSettingsAtom)).toEqual(newSettings);

		const stored = JSON.parse(localStorage.getItem('user-settings') || '{}');
		expect(stored.importStrategy).toBe('merge');
	});
});
