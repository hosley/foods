import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
	it('renders correctly with children', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLButtonElement>();
		render(<Button ref={ref}>Ref Button</Button>);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current?.textContent).toBe('Ref Button');
	});

	it('applies additional props correctly', () => {
		const onClick = vi.fn();
		render(
			<Button data-testid="test-button" onClick={onClick}>
				Test Button
			</Button>,
		);
		const button = screen.getByTestId('test-button');
		button.click();
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('renders as a different component when using asChild', () => {
		// Note: asChild functionality comes from Radix via BaseButton.
		// BaseButton in our project seems to support it.
		render(
			<Button asChild data-testid="test-button">
				<a href="/test">Link Button</a>
			</Button>,
		);
		const link = screen.getByRole('link', { name: /link button/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', '/test');
	});
});
