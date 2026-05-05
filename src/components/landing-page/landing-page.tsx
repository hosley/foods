import { Link } from '@tanstack/react-router';
import { getAllRecipes } from '../../selectors/get-all-recipes/get-all-recipes';
import { getLandingPageContent } from '../../selectors/get-content/get-content';

export const LandingPage = () => {
	const recipes = getAllRecipes();
	const content = getLandingPageContent();

	return (
		<div className="flex flex-col gap-12 rise-in">
			<section className="text-center max-w-2xl mx-auto space-y-4">
				<h1 className="text-4xl md:text-5xl font-bold font-heading text-sea-ink">{content.title}</h1>
				<p className="text-lg text-sea-ink-soft">{content.description}</p>
			</section>

			<section>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{recipes.map(recipe => (
						<Link
							className="feature-card rounded-2xl p-6 flex flex-col gap-4 no-underline group outline-none focus-visible:ring-2 focus-visible:ring-palm"
							key={recipe.id}
							params={{ recipeId: recipe.id }}
							to="/recipe/$recipeId"
						>
							<div className="flex items-center gap-2">
								<span className="island-kicker px-2 py-1 bg-palm/10 text-palm rounded-md">{recipe.cuisine}</span>
								{recipe.primaryProtein && (
									<span className="island-kicker px-2 py-1 bg-lagoon/10 text-lagoon-deep rounded-md">
										{recipe.primaryProtein}
									</span>
								)}
							</div>
							<h2 className="text-2xl font-bold font-heading text-sea-ink group-hover:text-lagoon-deep transition-colors">
								{recipe.title}
							</h2>
							<p className="text-sea-ink-soft flex-1 line-clamp-3">{recipe.description}</p>
							<div className="flex items-center justify-between text-sm font-medium text-sea-ink mt-4 pt-4 border-t border-line">
								<span>
									{recipe.prepTimeMinutes}
									{content.prepSuffix}
								</span>
								<span>
									{recipe.cookTimeMinutes}
									{content.cookSuffix}
								</span>
							</div>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
};
