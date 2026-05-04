import * as React from "react";
import { Textarea as BaseTextarea } from "../../ui/textarea";

export interface TextareaProps extends React.ComponentProps<"textarea"> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return <BaseTextarea ref={ref} className={className} {...props} />;
	},
);
Textarea.displayName = "Textarea";
