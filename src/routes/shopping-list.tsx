import { createFileRoute } from '@tanstack/react-router';
import { ShoppingListPage } from '../components/shopping-list/shopping-list-page/shopping-list-page';

export const Route = createFileRoute('/shopping-list')({
	component: ShoppingListPage,
});
