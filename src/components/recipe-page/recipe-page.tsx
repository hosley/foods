import { useAtom, useAtomValue } from "jotai";
import { Bookmark, BookmarkCheck, Clock, ChefHat } from "lucide-react";
import {
	toggleSavedRecipeAtom,
	savedRecipesAtom,
} from "../../atoms/saved-recipes/saved-recipes";
import { Button } from "../design-system/button/button";
import type { Recipe } from "../../recipes/schema";
import { getRecipePageContent } from "../../selectors/get-content/get-content";
import { toTitleCase } from "../../lib/utils";

export interface RecipePageProps {
	recipe: Recipe;
}

export const RecipePage = ({ recipe }: RecipePageProps) => {
	const [_savedRecipes, toggleSaved] = useAtom(toggleSavedRecipeAtom);
	const savedRecipeIds = useAtomValue(savedRecipesAtom);
	const content = getRecipePageContent();

	const isSaved = savedRecipeIds.includes(recipe.id);

	return (
		<article className="max-w-4xl mx-auto rise-in space-y-12">
			<header className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div className="space-y-4 flex-1">
						<div className="flex wrap items-center gap-2">
							<span className="island-kicker px-2 py-1 bg-palm/10 text-palm rounded-md">
								{recipe.cuisine}
							</span>
							{recipe.primaryProtein && (
								<span className="island-kicker px-2 py-1 bg-lagoon/10 text-lagoon-deep rounded-md">
									{recipe.primaryProtein}
								</span>
							)}
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
						{isSaved ? content.saveButton.saved : content.saveButton.default}
					</Button>
				</div>

				<div className="island-shell rounded-2xl p-6 flex wrap gap-8 justify-around text-center">
					<div className="space-y-1">
						<span className="island-kicker text-sea-ink-soft flex items-center justify-center gap-1">
							<Clock className="w-3 h-3" /> {content.stats.prepTime}
						</span>
						<p className="text-xl font-bold text-sea-ink">
							{recipe.prepTimeMinutes} {content.stats.minutesSuffix}
						</p>
					</div>
					<div className="space-y-1">
						<span className="island-kicker text-sea-ink-soft flex items-center justify-center gap-1">
							<ChefHat className="w-3 h-3" /> {content.stats.cookTime}
						</span>
						<p className="text-xl font-bold text-sea-ink">
							{recipe.cookTimeMinutes} {content.stats.minutesSuffix}
						</p>
					</div>
					<div className="space-y-1">
						<span className="island-kicker text-sea-ink-soft">{content.stats.totalTime}</span>
						<p className="text-xl font-bold text-sea-ink">
							{recipe.prepTimeMinutes + recipe.cookTimeMinutes}{" "}
							{content.stats.minutesSuffix}
						</p>
					</div>
				</div>
			</header>

			<div className="grid md:grid-cols-[1fr_2fr] gap-12">
				<aside className="space-y-6">
					<h2 className="text-2xl font-bold font-heading text-sea-ink">
						{content.sections.ingredients}
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
								<span className="flex-1">{toTitleCase(ingredient.name)}</span>
							</li>
						))}
					</ul>
				</aside>

				<section className="space-y-6">
					<h2 className="text-2xl font-bold font-heading text-sea-ink">
						{content.sections.instructions}
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
														{toTitleCase(ri.name)}
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
};
