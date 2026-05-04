import { cleanup } from '@testing-library/react';
import { afterEach, vi, expect } from 'vitest';
import React, { type ReactNode } from 'react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
	cleanup();
});

// Surgical Mocks for Local UI Primitives
// Instead of mocking 3rd party libraries, we mock our own UI components 
// at the border. This prunes the module graph and prevents OOM.

const TriggerMock = ({ children, render }: any) => {
  if (render) {
    return React.cloneElement(render, {}, children);
  }
  return <>{children}</>;
};

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  };
});

vi.mock('#/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  buttonVariants: () => '',
}));

vi.mock('#/components/ui/card', () => ({
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  CardDescription: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
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
    PopoverTrigger: TriggerMock,
    PopoverContent: ({ children }: any) => <div>{children}</div>,
  };
});

vi.mock('#/components/ui/dialog', () => {
  const MockComponent = ({ children }: { children: ReactNode }) => <>{children}</>;
  return {
    Dialog: MockComponent,
    DialogTrigger: TriggerMock,
    DialogPortal: MockComponent,
    DialogOverlay: () => null,
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogHeader: MockComponent,
    DialogFooter: MockComponent,
    DialogTitle: MockComponent,
    DialogDescription: MockComponent,
  };
});

vi.mock('#/components/ui/sheet', () => {
  const MockComponent = ({ children }: { children: ReactNode }) => <>{children}</>;
  return {
    Sheet: ({ children, open }: any) => (open ? children : null),
    SheetTrigger: TriggerMock,
    SheetClose: MockComponent,
    SheetPortal: MockComponent,
    SheetOverlay: () => null,
    SheetContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    SheetHeader: MockComponent,
    SheetFooter: MockComponent,
    SheetTitle: MockComponent,
    SheetDescription: MockComponent,
  };
});

vi.mock('#/components/ui/command', () => {
  const MockComponent = ({ children }: { children: ReactNode }) => <>{children}</>;
  return {
    Command: MockComponent,
    CommandInput: (props: any) => <input {...props} />,
    CommandList: MockComponent,
    CommandEmpty: MockComponent,
    CommandGroup: MockComponent,
    CommandItem: ({ children, onSelect }: any) => (
      <div onClick={onSelect} role="option" tabIndex={0}>
        {children}
      </div>
    ),
    CommandSeparator: () => <hr />,
    CommandShortcut: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  };
});

vi.mock('lucide-react', () => {
	const MockIcon = ({ color, size, ...props }: any) => (
		<svg data-testid="lucide-icon" {...props} />
	);
	return {
		Plus: MockIcon,
		Trash2: MockIcon,
		Copy: MockIcon,
		Check: MockIcon,
		ChevronDown: MockIcon,
		Bookmark: MockIcon,
		BookmarkCheck: MockIcon,
		Clock: MockIcon,
		ChefHat: MockIcon,
		ShoppingCart: MockIcon,
		Search: MockIcon,
	};
});
