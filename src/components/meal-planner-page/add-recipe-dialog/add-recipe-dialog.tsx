import { useAtomValue, useSetAtom } from 'jotai';
import { Plus, Search } from 'lucide-react';
import { useId, useState } from 'react';
import { addRecipeToMealAtom } from '../../../atoms/meal-plan/meal-plan';
import { userSettingsAtom } from '../../../atoms/user-settings/user-settings';
import { DEFAULT_MEAL_SLOTS, type MealSlot } from '../../../constants/meal-slots';
import { getAllRecipes } from '../../../selectors/get-all-recipes/get-all-recipes';
import { Button } from '../../design-system/button/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '../../design-system/command/command';
import { Input } from '../../design-system/input/input';
import { Label } from '../../design-system/label/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';

export interface AddRecipeDialogProps {
	date: string;
}

export const AddRecipeDialog = ({ date }: AddRecipeDialogProps) => {
	const [open, setOpen] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState<MealSlot | null>(DEFAULT_MEAL_SLOTS[2] as MealSlot);
	const [customName, setCustomName] = useState('');
	const [customTime, setCustomTime] = useState('18:00');

	const customNameId = useId();
	const customTimeId = useId();

	const addRecipeToMeal = useSetAtom(addRecipeToMealAtom);
	const settings = useAtomValue(userSettingsAtom);
	const allRecipes = getAllRecipes();

	const isCustom = !selectedSlot;

	const handleSelect = (recipeId: string) => {
		const mealName = isCustom ? customName || 'Custom Meal' : selectedSlot.name;
		const time = isCustom
			? customTime
			: settings.defaultTimes[mealName as keyof typeof settings.defaultTimes] || selectedSlot.defaultTime;

		addRecipeToMeal({
			date,
			mealName,
			recipeId,
			time,
		});
		setOpen(false);
		// Reset custom fields
		if (isCustom) {
			setCustomName('');
			setCustomTime('18:00');
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger render={<Button className="w-full h-8" size="sm" variant="outline" />}>
				<Plus className="h-4 w-4 mr-1" />
				Add Recipe
			</DialogTrigger>
			<DialogContent className="p-0 sm:max-w-md">
				<DialogHeader className="p-4 border-b border-line">
					<DialogTitle>Select Recipe</DialogTitle>
					<div className="flex flex-wrap gap-2 mt-4">
						{DEFAULT_MEAL_SLOTS.map(slot => (
							<Button
								className="flex-1 text-[10px] h-7 uppercase tracking-tighter font-black min-w-[60px]"
								key={slot.name}
								onClick={() => setSelectedSlot(slot)}
								size="sm"
								variant={selectedSlot?.name === slot.name ? 'default' : 'outline'}
							>
								{slot.name}
							</Button>
						))}
						<Button
							className="flex-1 text-[10px] h-7 uppercase tracking-tighter font-black min-w-[60px]"
							onClick={() => setSelectedSlot(null)}
							size="sm"
							variant={isCustom ? 'default' : 'outline'}
						>
							Custom
						</Button>
					</div>

					{isCustom && (
						<div className="grid grid-cols-2 gap-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
							<div className="space-y-1">
								<Label className="text-[10px] uppercase font-bold" htmlFor={customNameId}>
									Meal Name
								</Label>
								<Input
									className="h-8 text-xs"
									id={customNameId}
									onChange={e => setCustomName(e.target.value)}
									placeholder="e.g. Brunch"
									value={customName}
								/>
							</div>
							<div className="space-y-1">
								<Label className="text-[10px] uppercase font-bold" htmlFor={customTimeId}>
									Time
								</Label>
								<Input
									className="h-8 text-xs"
									id={customTimeId}
									onChange={e => setCustomTime(e.target.value)}
									type="time"
									value={customTime}
								/>
							</div>
						</div>
					)}
				</DialogHeader>
				<Command>
					<CommandInput placeholder="Search recipes..." />
					<CommandList className="max-h-[300px]">
						<CommandEmpty>No recipes found.</CommandEmpty>
						<CommandGroup>
							{allRecipes.map(recipe => (
								<CommandItem key={recipe.id} onSelect={() => handleSelect(recipe.id)} value={recipe.title}>
									<Search className="mr-2 h-4 w-4 text-sea-ink-soft" />
									<span>{recipe.title}</span>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</DialogContent>
		</Dialog>
	);
};
