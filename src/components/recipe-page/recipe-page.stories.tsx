import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'jotai';
import { getRecipeById } from '#/selectors/get-recipe-by-id/get-recipe-by-id';
import { RecipePage } from './recipe-page';

// biome-ignore lint/style/noNonNullAssertion: permissible in stories
const recipe = getRecipeById('basil-pesto-pasta')!;

const meta: Meta<typeof RecipePage> = {
	component: RecipePage,
	decorators: [
		Story => (
			<Provider>
				<Story />
			</Provider>
		),
	],
	title: 'Features/RecipePage',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		recipe,
	},
};
