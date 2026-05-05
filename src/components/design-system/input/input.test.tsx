/**
 * @vitest-environment happy-dom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './input';

describe('Input', () => {
	it('renders correctly', () => {
		render(<Input placeholder="Test Input" />);
		expect(screen.getByPlaceholderText('Test Input')).toBeTruthy();
	});
});
