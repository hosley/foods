import * as React from "react";
import { Input as BaseInput } from "../../ui/input";

export interface InputProps extends React.ComponentProps<"input"> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return <BaseInput ref={ref} type={type} className={className} {...props} />;
	},
);
Input.displayName = "Input";
