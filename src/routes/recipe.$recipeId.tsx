import { createFileRoute, notFound } from "@tanstack/react-router";
import { getRecipeById } from "../selectors/get-recipe-by-id/get-recipe-by-id";
import { RecipePage } from "../components/recipe-page/recipe-page";

export const Route = createFileRoute("/recipe/$recipeId")({
	loader: async ({ params: { recipeId } }) => {
		const recipe = getRecipeById(recipeId);
		if (!recipe) {
			throw notFound();
		}
		return { recipe };
	},
	component: () => {
		const { recipe } = Route.useLoaderData();
		return <RecipePage recipe={recipe} />;
	},
});
