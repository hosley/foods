import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet';

const meta: Meta<typeof Sheet> = {
	component: Sheet,
	tags: ['autodocs'],
	title: 'Design System/Sheet',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" />}>Open Sheet</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Are you absolutely sure?</SheetTitle>
					<SheetDescription>
						This action cannot be undone. This will permanently delete your account and remove your data from our
						servers.
					</SheetDescription>
				</SheetHeader>
				<div className="py-4">
					<p>Additional content can go here.</p>
				</div>
				<SheetFooter>
					<Button type="submit">Save changes</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
};
