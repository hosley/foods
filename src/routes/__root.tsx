import {
	createRootRoute,
	HeadContent,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { getCommonContent } from "../selectors/get-content/get-content";
import { DefaultLayout } from "../components/shared/default-layout/default-layout";

export const Route = createRootRoute({
	head: () => {
		const content = getCommonContent();
		return {
			meta: [
				{
					charSet: "utf-8",
				},
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				{
					title: content.appName,
				},
			],
			links: [
				{
					rel: "stylesheet",
					href: appCss,
				},
			],
		};
	},
	component: () => (
		<>
			<HeadContent />
			<DefaultLayout />
		</>
	),
});
