// biome-ignore lint/style/useFilenamingConvention: TanStack Router dynamic route parameter requires $ prefix
import { createFileRoute, notFound } from '@tanstack/react-router';
import { RecipePage } from '../components/recipe-page/recipe-page';
import { getRecipeById } from '../selectors/get-recipe-by-id/get-recipe-by-id';

export const Route = createFileRoute('/recipe/$recipeId')({
	component: () => {
		const { recipe } = Route.useLoaderData();
		return <RecipePage recipe={recipe} />;
	},
	loader: async ({ params: { recipeId } }) => {
		const recipe = getRecipeById(recipeId);
		if (!recipe) {
			throw notFound();
		}
		return { recipe };
	},
});
