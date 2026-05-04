import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	resolve: { 
    alias: {
      '#': '/Users/hosley/Code/foods/src',
    }
  },
	plugins: [react()],
	test: {
		environment: 'happy-dom',
		globals: false,
		include: ['src/**/*.test.{ts,tsx}'],
		setupFiles: ['./src/test-utils/setup.tsx'],
		isolate: false,
		pool: 'threads',
		maxWorkers: 1,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.{ts,tsx}'],
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
			thresholds: {
			lines: 100,
			functions: 100,
			branches: 100,
			statements: 100,
			},
			},
			},
			});
