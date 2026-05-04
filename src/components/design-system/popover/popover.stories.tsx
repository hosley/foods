import type { Meta, StoryObj } from "@storybook/react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "../button/button";

const meta: Meta<typeof Popover> = {
	title: "Design System/Popover",
	component: Popover,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Popover>
			<PopoverTrigger render={<Button variant="outline" />}>
				Open Popover
			</PopoverTrigger>
			<PopoverContent>
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">Dimensions</h4>
						<p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	),
};
