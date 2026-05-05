import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
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
	plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact(), compression({ algorithm: 'brotliCompress' })],
});
