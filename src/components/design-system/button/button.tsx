import * as React from "react";
import {
	Button as BaseButton,
	type ButtonProps as BaseButtonProps,
} from "../../ui/button";

export interface ButtonProps extends BaseButtonProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ ...props }, ref) => {
		return <BaseButton ref={ref} {...props} />;
	},
);
Button.displayName = "Button";
