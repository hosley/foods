import type { Meta, StoryObj } from "@storybook/react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "./sheet";
import { Button } from "../button/button";

const meta: Meta<typeof Sheet> = {
	title: "Design System/Sheet",
	component: Sheet,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" />}>
				Open Sheet
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Are you absolutely sure?</SheetTitle>
					<SheetDescription>
						This action cannot be undone. This will permanently delete your account
						and remove your data from our servers.
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
