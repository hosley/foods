import { describe, expect, it } from 'vitest';
import { cn, parseQuantity, toTitleCase } from './utils';

describe('utils', () => {
	describe('cn', () => {
		it('merges class names correctly', () => {
			expect(cn('flex', 'items-center')).toBe('flex items-center');
			expect(cn('px-2 py-1', 'p-4')).toBe('p-4'); // tailwind-merge in action
		});
	});

	describe('parseQuantity', () => {
		it('parses empty string as 0', () => {
			expect(parseQuantity('')).toBe(0);
			expect(parseQuantity('   ')).toBe(0);
		});

		it('parses integers and decimals', () => {
			expect(parseQuantity('1')).toBe(1);
			expect(parseQuantity('1.5')).toBe(1.5);
		});

		it('parses fractions', () => {
			expect(parseQuantity('1/2')).toBe(0.5);
			expect(parseQuantity('3/4')).toBe(0.75);
		});

		it('parses mixed numbers', () => {
			expect(parseQuantity('1 1/2')).toBe(1.5);
			expect(parseQuantity('2 3/4')).toBe(2.75);
		});

		it('returns 0 for invalid inputs', () => {
			expect(parseQuantity('abc')).toBe(0);
			expect(parseQuantity('NaN')).toBe(0);
		});

		it('ensures non-negative results', () => {
			expect(parseQuantity('-5')).toBe(0);
		});
	});

	describe('toTitleCase', () => {
		it('capitalizes each word', () => {
			expect(toTitleCase('hello world')).toBe('Hello World');
			expect(toTitleCase('BASIL PESTO')).toBe('Basil Pesto');
			expect(toTitleCase('fresh basil pesto pasta')).toBe('Fresh Basil Pesto Pasta');
		});

		it('handles single words', () => {
			expect(toTitleCase('recipe')).toBe('Recipe');
		});

		it('handles extra whitespace', () => {
			expect(toTitleCase('  hello   world  ')).toBe('Hello World');
		});
	});
});
