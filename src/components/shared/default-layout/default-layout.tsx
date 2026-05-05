import { Outlet, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

export interface DefaultLayoutProps {
	children?: ReactNode;
}

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
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
