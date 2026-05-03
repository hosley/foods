import { createFileRoute, notFound } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { Bookmark, BookmarkCheck, Clock, ChefHat } from "lucide-react";
import { getRecipeById } from "../selectors/get-recipe-by-id";
import {
	toggleSavedRecipeAtom,
	savedRecipesAtom,
} from "../atoms/saved-recipes";
import { Button } from "../components/design-system/button";

export const Route = createFileRoute("/recipe/$recipeId")({
	loader: async ({ params: { recipeId } }) => {
		const recipe = getRecipeById(recipeId);
		if (!recipe) {
			throw notFound();
		}
		return { recipe };
	},
	component: RecipePage,
});

function RecipePage() {
	const { recipe } = Route.useLoaderData();
	const [savedRecipes, toggleSaved] = useAtom(toggleSavedRecipeAtom);
	const [savedRecipeIds] = useAtom(savedRecipesAtom);

	const isSaved = savedRecipeIds.includes(recipe.id);

	return (
		<article className="max-w-4xl mx-auto rise-in space-y-12">
			<header className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div className="space-y-4 flex-1">
						<div className="flex flex-wrap items-center gap-2">
							<span className="island-kicker px-2 py-1 bg-palm/10 text-palm rounded-md">
								{recipe.summary.typeOfMeal}
							</span>
							<span className="island-kicker px-2 py-1 bg-lagoon/10 text-lagoon-deep rounded-md">
								{recipe.summary.typeOfProtein}
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl font-bold font-heading text-sea-ink">
							{recipe.title}
						</h1>
						<p className="text-lg text-sea-ink-soft">{recipe.description}</p>
					</div>
					<Button
						size="lg"
						variant={isSaved ? "secondary" : "default"}
						className="w-full md:w-auto font-bold shrink-0"
						onClick={() => toggleSaved(recipe.id)}
					>
						{isSaved ? (
							<BookmarkCheck className="mr-2 h-5 w-5" />
						) : (
							<Bookmark className="mr-2 h-5 w-5" />
						)}
						{isSaved ? "Saved to List" : "Save Recipe"}
					</Button>
				</div>

				<div className="island-shell rounded-2xl p-6 flex flex-wrap gap-8 justify-around text-center">
					<div className="space-y-1">
						<span className="island-kicker text-sea-ink-soft flex items-center justify-center gap-1">
							<Clock className="w-3 h-3" /> Prep Time
						</span>
						<p className="text-xl font-bold text-sea-ink">
							{recipe.summary.prepTimeMinutes} mins
						</p>
					</div>
					<div className="space-y-1">
						<span className="island-kicker text-sea-ink-soft flex items-center justify-center gap-1">
							<ChefHat className="w-3 h-3" /> Cook Time
						</span>
						<p className="text-xl font-bold text-sea-ink">
							{recipe.summary.cookTimeMinutes} mins
						</p>
					</div>
					<div className="space-y-1">
						<span className="island-kicker text-sea-ink-soft">Total Time</span>
						<p className="text-xl font-bold text-sea-ink">
							{recipe.summary.prepTimeMinutes + recipe.summary.cookTimeMinutes}{" "}
							mins
						</p>
					</div>
				</div>
			</header>

			<div className="grid md:grid-cols-[1fr_2fr] gap-12">
				<aside className="space-y-6">
					<h2 className="text-2xl font-bold font-heading text-sea-ink">
						Ingredients
					</h2>
					<ul className="space-y-4">
						{recipe.ingredients.map((ingredient) => (
							<li
								key={ingredient.id}
								className="flex items-start gap-3 text-sea-ink-soft border-b border-line pb-3"
							>
								<span className="font-bold text-sea-ink min-w-[3rem] text-right">
									{ingredient.quantity}
								</span>
								<span className="text-sm font-medium text-sea-ink min-w-[3rem]">
									{ingredient.measurement}
								</span>
								<span className="flex-1">{ingredient.name}</span>
							</li>
						))}
					</ul>
				</aside>

				<section className="space-y-6">
					<h2 className="text-2xl font-bold font-heading text-sea-ink">
						Instructions
					</h2>
					<div className="space-y-8">
						{recipe.steps.map((step, index) => {
							const relatedIngredients = recipe.ingredients.filter((i) =>
								step.ingredientIds.includes(i.id),
							);

							return (
								<div key={step.id} className="flex gap-6">
									<div className="flex-shrink-0 w-8 h-8 rounded-full bg-palm text-white flex items-center justify-center font-bold text-sm">
										{index + 1}
									</div>
									<div className="space-y-3 pt-1">
										<p className="text-lg text-sea-ink leading-relaxed">
											{step.instruction}
										</p>
										{relatedIngredients.length > 0 && (
											<div className="inline-flex flex-wrap gap-2">
												{relatedIngredients.map((ri) => (
													<span
														key={ri.id}
														className="island-kicker px-2 py-1 bg-surface-strong border border-line rounded-md lowercase"
													>
														{ri.name}
													</span>
												))}
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</section>
			</div>
		</article>
	);
}
