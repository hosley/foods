import { Outlet, Scripts } from '@tanstack/react-router';
import { useSetAtom } from 'jotai';
import { type ReactNode, useEffect } from 'react';
import { loadMealPlanAtom } from '../../../atoms/meal-plan/meal-plan';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

export interface DefaultLayoutProps {
	children?: ReactNode;
}

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
	const loadMealPlan = useSetAtom(loadMealPlanAtom);

	useEffect(() => {
		loadMealPlan();
	}, [loadMealPlan]);

	return (
		<html lang="en">
			<body className="font-sans antialiased text-sea-ink bg-bg-base min-h-screen flex flex-col">
				<Header />

				<main className="flex-1 page-wrap py-8">{children || <Outlet />}</main>

				<Footer />
				<Scripts />
			</body>
		</html>
	);
};
