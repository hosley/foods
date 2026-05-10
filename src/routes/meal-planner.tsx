import { createFileRoute } from '@tanstack/react-router';
import { MealPlannerPage } from '../components/meal-planner-page/meal-planner-page';

export const Route = createFileRoute('/meal-planner')({
	component: MealPlannerPage,
});
