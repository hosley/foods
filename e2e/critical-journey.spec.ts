import { expect, test } from '@playwright/test';

test.describe('Critical User Journey: Browse, Save, and View Shopping List', () => {
	test('should allow a user to save a recipe and see its ingredients in the shopping list', async ({ page }) => {
		// 1. Visit the landing page
		await page.goto('/');
		await expect(page.locator('h1')).toContainText('Discover Exceptional Recipes');

		// 2. Navigate to the Sear-Roasted Chicken Thighs recipe
		await page.click('text=Sear-Roasted Chicken Thighs');

		// Verify we are on the recipe page
		await expect(page.locator('h1')).toContainText('Sear-Roasted Chicken Thighs');

		// 3. Save the recipe
		const saveButton = page.locator('button', { hasText: 'Save Recipe' });
		await saveButton.click();

		// Verify the button text changed to 'Saved to List'
		await expect(page.locator('button', { hasText: 'Saved to List' })).toBeVisible();

		// 4. Navigate to the shopping list page
		await page.click('text=Shopping List');

		// Verify we are on the shopping list page
		await expect(page.locator('h1')).toContainText('Shopping List');

		// 5. Verify the aggregated ingredients are present
		const ingredientsList = page.locator('ul');
		await expect(ingredientsList).toContainText('chicken thighs');
		await expect(ingredientsList).toContainText('Avocado oil');
	});
});
