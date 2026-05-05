import { createRootRoute, HeadContent } from '@tanstack/react-router';
import { DefaultLayout } from '../components/shared/default-layout/default-layout';
import { getCommonContent } from '../selectors/get-content/get-content';
import appCss from '../styles.css?url';

export const Route = createRootRoute({
	component: () => (
		<>
			<HeadContent />
			<DefaultLayout />
		</>
	),
	head: () => {
		const content = getCommonContent();
		return {
			links: [
				{
					href: appCss,
					rel: 'stylesheet',
				},
			],
			meta: [
				{
					charSet: 'utf-8',
				},
				{
					content: 'width=device-width, initial-scale=1',
					name: 'viewport',
				},
				{
					title: content.appName,
				},
			],
		};
	},
});
