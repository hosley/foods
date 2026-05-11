import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { useState } from 'react';
import { mealPlanAtom } from '../../atoms/meal-plan/meal-plan';
import { userSettingsAtom } from '../../atoms/user-settings/user-settings';
import { DEFAULT_MEAL_SLOTS } from '../../constants/meal-slots';
import { addDays, getWeekDates, parseISODate, toISODateString } from '../../lib/date-utils';
import type { WeeklyMealPlan } from '../../lib/meal-plan-storage';
import { generateShareUrl } from '../../lib/sharing';
import { getMealPlannerContent } from '../../selectors/get-content/get-content';
import { getRecipeById } from '../../selectors/get-recipe-by-id/get-recipe-by-id';
import { Button } from '../design-system/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '../design-system/card/card';
import { AddRecipeDialog } from './add-recipe-dialog/add-recipe-dialog';
import { EditMealDialog } from './edit-meal-dialog/edit-meal-dialog';

export const MealPlannerPage = () => {
	const mealPlan = useAtomValue(mealPlanAtom);
	const settings = useAtomValue(userSettingsAtom);
	const content = getMealPlannerContent();
	const navigate = useNavigate({ from: '/meal-planner' });
	const { date: searchDate } = useSearch({ from: '/meal-planner' });
	const [isCopied, setIsCopied] = useState(false);

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

	const handleShare = async () => {
		// Extract only data for the current week to share
		const weekData = weekDates.reduce((acc, date) => {
			const ds = toISODateString(date);
			if (mealPlan[ds]) {
				acc[ds] = mealPlan[ds];
			}
			return acc;
		}, {} as WeeklyMealPlan);

		const shareUrl = generateShareUrl(weekData, window.location.origin + window.location.pathname);

		try {
			await navigator.clipboard.writeText(shareUrl);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy share URL:', err);
		}
	};

	return (
		<div className="space-y-8 rise-in">
			<header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="space-y-1">
					<h1 className="text-3xl md:text-4xl font-bold font-heading text-sea-ink">{content.title}</h1>
					<p className="text-xs text-sea-ink-soft">
						{toISODateString(weekDates[0] as Date)} to {toISODateString(weekDates[6] as Date)}
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button className="font-bold" onClick={handleShare} size="sm" variant={isCopied ? 'secondary' : 'outline'}>
						<Share2 className="h-4 w-4 mr-2" />
						{isCopied ? 'Copied Link!' : 'Share Week'}
					</Button>
					<div className="h-8 w-px bg-line mx-1 hidden sm:block" />
					<Button disabled={isPrevDisabled} onClick={() => handleNavigate(-7)} size="sm" variant="outline">
						<ChevronLeft className="h-4 w-4 mr-2" />
						Previous
					</Button>
					<Button disabled={isNextDisabled} onClick={() => handleNavigate(7)} size="sm" variant="outline">
						Next
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
								{/* Render all meals for the day */}
								{dayMeals.map(meal => (
									<div className="space-y-2" key={meal.mealName}>
										<div className="flex items-center justify-between group">
											<div className="flex items-center gap-2">
												<h3 className="text-[10px] font-black text-sea-ink uppercase tracking-widest">
													{meal.mealName}
												</h3>
												<div className="opacity-0 group-hover:opacity-100 transition-opacity">
													<EditMealDialog date={dateStr} mealName={meal.mealName} time={meal.time} />
												</div>
											</div>
											<span className="text-[10px] text-sea-ink-soft font-mono bg-sea-ink/5 px-1 rounded">
												{meal.time}
											</span>
										</div>
										<ul className="space-y-1">
											{meal.recipeIds.map(id => {
												const recipe = getRecipeById(id);
												return (
													<li
														className="text-xs text-sea-ink bg-white border border-line rounded px-2 py-1.5 shadow-xs"
														key={id}
													>
														{recipe?.title ?? 'Unknown Recipe'}
													</li>
												);
											})}
										</ul>
									</div>
								))}

								{/* Show empty indicators for default slots if missing */}
								{DEFAULT_MEAL_SLOTS.filter(slot => !dayMeals.some(m => m.mealName === slot.name)).map(slot => {
									const mealName = slot.name as keyof typeof settings.defaultTimes;
									const displayTime = settings.defaultTimes[mealName] || slot.defaultTime;

									return (
										<div className="space-y-2 opacity-40" key={slot.name}>
											<div className="flex items-center justify-between">
												<h3 className="text-[10px] font-black text-sea-ink-soft uppercase tracking-widest">
													{slot.name}
												</h3>
												<span className="text-[10px] text-sea-ink-soft font-mono px-1">{displayTime}</span>
											</div>
											<div className="text-[10px] italic py-1 pl-1">No recipes</div>
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
