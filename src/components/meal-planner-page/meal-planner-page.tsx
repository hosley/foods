import { useAtomValue } from 'jotai';
import { mealPlanAtom } from '../../atoms/meal-plan/meal-plan';
import { getWeekDates, toISODateString } from '../../lib/date-utils';
import { getMealPlannerContent } from '../../selectors/get-content/get-content';
import { getRecipeById } from '../../selectors/get-recipe-by-id/get-recipe-by-id';
import { Card, CardContent, CardHeader, CardTitle } from '../design-system/card/card';

export const MealPlannerPage = () => {
	const mealPlan = useAtomValue(mealPlanAtom);
	const content = getMealPlannerContent();
	const weekDates = getWeekDates(new Date());

	return (
		<div className="space-y-8 rise-in">
			<header className="space-y-2">
				<h1 className="text-3xl md:text-4xl font-bold font-heading text-sea-ink">{content.title}</h1>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-7 gap-4">
				{weekDates.map(date => {
					const dateStr = toISODateString(date);
					const dayMeals = mealPlan[dateStr] ?? [];
					const dayName = content.days[date.getDay() as keyof typeof content.days];

					return (
						<Card className="flex flex-col" key={dateStr}>
							<CardHeader className="p-4 border-b border-line bg-surface/50">
								<CardTitle className="text-sm font-bold text-sea-ink uppercase tracking-wider">{dayName}</CardTitle>
								<p className="text-xs text-sea-ink-soft">
									{date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
								</p>
							</CardHeader>
							<CardContent className="p-4 flex-1 space-y-4">
								{dayMeals.length === 0 ? (
									<p className="text-xs text-sea-ink-soft italic">No recipes planned</p>
								) : (
									dayMeals.map(meal => (
										<div className="space-y-2" key={meal.mealName}>
											<h3 className="text-xs font-bold text-palm uppercase tracking-tight">{meal.mealName}</h3>
											<ul className="space-y-1">
												{meal.recipeIds.map(id => {
													const recipe = getRecipeById(id);
													return (
														<li
															className="text-sm text-sea-ink bg-white border border-line rounded px-2 py-1 shadow-sm"
															key={id}
														>
															{recipe?.title ?? 'Unknown Recipe'}
														</li>
													);
												})}
											</ul>
										</div>
									))
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
};
