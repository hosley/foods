import type { Meta, StoryObj } from "@storybook/react";
import { AddRecipePage } from "./add-recipe-page";

const meta: Meta<typeof AddRecipePage> = {
	title: "Features/AddRecipePage",
	component: AddRecipePage,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<div className="p-8 bg-bg-base min-h-screen">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
