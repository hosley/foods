import type { Meta, StoryObj } from "@storybook/react";
import { RecipePage } from "./recipe-page";
import { getRecipeById } from "#/selectors/get-recipe-by-id/get-recipe-by-id";
import { Provider } from "jotai";

// biome-ignore lint/style/noNonNullAssertion: permissible in stories
const recipe = getRecipeById("basil-pesto-pasta")!;

const meta: Meta<typeof RecipePage> = {
	title: "Features/RecipePage",
	component: RecipePage,
	decorators: [
		(Story) => (
			<Provider>
				<Story />
			</Provider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		recipe,
	},
};
