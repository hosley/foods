import * as React from "react";
import {
	Button as BaseButton,
} from "../../ui/button";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
	size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
	asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, ...props }, ref) => {
		return (
			// biome-ignore lint/suspicious/noExplicitAny: machine-owned circular typing
<BaseButton ref={ref} {...(props as any)}>
				{children}
			</BaseButton>
		);
	},
);
Button.displayName = "Button";
