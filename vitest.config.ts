import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'#': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	test: {
		coverage: {
			exclude: [
				'src/**/*.test.{ts,tsx}',
				'src/**/*.stories.{ts,tsx}',
				'src/test-utils/**',
				'src/routeTree.gen.ts',
				'src/router.tsx',
				'src/components/ui/**',
				'src/routes/**',
				'src/constants/**',
			],
			include: ['src/**/*.{ts,tsx}'],
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			thresholds: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100,
			},
		},
		environment: 'happy-dom',
		globals: false,
		include: ['src/**/*.test.{ts,tsx}'],
		isolate: false,
		maxWorkers: 1,
		pool: 'threads',
		setupFiles: ['./src/test-utils/setup.tsx'],
	},
});
