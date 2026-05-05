import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import React, { type ReactNode } from 'react';
import { afterEach, expect, vi } from 'vitest';

expect.extend(matchers);

afterEach(() => {
	cleanup();
});

// Surgical Mocks for Local UI Primitives
// Instead of mocking 3rd party libraries, we mock our own UI components
// at the border. This prunes the module graph and prevents OOM.

export const TriggerMock = ({ children, render }: any) => {
	if (render) {
		return React.cloneElement(render, {}, children);
	}
	return <>{children}</>;
};

vi.mock('@tanstack/react-router', async importOriginal => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		Link: ({ children, to, ...props }: any) => (
			<a href={to} {...props}>
				{children}
			</a>
		),
	};
});

vi.mock('#/components/ui/button', () => ({
	Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
	buttonVariants: () => '',
}));

vi.mock('#/components/ui/card', () => ({
	Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	CardDescription: ({ children }: { children: ReactNode }) => <p>{children}</p>,
	CardFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	CardHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	CardTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
}));

vi.mock('#/components/ui/checkbox', () => ({
	Checkbox: (props: any) => <input type="checkbox" {...props} />,
}));

vi.mock('#/components/ui/input', () => ({
	Input: (props: any) => <input {...props} />,
}));

vi.mock('#/components/ui/textarea', () => ({
	Textarea: (props: any) => <textarea {...props} />,
}));

vi.mock('#/components/ui/label', () => ({
	Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

vi.mock('#/components/ui/popover', () => {
	const MockComponent = ({ children }: { children: ReactNode }) => <>{children}</>;
	return {
		Popover: MockComponent,
		PopoverContent: ({ children }: any) => <div>{children}</div>,
		PopoverTrigger: TriggerMock,
	};
});

vi.mock('#/components/ui/dialog', () => {
	const MockComponent = ({ children }: { children: ReactNode }) => <>{children}</>;
	return {
		Dialog: MockComponent,
		DialogContent: ({ children }: any) => <div>{children}</div>,
		DialogDescription: MockComponent,
		DialogFooter: MockComponent,
		DialogHeader: MockComponent,
		DialogOverlay: () => null,
		DialogPortal: MockComponent,
		DialogTitle: MockComponent,
		DialogTrigger: TriggerMock,
	};
});

vi.mock('#/components/ui/sheet', () => {
	const MockComponent = ({ children }: { children: ReactNode }) => <>{children}</>;
	return {
		Sheet: ({ children, open }: any) => (open ? children : null),
		SheetClose: MockComponent,
		SheetContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
		SheetDescription: MockComponent,
		SheetFooter: MockComponent,
		SheetHeader: MockComponent,
		SheetOverlay: () => null,
		SheetPortal: MockComponent,
		SheetTitle: MockComponent,
		SheetTrigger: TriggerMock,
	};
});

vi.mock('#/components/ui/command', () => {
	const MockComponent = ({ children }: { children: ReactNode }) => <>{children}</>;
	return {
		Command: MockComponent,
		CommandDialog: MockComponent,
		CommandEmpty: MockComponent,
		CommandGroup: MockComponent,
		CommandInput: (props: any) => <input {...props} />,
		CommandItem: ({ children, onSelect }: any) => (
			<div onClick={onSelect} role="option" tabIndex={0}>
				{children}
			</div>
		),
		CommandList: MockComponent,
		CommandSeparator: () => <hr />,
		CommandShortcut: ({ children }: { children: ReactNode }) => <span>{children}</span>,
	};
});

vi.mock('lucide-react', () => {
	const MockIcon = ({ color, size, ...props }: any) => <svg data-testid="lucide-icon" {...props} />;
	return {
		Bookmark: MockIcon,
		BookmarkCheck: MockIcon,
		Check: MockIcon,
		ChefHat: MockIcon,
		ChevronDown: MockIcon,
		Clock: MockIcon,
		Copy: MockIcon,
		Plus: MockIcon,
		Search: MockIcon,
		ShoppingCart: MockIcon,
		Trash2: MockIcon,
	};
});
