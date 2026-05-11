import { useAtom } from 'jotai';
import { Settings } from 'lucide-react';
import { useId } from 'react';
import { userSettingsAtom } from '../../../atoms/user-settings/user-settings';
import { Button } from '../../design-system/button/button';
import { Input } from '../../design-system/input/input';
import { Label } from '../../design-system/label/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';

export const UserSettingsDialog = () => {
	const [settings, setSettings] = useAtom(userSettingsAtom);
	const breakfastId = useId();
	const lunchId = useId();
	const dinnerId = useId();

	const handleTimeChange = (meal: keyof typeof settings.defaultTimes, time: string) => {
		setSettings({
			...settings,
			defaultTimes: {
				...settings.defaultTimes,
				[meal]: time,
			},
		});
	};

	return (
		<Dialog>
			<DialogTrigger render={<Button size="icon-sm" variant="ghost" />}>
				<Settings className="h-4 w-4" />
				<span className="sr-only">Settings</span>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>User Settings</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-4">
						<h3 className="text-sm font-bold uppercase tracking-wider text-sea-ink-soft">Default Meal Times</h3>
						<div className="grid gap-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label className="text-right" htmlFor={breakfastId}>
									Breakfast
								</Label>
								<Input
									className="col-span-3"
									id={breakfastId}
									onChange={e => handleTimeChange('Breakfast', e.target.value)}
									type="time"
									value={settings.defaultTimes.Breakfast}
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label className="text-right" htmlFor={lunchId}>
									Lunch
								</Label>
								<Input
									className="col-span-3"
									id={lunchId}
									onChange={e => handleTimeChange('Lunch', e.target.value)}
									type="time"
									value={settings.defaultTimes.Lunch}
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label className="text-right" htmlFor={dinnerId}>
									Dinner
								</Label>
								<Input
									className="col-span-3"
									id={dinnerId}
									onChange={e => handleTimeChange('Dinner', e.target.value)}
									type="time"
									value={settings.defaultTimes.Dinner}
								/>
							</div>
						</div>
					</div>

					<div className="space-y-4 border-t border-line pt-4">
						<h3 className="text-sm font-bold uppercase tracking-wider text-sea-ink-soft">Import Strategy</h3>
						<div className="flex gap-2">
							<Button
								className="flex-1"
								onClick={() => setSettings({ ...settings, importStrategy: 'overwrite' })}
								size="sm"
								variant={settings.importStrategy === 'overwrite' ? 'default' : 'outline'}
							>
								Overwrite
							</Button>
							<Button
								className="flex-1"
								onClick={() => setSettings({ ...settings, importStrategy: 'merge' })}
								size="sm"
								variant={settings.importStrategy === 'merge' ? 'default' : 'outline'}
							>
								Merge
							</Button>
						</div>
						<p className="text-[10px] text-sea-ink-soft italic">
							Choose whether to replace or combine recipes when importing a shared plan.
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
