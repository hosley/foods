import { useAtomValue, useSetAtom } from 'jotai';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { addRecipeToMealAtom } from '../../../atoms/meal-plan/meal-plan';
import { userSettingsAtom } from '../../../atoms/user-settings/user-settings';
import { DEFAULT_MEAL_SLOTS } from '../../../constants/meal-slots';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';

export interface AddRecipeDialogProps {
	date: string;
}

export const AddRecipeDialog = ({ date }: AddRecipeDialogProps) => {
	const [open, setOpen] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState(DEFAULT_MEAL_SLOTS[2]); // Default to Dinner
	const addRecipeToMeal = useSetAtom(addRecipeToMealAtom);
	const settings = useAtomValue(userSettingsAtom);
	const allRecipes = getAllRecipes();

	const handleSelect = (recipeId: string) => {
		if (selectedSlot) {
			const mealName = selectedSlot.name as keyof typeof settings.defaultTimes;
			addRecipeToMeal({
				date,
				mealName: selectedSlot.name,
				recipeId,
				time: settings.defaultTimes[mealName] || selectedSlot.defaultTime,
			});
			setOpen(false);
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
					<div className="flex gap-2 mt-4">
						{DEFAULT_MEAL_SLOTS.map(slot => (
							<Button
								className="flex-1 text-[10px] h-7 uppercase tracking-tighter font-black"
								key={slot.name}
								onClick={() => setSelectedSlot(slot)}
								size="sm"
								variant={selectedSlot?.name === slot.name ? 'default' : 'outline'}
							>
								{slot.name}
							</Button>
						))}
					</div>
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
