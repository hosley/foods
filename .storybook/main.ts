import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	addons: [],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
};
export default config;
