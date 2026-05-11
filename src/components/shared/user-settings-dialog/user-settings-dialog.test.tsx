import { fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { describe, expect, it } from 'vitest';
import { userSettingsAtom } from '../../../atoms/user-settings/user-settings';
import { UserSettingsDialog } from './user-settings-dialog';

describe('UserSettingsDialog', () => {
	it('renders with default meal times', async () => {
		render(
			<Provider>
				<UserSettingsDialog />
			</Provider>,
		);

		const trigger = screen.getByRole('button', { name: /settings/i });
		fireEvent.click(trigger);

		expect(screen.getByText('User Settings')).toBeInTheDocument();
		expect(screen.getByLabelText('Breakfast')).toHaveValue('07:00');
	});

	it('changes meal times and persists to atom', async () => {
		const store = createStore();
		render(
			<Provider store={store}>
				<UserSettingsDialog />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /settings/i }));

		const lunchInput = screen.getByLabelText('Lunch');
		fireEvent.change(lunchInput, { target: { value: '13:00' } });

		const dinnerInput = screen.getByLabelText('Dinner');
		fireEvent.change(dinnerInput, { target: { value: '19:00' } });

		const settings = store.get(userSettingsAtom);
		expect(settings.defaultTimes.Lunch).toBe('13:00');
		expect(settings.defaultTimes.Dinner).toBe('19:00');
	});

	it('toggles import strategy', async () => {
		const store = createStore();
		render(
			<Provider store={store}>
				<UserSettingsDialog />
			</Provider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /settings/i }));

		const mergeButton = screen.getByText('Merge');
		fireEvent.click(mergeButton);

		let settings = store.get(userSettingsAtom);
		expect(settings.importStrategy).toBe('merge');

		const overwriteButton = screen.getByText('Overwrite');
		fireEvent.click(overwriteButton);
		settings = store.get(userSettingsAtom);
		expect(settings.importStrategy).toBe('overwrite');
	});
});
