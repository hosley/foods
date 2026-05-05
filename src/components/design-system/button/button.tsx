import type * as React from 'react';
import { Button as BaseButton } from '../../ui/button';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	asChild?: boolean;
	size?: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';
	variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
}

export const Button = ({
	children,
	ref,
	...props
}: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
	return (
		// biome-ignore lint/suspicious/noExplicitAny: machine-owned circular typing
		<BaseButton ref={ref} {...(props as any)}>
			{children}
		</BaseButton>
	);
};
Button.displayName = 'Button';
