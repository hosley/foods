import { render, screen } from '@testing-library/react';
import { atom, Provider } from 'jotai';
import { describe, expect, it, vi } from 'vitest';
import { shoppingListAtom } from '../../../atoms/shopping-list/shopping-list';
import { HydrateAtoms } from '../../../test-utils/hydrate-atoms';
import { ShoppingListPage } from './shopping-list-page';

// Mock the atom itself to decouple from its complex derivation
vi.mock('../../../atoms/shopping-list/shopping-list', () => {
	const mockShoppingListAtom = atom<any[]>([]);
	return {
		shoppingListAtom: mockShoppingListAtom,
	};
});

describe('ShoppingListPage', () => {
	it('renders empty state correctly', () => {
		render(
			<Provider>
				<ShoppingListPage />
			</Provider>,
		);

		expect(screen.getByText(/your list is empty/i)).toBeInTheDocument();
		expect(screen.getByText(/browse recipes/i)).toBeInTheDocument();
	});

	it('renders shopping list items correctly', () => {
		const mockIngredients = [
			{ measurement: 'whole', name: 'onion', quantity: 2 },
			{ measurement: 'cloves', name: 'garlic', quantity: 3 },
		];

		render(
			<Provider>
				<HydrateAtoms initialValues={[[shoppingListAtom, mockIngredients]]}>
					<ShoppingListPage />
				</HydrateAtoms>
			</Provider>,
		);

		expect(screen.getByText('Onion')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('whole')).toBeInTheDocument();

		expect(screen.getByText('Garlic')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
		expect(screen.getByText('cloves')).toBeInTheDocument();
	});
});
