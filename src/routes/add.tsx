import { createFileRoute } from "@tanstack/react-router";
import { AddRecipePage } from "../components/add-recipe-page/add-recipe-page";

export const Route = createFileRoute("/add")({
	component: AddRecipePage,
});
