import {
	Outlet,
	createRootRoute,
	Link,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Cast Iron Cuisine",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="font-sans antialiased text-sea-ink bg-bg-base min-h-screen flex flex-col">
				<header className="site-header border-b border-line bg-header-bg/80 backdrop-blur-md sticky top-0 z-50">
					<div className="page-wrap h-16 flex items-center justify-between">
						<Link
							to="/"
							className="text-xl font-bold font-heading text-palm no-underline hover:text-palm/80"
						>
							Cast Iron Cuisine
						</Link>
						<nav className="flex items-center gap-6">
							<Link
								to="/"
								className="nav-link font-medium [&.active]:font-bold [&.active]:text-sea-ink"
							>
								Recipes
							</Link>
							<Link
								to="/shopping-list"
								className="nav-link font-medium [&.active]:font-bold [&.active]:text-sea-ink"
							>
								Shopping List
							</Link>
						</nav>
					</div>
				</header>

				<main className="flex-1 page-wrap py-8">
					<Outlet />
				</main>

				<footer className="site-footer py-6 mt-12 text-center text-sm text-sea-ink-soft">
					<div className="page-wrap">
						<p>
							&copy; {new Date().getFullYear()} Cast Iron Cuisine. All rights
							reserved.
						</p>
					</div>
				</footer>
				<Scripts />
			</body>
		</html>
	);
}
