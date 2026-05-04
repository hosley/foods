import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'jotai';
import { RecipePage } from './recipe-page';
import type { Recipe } from '../../recipes/schema';

const mockRecipe: Recipe = {
  id: 'test-recipe',
  title: 'Test Recipe',
  description: 'A delicious test recipe',
  cuisine: 'Testian',
  primaryProtein: 'Mock',
  prepTimeMinutes: 10,
  cookTimeMinutes: 20,
  ingredients: [
    { id: 'ing1', name: 'ingredient 1', quantity: 1, measurement: 'cup' },
    { id: 'ing2', name: 'ingredient 2', quantity: 2, measurement: 'tbsp' },
  ],
  steps: [
    { id: 'step1', instruction: 'Step 1 instruction', ingredientIds: ['ing1'] },
    { id: 'step2', instruction: 'Step 2 instruction', ingredientIds: ['ing1', 'ing2'] },
  ],
};

const mockRecipeNoProtein: Recipe = {
  ...mockRecipe,
  primaryProtein: '',
};

describe('RecipePage', () => {
  it('renders recipe details correctly', () => {
    render(
      <Provider>
        <RecipePage recipe={mockRecipe} />
      </Provider>
    );

    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('A delicious test recipe')).toBeInTheDocument();
    expect(screen.getByText('Testian')).toBeInTheDocument();
    expect(screen.getByText('Mock')).toBeInTheDocument();
    
    // Stats
    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText(/20/)).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
    expect(screen.getAllByText(/mins/).length).toBe(3);

    // Ingredients
    expect(screen.getAllByText('Ingredient 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ingredient 2').length).toBeGreaterThan(0);

    // Steps
    expect(screen.getByText('Step 1 instruction')).toBeInTheDocument();
    expect(screen.getByText('Step 2 instruction')).toBeInTheDocument();
  });

  it('renders correctly without primary protein', () => {
    render(
      <Provider>
        <RecipePage recipe={mockRecipeNoProtein} />
      </Provider>
    );

    expect(screen.queryByText('Mock')).not.toBeInTheDocument();
  });

  it('toggles saved state when button is clicked', () => {
    render(
      <Provider>
        <RecipePage recipe={mockRecipe} />
      </Provider>
    );

    const saveButton = screen.getByRole('button', { name: /save recipe/i });
    expect(saveButton).toBeInTheDocument();

    // Save it
    fireEvent.click(saveButton);
    expect(screen.getByRole('button', { name: /saved/i })).toBeInTheDocument();

    // Unsave it
    fireEvent.click(screen.getByRole('button', { name: /saved/i }));
    expect(screen.getByRole('button', { name: /save recipe/i })).toBeInTheDocument();
  });
});
