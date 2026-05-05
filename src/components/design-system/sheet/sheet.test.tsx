/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import * as SheetModule from './sheet';

describe('Sheet', () => {
	it('is exported correctly', () => {
		expect(SheetModule.Sheet).toBeDefined();
		expect(SheetModule.SheetTrigger).toBeDefined();
		expect(SheetModule.SheetClose).toBeDefined();
		expect(SheetModule.SheetContent).toBeDefined();
		expect(SheetModule.SheetHeader).toBeDefined();
		expect(SheetModule.SheetFooter).toBeDefined();
		expect(SheetModule.SheetTitle).toBeDefined();
		expect(SheetModule.SheetDescription).toBeDefined();
	});
});
