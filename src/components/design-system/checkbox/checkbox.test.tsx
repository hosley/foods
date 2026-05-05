/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import * as CheckboxModule from './checkbox';

describe('Checkbox', () => {
	it('is exported correctly', () => {
		expect(CheckboxModule.Checkbox).toBeDefined();
	});
});
