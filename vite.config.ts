import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig({
	base: repositoryName ? `/${repositoryName}/` : '/',
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				},
			},
		},
	},
	plugins: [
		devtools(),
		tailwindcss(),
		tanstackStart({
			pages: [{ path: '/' }],
			prerender: {
				crawlLinks: true,
				enabled: true,
			},
		}),
		viteReact(),
		compression({ algorithm: 'brotliCompress' }),
	],
});
