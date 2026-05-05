/**
 * @vitest-environment happy-dom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

describe('Card', () => {
	it('renders all card components correctly', () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Title</CardTitle>
					<CardDescription>Description</CardDescription>
				</CardHeader>
				<CardContent>Content</CardContent>
				<CardFooter>Footer</CardFooter>
			</Card>,
		);
		expect(screen.getByText('Title')).toBeTruthy();
		expect(screen.getByText('Description')).toBeTruthy();
		expect(screen.getByText('Content')).toBeTruthy();
		expect(screen.getByText('Footer')).toBeTruthy();
	});
});
