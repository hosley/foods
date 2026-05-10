import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { MealPlannerPage } from '../components/meal-planner-page/meal-planner-page';

const mealPlannerSearchSchema = z.object({
	date: z.string().optional(),
});

export const Route = createFileRoute('/meal-planner')({
	component: MealPlannerPage,
	validateSearch: search => mealPlannerSearchSchema.parse(search),
});
