import { useSetAtom } from 'jotai';
import { Pencil, Trash2 } from 'lucide-react';
import { useId, useState } from 'react';
import { removeMealAtom, updateMealDetailsAtom } from '../../../atoms/meal-plan/meal-plan';
import { Button } from '../../design-system/button/button';
import { Input } from '../../design-system/input/input';
import { Label } from '../../design-system/label/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';

export interface EditMealDialogProps {
	date: string;
	mealName: string;
	time: string;
}

export const EditMealDialog = ({ date, mealName, time }: EditMealDialogProps) => {
	const [open, setOpen] = useState(false);
	const [newName, setNewName] = useState(mealName);
	const [newTime, setNewTime] = useState(time);

	const nameId = useId();
	const timeId = useId();

	const updateMealDetails = useSetAtom(updateMealDetailsAtom);
	const removeMeal = useSetAtom(removeMealAtom);

	const handleSave = () => {
		updateMealDetails({
			date,
			newMealName: newName,
			newTime,
			oldMealName: mealName,
		});
		setOpen(false);
	};

	const handleDelete = () => {
		removeMeal({ date, mealName });
		setOpen(false);
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger render={<Button className="h-5 w-5 p-0 text-sea-ink-soft hover:text-sea-ink" variant="ghost" />}>
				<Pencil className="h-3 w-3" />
				<span className="sr-only">Edit Meal</span>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Meal Details</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-2 gap-4 py-4">
					<div className="space-y-2">
						<Label htmlFor={nameId}>Meal Name</Label>
						<Input id={nameId} onChange={e => setNewName(e.target.value)} value={newName} />
					</div>
					<div className="space-y-2">
						<Label htmlFor={timeId}>Time</Label>
						<Input id={timeId} onChange={e => setNewTime(e.target.value)} type="time" value={newTime} />
					</div>
				</div>
				<DialogFooter className="flex justify-between sm:justify-between items-center w-full">
					<Button
						className="text-destructive hover:text-destructive hover:bg-destructive/10"
						onClick={handleDelete}
						size="sm"
						variant="ghost"
					>
						<Trash2 className="h-4 w-4 mr-2" />
						Delete Meal
					</Button>
					<div className="flex gap-2">
						<Button onClick={() => setOpen(false)} variant="outline">
							Cancel
						</Button>
						<Button onClick={handleSave}>Save Changes</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
