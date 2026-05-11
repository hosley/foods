import { useAtomValue, useSetAtom } from 'jotai';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { importMealPlanAtom } from '../../../atoms/meal-plan/meal-plan';
import { userSettingsAtom } from '../../../atoms/user-settings/user-settings';
import type { WeeklyMealPlan } from '../../../lib/meal-plan-storage';
import { decodeMealPlan } from '../../../lib/sharing';
import { getRecipeById } from '../../../selectors/get-recipe-by-id/get-recipe-by-id';
import { Button } from '../../design-system/button/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';

export interface ImportPreviewModalProps {
	onClearShare: () => void;
	shareCode?: string;
}

export const ImportPreviewModal = ({ shareCode, onClearShare }: ImportPreviewModalProps) => {
	const [plan, setPlan] = useState<WeeklyMealPlan | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const settings = useAtomValue(userSettingsAtom);
	const [strategy, setStrategy] = useState<'merge' | 'overwrite'>(settings.importStrategy);
	const importMealPlan = useSetAtom(importMealPlanAtom);

	useEffect(() => {
		if (shareCode) {
			const decoded = decodeMealPlan(shareCode);
			if (decoded) {
				setPlan(decoded);
				setIsOpen(true);
				setStrategy(settings.importStrategy); // Sync with latest settings when opening
			} else {
				console.error('Invalid share code');
				onClearShare();
			}
		}
	}, [shareCode, onClearShare, settings.importStrategy]);

	const handleConfirm = async () => {
		if (plan) {
			await importMealPlan({ plan, strategy });
			setIsOpen(false);
			onClearShare();
		}
	};

	const handleCancel = () => {
		setIsOpen(false);
		onClearShare();
	};

	if (!plan) return null;

	const dates = Object.keys(plan).sort();

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogContent className="sm:max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
				<DialogHeader className="p-6 pb-2">
					<DialogTitle>Import Shared Meal Plan</DialogTitle>
					<DialogDescription>
						You've been shared a meal plan. Review the details below before importing.
					</DialogDescription>
					<div className="flex gap-2 mt-4">
						<Button
							className="flex-1 text-[10px] font-black uppercase tracking-widest h-8"
							onClick={() => setStrategy('overwrite')}
							variant={strategy === 'overwrite' ? 'default' : 'outline'}
						>
							Overwrite
						</Button>
						<Button
							className="flex-1 text-[10px] font-black uppercase tracking-widest h-8"
							onClick={() => setStrategy('merge')}
							variant={strategy === 'merge' ? 'default' : 'outline'}
						>
							Merge
						</Button>
					</div>
					<p className="text-[10px] text-sea-ink-soft italic mt-2">
						{strategy === 'merge'
							? 'Recipes will be added to your existing plan.'
							: 'Shared dates will replace your existing recipes.'}
					</p>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6">
					{dates.map(date => (
						<div className="space-y-3" key={date}>
							<h3 className="text-xs font-black text-sea-ink-soft uppercase tracking-widest border-b border-line pb-1">
								{date}
							</h3>
							<div className="space-y-4">
								{plan[date]?.map(meal => (
									<div className="space-y-1" key={meal.mealName}>
										<div className="flex justify-between items-center">
											<span className="text-[10px] font-bold text-palm uppercase">{meal.mealName}</span>
											<span className="text-[10px] text-sea-ink-soft font-mono">{meal.time}</span>
										</div>
										<ul className="space-y-1">
											{meal.recipeIds.map(id => {
												const recipe = getRecipeById(id);
												return (
													<li className="text-xs text-sea-ink bg-surface border border-line rounded px-2 py-1" key={id}>
														{recipe?.title ?? 'Unknown Recipe'}
													</li>
												);
											})}
										</ul>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				<DialogFooter className="p-6 pt-2 bg-surface/50 border-t border-line flex flex-row gap-2 sm:justify-end">
					<Button className="flex-1 sm:flex-none" onClick={handleCancel} variant="outline">
						<X className="mr-2 h-4 w-4" />
						Cancel
					</Button>
					<Button className="flex-1 sm:flex-none" onClick={handleConfirm}>
						<Check className="mr-2 h-4 w-4" />
						Import Plan
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
