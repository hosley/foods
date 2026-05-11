import { useAtomValue, useSetAtom } from 'jotai';
import { Calendar as CalendarIcon, Check } from 'lucide-react';
import { useId, useState } from 'react';
import { addRecipeToMealAtom } from '../../../atoms/meal-plan/meal-plan';
import { userSettingsAtom } from '../../../atoms/user-settings/user-settings';
import { DEFAULT_MEAL_SLOTS, type MealSlot } from '../../../constants/meal-slots';
import { toISODateString } from '../../../lib/date-utils';
import { Button } from '../../design-system/button/button';
import { Input } from '../../design-system/input/input';
import { Label } from '../../design-system/label/label';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../ui/dialog';

export interface AddToMealPlanModalProps {
	recipeId: string;
	recipeTitle: string;
}

export const AddToMealPlanModal = ({ recipeId, recipeTitle }: AddToMealPlanModalProps) => {
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState(toISODateString(new Date()));
	const [selectedSlot, setSelectedSlot] = useState<MealSlot>(DEFAULT_MEAL_SLOTS[2] as MealSlot);
	const [isSuccess, setIsSuccess] = useState(false);
	const dateInputId = useId();

	const addRecipeToMeal = useSetAtom(addRecipeToMealAtom);
	const settings = useAtomValue(userSettingsAtom);

	const handleAdd = async () => {
		const mealName = selectedSlot.name as keyof typeof settings.defaultTimes;
		const time = settings.defaultTimes[mealName] || selectedSlot.defaultTime;

		await addRecipeToMeal({
			date,
			mealName: selectedSlot.name,
			recipeId,
			time,
		});

		setIsSuccess(true);
		setTimeout(() => {
			setIsSuccess(false);
			setOpen(false);
		}, 1500);
	};

	return (
		<Dialog
			onOpenChange={val => {
				setOpen(val);
				if (!val) setIsSuccess(false);
			}}
			open={open}
		>
			<DialogTrigger render={<Button className="font-bold" size="lg" variant="outline" />}>
				<CalendarIcon className="mr-2 h-5 w-5" />
				Add to Meal Plan
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add to Meal Plan</DialogTitle>
					<DialogDescription>
						Choose a date and meal slot for <strong>{recipeTitle}</strong>.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					<div className="space-y-2">
						<Label htmlFor={dateInputId}>Select Date</Label>
						<Input id={dateInputId} onChange={e => setDate(e.target.value)} type="date" value={date} />
					</div>

					<div className="space-y-3">
						<Label>Meal Slot</Label>
						<div className="flex gap-2">
							{DEFAULT_MEAL_SLOTS.map(slot => (
								<Button
									className="flex-1 text-[10px] h-9 uppercase tracking-tight font-black"
									key={slot.name}
									onClick={() => setSelectedSlot(slot)}
									size="sm"
									variant={selectedSlot.name === slot.name ? 'default' : 'outline'}
								>
									{slot.name}
								</Button>
							))}
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button
						className="w-full sm:w-auto"
						disabled={isSuccess}
						onClick={handleAdd}
						variant={isSuccess ? 'secondary' : 'default'}
					>
						{isSuccess ? (
							<>
								<Check className="mr-2 h-4 w-4" />
								Added to Plan
							</>
						) : (
							'Confirm'
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
