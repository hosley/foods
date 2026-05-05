import { Link } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { ShoppingCart } from 'lucide-react';
import { shoppingListAtom } from '../../../atoms/shopping-list/shopping-list';
import { toTitleCase } from '../../../lib/utils';
import { getShoppingListContent } from '../../../selectors/get-content/get-content';
import { Button } from '../../design-system/button/button';

export const ShoppingListPage = () => {
	const ingredients = useAtomValue(shoppingListAtom);
	const content = getShoppingListContent();

	if (ingredients.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-6 rise-in max-w-md mx-auto">
				<div className="w-20 h-20 bg-surface-strong border border-line rounded-full flex items-center justify-center text-palm">
					<ShoppingCart className="w-10 h-10" />
				</div>
				<div className="space-y-2">
					<h1 className="text-3xl font-bold font-heading text-sea-ink">{content.empty.title}</h1>
					<p className="text-sea-ink-soft">{content.empty.description}</p>
				</div>
				<Button asChild className="mt-4 font-bold" size="lg">
					<Link to="/">{content.empty.cta}</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto rise-in space-y-8">
			<header className="space-y-4">
				<div className="flex items-center gap-3 text-palm">
					<ShoppingCart className="w-8 h-8" />
					<h1 className="text-4xl font-bold font-heading text-sea-ink">{content.title}</h1>
				</div>
				<p className="text-lg text-sea-ink-soft">{content.description}</p>
			</header>

			<section className="island-shell rounded-2xl overflow-hidden">
				<ul className="divide-y divide-line">
					{ingredients.map(ingredient => (
						<li
							className="flex items-center justify-between p-4 hover:bg-surface transition-colors"
							key={`${ingredient.name}-${ingredient.measurement}`}
						>
							<span className="font-medium text-sea-ink">{toTitleCase(ingredient.name)}</span>
							<div className="flex items-center gap-2 text-sea-ink-soft bg-white/50 px-3 py-1 rounded-md border border-line/50">
								<span className="font-bold text-sea-ink">{ingredient.quantity}</span>
								<span className="text-sm">{ingredient.measurement}</span>
							</div>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
};
