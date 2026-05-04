import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider, atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { ShoppingListPage } from './shopping-list-page';
import { shoppingListAtom } from '../../../atoms/shopping-list/shopping-list';
import type { ReactNode } from 'react';

// Mock the atom itself to decouple from its complex derivation
vi.mock('../../../atoms/shopping-list/shopping-list', () => {
  const mockShoppingListAtom = atom<any[]>([]);
  return {
    shoppingListAtom: mockShoppingListAtom,
  };
});

// Helper to hydrate atoms for testing
const HydrateAtoms = ({ initialValues, children }: { initialValues: any, children: ReactNode }) => {
  useHydrateAtoms(initialValues);
  return <>{children}</>;
};

describe('ShoppingListPage', () => {
  it('renders empty state correctly', () => {
    render(
      <Provider>
        <ShoppingListPage />
      </Provider>
    );

    expect(screen.getByText(/your list is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/browse recipes/i)).toBeInTheDocument();
  });

  it('renders shopping list items correctly', () => {
    const mockIngredients = [
      { name: 'onion', quantity: 2, measurement: 'whole' },
      { name: 'garlic', quantity: 3, measurement: 'cloves' },
    ];

    render(
      <Provider>
        <HydrateAtoms initialValues={[[shoppingListAtom, mockIngredients]]}>
          <ShoppingListPage />
        </HydrateAtoms>
      </Provider>
    );

    expect(screen.getByText('Onion')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('whole')).toBeInTheDocument();

    expect(screen.getByText('Garlic')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('cloves')).toBeInTheDocument();
  });
});
