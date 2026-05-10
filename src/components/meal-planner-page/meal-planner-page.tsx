import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mealPlanAtom } from '../../atoms/meal-plan/meal-plan';
import { DEFAULT_MEAL_SLOTS } from '../../constants/meal-slots';
import { addDays, getWeekDates, parseISODate, toISODateString } from '../../lib/date-utils';
import { getMealPlannerContent } from '../../selectors/get-content/get-content';
import { getRecipeById } from '../../selectors/get-recipe-by-id/get-recipe-by-id';
import { Button } from '../design-system/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '../design-system/card/card';
import { AddRecipeDialog } from './add-recipe-dialog/add-recipe-dialog';

export const MealPlannerPage = () => {
	const mealPlan = useAtomValue(mealPlanAtom);
	const content = getMealPlannerContent();
	const navigate = useNavigate({ from: '/meal-planner' });
	const { date: searchDate } = useSearch({ from: '/meal-planner' });

	// Use local-safe parsing and formatting
	const referenceDate = searchDate ? parseISODate(searchDate) : new Date();
	const weekDates = getWeekDates(referenceDate);
	const currentSunday = weekDates[0] as Date;

	const currentRealWeekStart = getWeekDates(new Date())[0];
	const maxWeekStart = addDays(currentRealWeekStart as Date, 7);

	const isNextDisabled = currentSunday >= maxWeekStart;

	const targetPrevWeekStart = addDays(currentSunday, -7);
	const hasDataInPrevWeek = Object.keys(mealPlan).some(dateStr => {
		const date = parseISODate(dateStr);
		const targetEnd = addDays(targetPrevWeekStart, 6);
		return date >= targetPrevWeekStart && date <= targetEnd && mealPlan[dateStr] && mealPlan[dateStr]?.length > 0;
	});

	const isPrevDisabled = currentSunday <= (currentRealWeekStart as Date) && !hasDataInPrevWeek;

	const handleNavigate = (days: number) => {
		const targetSunday = addDays(currentSunday, days);
		navigate({
			search: { date: toISODateString(targetSunday) },
		});
	};

	return (
		<div className="space-y-8 rise-in">
			<header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<h1 className="text-3xl md:text-4xl font-bold font-heading text-sea-ink">{content.title}</h1>
				<div className="flex items-center gap-2">
					<Button disabled={isPrevDisabled} onClick={() => handleNavigate(-7)} variant="outline">
						<ChevronLeft className="h-4 w-4 mr-2" />
						Previous Week
					</Button>
					<Button disabled={isNextDisabled} onClick={() => handleNavigate(7)} variant="outline">
						Next Week
						<ChevronRight className="h-4 w-4 ml-2" />
					</Button>
				</div>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-stretch">
				{weekDates.map(date => {
					const dateStr = toISODateString(date);
					const dayMeals = mealPlan[dateStr] ?? [];
					const dayName = content.days[date.getDay() as keyof typeof content.days];

					return (
						<Card className="flex flex-col h-full" key={dateStr}>
							<CardHeader className="p-4 border-b border-line bg-surface/50">
								<CardTitle className="text-sm font-bold text-sea-ink uppercase tracking-wider">{dayName}</CardTitle>
								<p className="text-xs text-sea-ink-soft">
									{date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
								</p>
							</CardHeader>
							<CardContent className="p-4 flex-1 space-y-6">
								{DEFAULT_MEAL_SLOTS.map(slot => {
									const meal = dayMeals.find(m => m.mealName === slot.name);
									return (
										<div className="space-y-2" key={slot.name}>
											<div className="flex items-center justify-between">
												<h3 className="text-[10px] font-black text-sea-ink-soft uppercase tracking-widest">
													{slot.name}
												</h3>
												<span className="text-[10px] text-sea-ink-soft font-mono bg-sea-ink/5 px-1 rounded">
													{slot.defaultTime}
												</span>
											</div>
											<ul className="space-y-1 min-h-[2rem]">
												{meal && meal.recipeIds.length > 0 ? (
													meal.recipeIds.map(id => {
														const recipe = getRecipeById(id);
														return (
															<li
																className="text-xs text-sea-ink bg-white border border-line rounded px-2 py-1.5 shadow-xs"
																key={id}
															>
																{recipe?.title ?? 'Unknown Recipe'}
															</li>
														);
													})
												) : (
													<li className="text-[10px] text-sea-ink-soft/40 italic py-1">No recipes</li>
												)}
											</ul>
										</div>
									);
								})}
							</CardContent>
							<div className="p-4 border-t border-line bg-surface/30 mt-auto">
								<AddRecipeDialog date={dateStr} />
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
};
